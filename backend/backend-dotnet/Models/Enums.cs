using System.Runtime.Serialization;

namespace backend_dotnet.Models
{
    [DataContract(Name = "UserType")]
    public enum UserType 
    { 
        [EnumMember] DONOR, 
        [EnumMember] BENEFICIARY 
    }

    [DataContract(Name = "Days")]
    public enum Days 
    { 
        [EnumMember] MONDAY, [EnumMember] TUESDAY, [EnumMember] WEDNESDAY, 
        [EnumMember] THURSDAY, [EnumMember] FRIDAY, [EnumMember] SATURDAY, [EnumMember] SUNDAY 
    }
}