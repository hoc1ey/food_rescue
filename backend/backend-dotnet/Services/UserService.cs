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

        public async Task<string> RegistrarUsuario(RegistroUsuarioRequest request)
        {
            try
            {
                // Validar datos de entrada
                var (isValid, errorMessage) = RegistroValidator.ValidateRegistro(request);
                if (!isValid || errorMessage != null)
                {
                    return errorMessage ?? "Error: Validación fallida.";
                }

                var existe = await _context.Users.AnyAsync(u => u.Email == request.Email);
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

                await _context.Users.AddAsync(usuario);
                await _context.SaveChangesAsync();

                if (usuario.UserType == "DONOR")
                {
                    var donor = new Donor { UserId = usuario.Id };
                    await _context.Donors.AddAsync(donor);
                    await _context.SaveChangesAsync();

                    var location = new Location
                    {
                        Name = request.LocationName.Trim(),
                        MainStreet = request.LocationMainStreet.Trim(),
                        SecondaryStreet = request.LocationSecondaryStreet.Trim(),
                        Reference = request.LocationReference.Trim(),
                        CityCode = request.LocationCityCode.Trim().ToUpper(),
                        DonorId = donor.Id
                    };
                    await _context.Locations.AddAsync(location);
                }
                else if (usuario.UserType == "BENEFICIARY")
                {
                    await _context.Beneficiaries.AddAsync(new Beneficiary { UserId = usuario.Id });
                }

                await _context.SaveChangesAsync();
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