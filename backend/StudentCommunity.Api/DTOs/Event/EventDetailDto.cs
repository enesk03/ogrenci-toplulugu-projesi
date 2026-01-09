namespace StudentCommunity.Api.DTOs.Event;

public class EventDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string PosterUrl { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public string Location { get; set; }
}
