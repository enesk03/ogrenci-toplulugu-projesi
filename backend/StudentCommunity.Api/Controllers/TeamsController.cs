using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCommunity.Api.Data;
using StudentCommunity.Api.Entities;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class TeamsController : ControllerBase
{
    private readonly AppDbContext _context;
    public TeamsController(AppDbContext context) { _context = context; }

    [HttpGet]
    public async Task<IActionResult> GetTeams()
    {
        var teams = await _context.Teams.ToListAsync();
        return Ok(new { data = teams });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddTeam([FromBody] Team team)
    {
        if (await _context.Teams.AnyAsync(t => t.Name == team.Name)) return BadRequest(new { message = "Bu takım zaten var." });
        _context.Teams.Add(team);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Takım başarıyla oluşturuldu.", data = team });
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(int id)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null) return NotFound();
        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Takım silindi." });
    }
}