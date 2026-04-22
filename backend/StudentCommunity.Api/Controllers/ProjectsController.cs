using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCommunity.Api.Data;
using StudentCommunity.Api.Entities;

[Route("api/projeler")]
[ApiController]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _context;
    public ProjectsController(AppDbContext context) { _context = context; }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var projects = await _context.Projects.ToListAsync();
        return Ok(new { data = projects });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();
        return Ok(new { data = project });
    }

    [HttpPost]
    public async Task<IActionResult> Create(Project project)
    {
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        return Ok(new { data = project });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Project project)
    {
        if (id != project.Id) return BadRequest();
        _context.Entry(project).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await _context.Projects.FindAsync(id);
        if (p == null) return NotFound();
        _context.Projects.Remove(p);
        await _context.SaveChangesAsync();
        return Ok();
    }
}