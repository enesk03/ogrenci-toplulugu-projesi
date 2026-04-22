namespace StudentCommunity.Api.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? Team { get; set; }
        public string Category { get; set; } = "Diðer";
    }
}