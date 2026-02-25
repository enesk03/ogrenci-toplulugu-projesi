namespace StudentCommunity.Api.Entities
{
    public class AdminUser
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "TeamLead"; 
        public string? ResponsibleTeam { get; set; }   
    }
}