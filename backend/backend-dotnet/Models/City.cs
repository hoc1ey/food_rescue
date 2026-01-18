using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace backend_dotnet.Models
{
    [DataContract]
    [Table("City")]
    public class City
    {
        [Key]
        [DataMember]
        [Column("code")]
        public required string Code { get; set; }

        [DataMember]
        [Column("name")]
        public required string Name { get; set; }

    }
}