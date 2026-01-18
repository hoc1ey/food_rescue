using backend_dotnet.Data;
using backend_dotnet.Models;
using CoreWCF;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace backend_dotnet.Services
{
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public string RegistrarUsuario(RegistroUsuarioRequest request)
        {
            try
            {
                // Validar datos de entrada
                var (isValid, errorMessage) = RegistroValidator.ValidateRegistro(request);
                if (!isValid || errorMessage != null)
                {
                    return errorMessage ?? "Error: Validación fallida.";
                }

                var existe = _context.Users.Any(u => u.Email == request.Email);
                if (existe)
                {
                    return "Error: El correo electrónico ya está registrado.";
                }

                var usuario = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = request.Email.Trim().ToLower(),
                    Password = BCrypt.Net.BCrypt.HashPassword(request.Password, 10),
                    FirstName = request.FirstName.Trim(),
                    LastName = request.LastName.Trim(),
                    UserType = request.UserType.Trim().ToUpper(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(usuario);
                _context.SaveChanges();

                if (usuario.UserType == "DONOR")
                {
                    var donor = new Donor { UserId = usuario.Id };
                    _context.Donors.Add(donor);
                    _context.SaveChanges();

                    var location = new Location
                    {
                        Name = request.LocationName.Trim(),
                        MainStreet = request.LocationMainStreet.Trim(),
                        SecondaryStreet = request.LocationSecondaryStreet.Trim(),
                        Reference = request.LocationReference.Trim(),
                        CityCode = request.LocationCityCode.Trim().ToUpper(),
                        DonorId = donor.Id
                    };
                    _context.Locations.Add(location);
                }
                else if (usuario.UserType == "BENEFICIARY")
                {
                    _context.Beneficiaries.Add(new Beneficiary { UserId = usuario.Id });
                }

                _context.SaveChanges();
                return $"Éxito: Usuario {request.Email} registrado correctamente.";
            }
            catch (DbUpdateException ex)
            {
                return $"Error de base de datos: {ex.InnerException?.Message ?? ex.Message}";
            }
            catch (Exception ex)
            {
                return $"Error interno: {ex.Message}";
            }
        }
    }
}