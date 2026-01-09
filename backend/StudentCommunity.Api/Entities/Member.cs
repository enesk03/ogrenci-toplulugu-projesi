namespace StudentCommunity.Api.Entities
{
    public class Member
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;     
        public string Title { get; set; } = string.Empty;    
        public string ImageUrl { get; set; } = string.Empty; 
        public int Order { get; set; } 
    }
}