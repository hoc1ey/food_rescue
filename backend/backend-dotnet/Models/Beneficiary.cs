using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models
{
    [Table("Beneficiary")]
    public class Beneficiary
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("userId")]
        public string UserId { get; set; } = null!;

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
}