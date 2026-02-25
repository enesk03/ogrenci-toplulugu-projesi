namespace StudentCommunity.Api.Entities
{
    public class About
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty; 
        public string Mission { get; set; } = string.Empty;     
        public string Vision { get; set; } = string.Empty;     
    }
}