namespace StudentCommunity.Api.DTOs.Project
{
    public class ProjectListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Team { get; set; }
        public string? Category { get; set; }
        public string? ImageUrl { get; set; }
        public int MemberCount { get; set; } 
    }
}