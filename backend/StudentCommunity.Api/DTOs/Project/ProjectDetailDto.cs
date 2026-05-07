namespace StudentCommunity.Api.DTOs.Project
{
    public class ProjectDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? Team { get; set; }
        public string? Category { get; set; }
        
        public List<string> ProjectMembers { get; set; } = new();
    }
}