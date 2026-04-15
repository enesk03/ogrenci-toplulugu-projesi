using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCommunity.Api.Data;
using StudentCommunity.Api.DTOs.Common;
using StudentCommunity.Api.DTOs.Event;
using StudentCommunity.Api.Entities;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly AppDbContext _context;
    public EventsController(AppDbContext context) { _context = context; }

    [HttpGet]
    public async Task<IActionResult> GetEvents()
    {
        var events = await _context.Events.OrderByDescending(x => x.EventDate)
            .Select(x => new EventListDto { Id = x.Id, Title = x.Title, PosterUrl = x.PosterUrl, Date = x.EventDate, OrganizerTeam = x.OrganizerTeam })
            .ToListAsync();
        return Ok(ApiResponse<List<EventListDto>>.Ok(events));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEvent(int id)
    {
        var ev = await _context.Events.Where(x => x.Id == id)
            .Select(x => new EventDetailDto { Id = x.Id, Title = x.Title, PosterUrl = x.PosterUrl, Description = x.Description, Date = x.EventDate, Location = x.Location, OrganizerTeam = x.OrganizerTeam })
            .FirstOrDefaultAsync();
        if (ev == null) return NotFound(ApiResponse<string>.Fail("Etkinlik bulunamadı"));
        return Ok(ApiResponse<EventDetailDto>.Ok(ev));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Event>> PostEvent(Event @event)
    {
        if (string.IsNullOrEmpty(@event.OrganizerTeam)) @event.OrganizerTeam = "Yönetim Kurulu";
        if (@event.EventDate < System.Data.SqlTypes.SqlDateTime.MinValue.Value) @event.EventDate = DateTime.Now;
        _context.Events.Add(@event);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetEvent), new { id = @event.Id }, @event);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutEvent(int id, [FromBody] Event @event)
    {
        var existingEvent = await _context.Events.FindAsync(id);
        if (existingEvent == null) return NotFound(new { message = "Etkinlik bulunamadı." });
        existingEvent.Title = @event.Title;
        existingEvent.Description = @event.Description;
        existingEvent.EventDate = @event.EventDate;
        existingEvent.Location = @event.Location;
        existingEvent.PosterUrl = @event.PosterUrl;
        if (!string.IsNullOrEmpty(@event.OrganizerTeam)) existingEvent.OrganizerTeam = @event.OrganizerTeam;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Güncelleme başarılı." });
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var eventItem = await _context.Events.FindAsync(id);
        if (eventItem == null) return NotFound(new { message = "Etkinlik bulunamadı." });
        _context.Events.Remove(eventItem);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Etkinlik başarıyla silindi." });
    }
}