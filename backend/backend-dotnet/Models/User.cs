using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models
{

[DataContract]
public class User
{
    [Key]
    [DataMember]
    [Column("id")]
    public string Id { get; set; } = null!;

    [DataMember]
    [Column("email")]
    public string Email { get; set; } = null!;

    [DataMember]
    [Column("password")]
    public string Password { get; set; } = null!;

    [DataMember]
    [Column("firstName")]
    public string FirstName { get; set; } = null!;

    [DataMember]
    [Column("lastName")]
    public string LastName { get; set; } = null!;

    [DataMember]
    [Column("userType")]
    public string UserType { get; set; } = null!;

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Donor? Donor { get; set; }
    public Beneficiary? Beneficiary { get; set; }
}
}