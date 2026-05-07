namespace StudentCommunity.Api.DTOs.Project
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? Team { get; set; }
        public string? Category { get; set; }
        public List<string> ProjectMembers { get; set; } = new();
    }
}