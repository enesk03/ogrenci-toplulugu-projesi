using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCommunity.Api.Data;
using StudentCommunity.Api.DTOs.Common;
using StudentCommunity.Api.DTOs.Event;
using StudentCommunity.Api.Entities;

[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly AppDbContext _context;

    public EventsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetEvents()
    {
        var events = await _context.Events
            .Where(x => x.IsActive)
            .OrderBy(x => x.EventDate)
            .Select(x => new EventListDto
            {
                Id = x.Id,
                Title = x.Title,
                PosterUrl = x.PosterUrl,
                Date = x.EventDate
            })
            .ToListAsync();

        return Ok(ApiResponse<List<EventListDto>>.Ok(events));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEvent(int id)
    {
        var ev = await _context.Events
            .Where(x => x.Id == id)
            .Select(x => new EventDetailDto
            {
                Id = x.Id,
                Title = x.Title,
                PosterUrl = x.PosterUrl,
                Description = x.Description,
                Date = x.EventDate,
                Location = x.Location
            })
            .FirstOrDefaultAsync();

        if (ev == null)
            return NotFound(ApiResponse<string>.Fail("Etkinlik bulunamadı"));

        return Ok(ApiResponse<EventDetailDto>.Ok(ev));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Event newEvent)
    {
        if (newEvent.EventDate == DateTime.MinValue) newEvent.EventDate = DateTime.Now.AddDays(7);
        newEvent.IsActive = true;

        _context.Events.Add(newEvent);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Etkinlik eklendi", data = newEvent });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var eventItem = await _context.Events.FindAsync(id);
        if (eventItem == null)
        {
            return NotFound(new { message = "Etkinlik bulunamadı." });
        }

        _context.Events.Remove(eventItem);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Etkinlik başarıyla silindi." });
    }

}
