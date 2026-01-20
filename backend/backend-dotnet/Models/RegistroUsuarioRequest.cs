using System.Runtime.Serialization;

namespace backend_dotnet.Models
{
    // Definimos el Namespace para que coincida con el "tem" del frontend
    [DataContract(Namespace = "http://food-rescue.com")]
    public class RegistroUsuarioRequest
    {
        [DataMember(Order = 1)]
        public string Email { get; set; } = null!;

        [DataMember(Order = 2)]
        public string FirstName { get; set; } = null!;

        [DataMember(Order = 3)]
        public string LastName { get; set; } = null!;

        [DataMember(Order = 4)]
        public string LocationCityCode { get; set; } = null!;

        [DataMember(Order = 5)]
        public string LocationMainStreet { get; set; } = null!;

        [DataMember(Order = 6)]
        public string LocationName { get; set; } = null!;

        [DataMember(Order = 7)]
        public string LocationReference { get; set; } = null!;

        [DataMember(Order = 8)]
        public string LocationSecondaryStreet { get; set; } = null!;

        [DataMember(Order = 9)]
        public string Password { get; set; } = null!;

        [DataMember(Order = 10)]
        public string UserType { get; set; } = null!;
    }
}