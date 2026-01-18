using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models
{
    [Table("Donor")]
    public class Donor
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("userId")]
        public string UserId { get; set; } = null!;

        // Navegación para EF Core
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        public ICollection<Location> Locations { get; set; } = new List<Location>();
    }
}