using System.ComponentModel.DataAnnotations;

namespace StudentCommunity.Api.Entities
{
    public class Team
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; 
    }
}