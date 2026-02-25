using System.ComponentModel.DataAnnotations;

namespace StudentCommunity.Api.Entities
{
    public class Application
    {
        [Key]
        public int Id { get; set; }

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        public string Department { get; set; } = string.Empty; // Bölüm
        public string Grade { get; set; } = string.Empty;      // Sınıf (1, 2, 3, 4, Hazırlık)

        public string InterestedTeam { get; set; } = string.Empty; // Hangi takımı istiyor?
        public string Reason { get; set; } = string.Empty;         // Neden katılmak istiyor?

        public string Status { get; set; } = "Beklemede"; // Beklemede, Onaylandı, Reddedildi
        public DateTime AppliedAt { get; set; } = DateTime.Now;
    }
}