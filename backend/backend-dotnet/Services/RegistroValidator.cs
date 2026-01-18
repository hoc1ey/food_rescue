using System.Text.RegularExpressions;

namespace backend_dotnet.Services
{
    public class RegistroValidator
    {
        private const int MIN_NAME_LENGTH = 3;
        private const int MAX_NAME_LENGTH = 50;
        private const int MIN_PASSWORD_LENGTH = 8;

        public static (bool IsValid, string? ErrorMessage) ValidateRegistro(RegistroUsuarioRequest request)
        {
            if (request == null)
                return (false, "Error: Solicitud inválida.");

            if (string.IsNullOrWhiteSpace(request.Email))
                return (false, "Error: El email es obligatorio.");

            if (string.IsNullOrWhiteSpace(request.Password))
                return (false, "Error: La contraseña es obligatoria.");

            if (string.IsNullOrWhiteSpace(request.FirstName))
                return (false, "Error: El nombre es obligatorio.");

            if (string.IsNullOrWhiteSpace(request.LastName))
                return (false, "Error: El apellido es obligatorio.");

            if (string.IsNullOrWhiteSpace(request.UserType))
                return (false, "Error: El tipo de usuario es obligatorio.");

            var emailValidation = ValidateEmail(request.Email);
            if (!emailValidation.IsValid)
                return (false, emailValidation.ErrorMessage);

            var nameValidation = ValidateName(request.FirstName, "nombre");
            if (!nameValidation.IsValid)
                return (false, nameValidation.ErrorMessage);

            var lastNameValidation = ValidateName(request.LastName, "apellido");
            if (!lastNameValidation.IsValid)
                return (false, lastNameValidation.ErrorMessage);

            var passwordValidation = ValidatePassword(request.Password);
            if (!passwordValidation.IsValid)
                return (false, passwordValidation.ErrorMessage);

            var userTypeValidation = ValidateUserType(request.UserType);
            if (!userTypeValidation.IsValid)
                return (false, userTypeValidation.ErrorMessage);

            if (request.UserType.ToUpper() == "DONOR" || request.UserType.ToUpper() == "BENEFICIARY")
            {
                if (string.IsNullOrWhiteSpace(request.LocationName))
                    return (false, "Error: El nombre de la ubicación es obligatorio.");

                if (string.IsNullOrWhiteSpace(request.LocationMainStreet))
                    return (false, "Error: La calle principal es obligatoria.");

                if (string.IsNullOrWhiteSpace(request.LocationSecondaryStreet))
                    return (false, "Error: La calle secundaria es obligatoria.");

                if (string.IsNullOrWhiteSpace(request.LocationReference))
                    return (false, "Error: La referencia es obligatoria.");

                if (string.IsNullOrWhiteSpace(request.LocationCityCode))
                    return (false, "Error: El código de ciudad es obligatorio.");

                var locationValidation = ValidateLocation(request.LocationName, request.LocationMainStreet, 
                                                         request.LocationSecondaryStreet, request.LocationReference);
                if (!locationValidation.IsValid)
                    return (false, locationValidation.ErrorMessage);
            }

            return (true, null);
        }

        private static (bool IsValid, string? ErrorMessage) ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return (false, "Error: El email no puede estar vacío.");

            email = email.Trim().ToLower();

            if (email.Length > 254)
                return (false, "Error: El email es demasiado largo.");

            var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (!Regex.IsMatch(email, emailPattern))
                return (false, "Error: El formato del email no es válido.");

            if (email.StartsWith(".") || email.EndsWith("."))
                return (false, "Error: El email no puede comenzar o terminar con un punto.");

            if (email.Contains(".."))
                return (false, "Error: El email no puede contener puntos consecutivos.");

            return (true, null);
        }

        private static (bool IsValid, string? ErrorMessage) ValidateName(string name, string fieldName)
        {
            if (string.IsNullOrWhiteSpace(name))
                return (false, $"Error: El {fieldName} no puede estar vacío.");

            name = name.Trim();

            if (name.Length < MIN_NAME_LENGTH)
                return (false, $"Error: El {fieldName} debe tener al menos {MIN_NAME_LENGTH} caracteres.");

            if (name.Length > MAX_NAME_LENGTH)
                return (false, $"Error: El {fieldName} no puede exceder {MAX_NAME_LENGTH} caracteres.");

            if (!Regex.IsMatch(name, @"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$"))
                return (false, $"Error: El {fieldName} contiene caracteres no permitidos.");

            return (true, null);
        }

        private static (bool IsValid, string? ErrorMessage) ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return (false, "Error: La contraseña no puede estar vacía.");

            if (password.Length < MIN_PASSWORD_LENGTH)
                return (false, $"Error: La contraseña debe tener al menos {MIN_PASSWORD_LENGTH} caracteres.");

            if (password.Length > 128)
                return (false, "Error: La contraseña es demasiado larga.");

            // Validar que contenga al menos una mayúscula, una minúscula y un número
            if (!Regex.IsMatch(password, @"[A-Z]"))
                return (false, "Error: La contraseña debe contener al menos una letra mayúscula.");

            if (!Regex.IsMatch(password, @"[a-z]"))
                return (false, "Error: La contraseña debe contener al menos una letra minúscula.");

            if (!Regex.IsMatch(password, @"[0-9]"))
                return (false, "Error: La contraseña debe contener al menos un número.");

            return (true, null);
        }

        private static (bool IsValid, string? ErrorMessage) ValidateUserType(string userType)
        {
            if (string.IsNullOrWhiteSpace(userType))
                return (false, "Error: El tipo de usuario no puede estar vacío.");

            userType = userType.Trim().ToUpper();

            if (userType != "DONOR" && userType != "BENEFICIARY")
                return (false, "Error: Tipo de usuario inválido. Valores válidos: DONOR, BENEFICIARY");

            return (true, null);
        }

        private static (bool IsValid, string? ErrorMessage) ValidateLocation(string name, string mainStreet, 
                                                                              string secondaryStreet, string reference)
        {
            if (string.IsNullOrWhiteSpace(name) || name.Length < 3 || name.Length > 100)
                return (false, "Error: El nombre de la ubicación debe tener entre 3 y 100 caracteres.");

            if (string.IsNullOrWhiteSpace(mainStreet) || mainStreet.Length < 3 || mainStreet.Length > 100)
                return (false, "Error: La calle principal debe tener entre 3 y 100 caracteres.");

            if (string.IsNullOrWhiteSpace(secondaryStreet) || secondaryStreet.Length < 3 || secondaryStreet.Length > 100)
                return (false, "Error: La calle secundaria debe tener entre 3 y 100 caracteres.");

            if (string.IsNullOrWhiteSpace(reference) || reference.Length < 3 || reference.Length > 150)
                return (false, "Error: La referencia debe tener entre 3 y 150 caracteres.");

            return (true, null);
        }
    }
}
