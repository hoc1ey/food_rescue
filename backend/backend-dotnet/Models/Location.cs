using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models
{
    [Table("Location")]
    public class Location
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = null!;

        [Required]
        [Column("mainStreet")]
        public string MainStreet { get; set; } = null!;

        [Required]
        [Column("secondaryStreet")]
        public string SecondaryStreet { get; set; } = null!;

        [Required]
        [Column("reference")]
        public string Reference { get; set; } = null!;

        [Required]
        [Column("donorId")]
        public int DonorId { get; set; }

        [ForeignKey("DonorId")]
        public Donor Donor { get; set; } = null!;

        [Required]
        [Column("cityCode")]
        public string CityCode { get; set; } = null!;

        [ForeignKey("CityCode")]
        public City City { get; set; } = null!;
    }
}
