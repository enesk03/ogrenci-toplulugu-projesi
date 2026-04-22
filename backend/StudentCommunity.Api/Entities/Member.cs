namespace StudentCommunity.Api.Entities
{
    public class Member
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int Order { get; set; }
        public string? Team { get; set; }
        public string? Email { get; set; }
        public bool IsGraduated { get; set; } = false;
        public string? GraduationNote { get; set; }
        public string? ContactInfo { get; set; }
        public List<string> Projects { get; set; } = new();
        private DateTime _createdAt = DateTime.Now;
        public DateTime CreatedAt
        {
            get => _createdAt;
            set => _createdAt = (value == default) ? DateTime.Now : value;
        }
    }
}