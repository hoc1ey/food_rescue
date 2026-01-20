using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models
{
    [Table("User")]
    public class User
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = null!;

        [Required]
        [Column("email")]
        public string Email { get; set; } = null!;

        [Required]
        [Column("password")]
        public string Password { get; set; } = null!;

        [Required]
        [Column("firstName")]
        public string FirstName { get; set; } = null!;

        [Required]
        [Column("lastName")]
        public string LastName { get; set; } = null!;

        [Required]
        [Column("userType")]
        public UserType UserType { get; set; } // <-- CAMBIO: Ahora es un Enum, no string

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; }

        [Column("updatedAt")]
        public DateTime UpdatedAt { get; set; }

        // Propiedades de navegación para Entity Framework
        public virtual Donor? Donor { get; set; }
        public virtual Beneficiary? Beneficiary { get; set; }
    }
}