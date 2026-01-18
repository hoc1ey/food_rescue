using System.Runtime.Serialization;

namespace backend_dotnet.Services
{
    [DataContract(Namespace = "http://food-rescue.com")]
    public class RegistroUsuarioRequest
    {
        [DataMember]
        public required string Email { get; set; }

        [DataMember]
        public required string Password { get; set; }

        [DataMember]
        public required string FirstName { get; set; }

        [DataMember]
        public required string LastName { get; set; }

        [DataMember]
        public required string UserType { get; set; }

        [DataMember]
        public required string LocationName { get; set; }

        [DataMember]
        public required string LocationMainStreet { get; set; }

        [DataMember]
        public required string LocationSecondaryStreet { get; set; }

        [DataMember]
        public required string LocationReference { get; set; }

        [DataMember]
        public required string LocationCityCode { get; set; }
    }
}
