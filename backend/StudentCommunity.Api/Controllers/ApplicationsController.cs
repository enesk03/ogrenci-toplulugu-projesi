using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCommunity.Api.Data;
using StudentCommunity.Api.Entities;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/applications")]
public class ApplicationsController : ControllerBase
{
    private readonly AppDbContext _context;
    public ApplicationsController(AppDbContext context) { _context = context; }

    [HttpPost]
    public async Task<IActionResult> Apply([FromBody] Application app)
    {
        app.Status = "Beklemede";
        app.AppliedAt = DateTime.Now;
        _context.Applications.Add(app);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Başvurunuz alındı!" });
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetApplications()
    {
        var apps = await _context.Applications.OrderByDescending(x => x.AppliedAt).ToListAsync();
        return Ok(new { data = apps });
    }

    [Authorize]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
    {
        var app = await _context.Applications.FindAsync(id);
        if (app == null) return NotFound(new { message = "Başvuru bulunamadı." });
        if (newStatus == "Onaylandı")
        {
            var newMember = new Member { Name = $"{app.FirstName} {app.LastName}", Title = "Yeni Üye", Team = app.InterestedTeam, ImageUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png" };
            _context.Members.Add(newMember);
        }
        _context.Applications.Remove(app);
        await _context.SaveChangesAsync();
        return Ok(new { message = $"İşlem başarılı. Başvuru {newStatus} olarak işaretlendi." });
    }

    [Authorize]
    [HttpPost("approve-project/{id}")]
    public async Task<IActionResult> ApproveProject(int id)
    {
        var app = await _context.Applications.FindAsync(id);
        if (app == null) return NotFound();

        var fullName = $"{app.FirstName} {app.LastName}";
        var member = await _context.Members.FirstOrDefaultAsync(m => m.Name == fullName && m.Email == app.Email);

        if (member != null && !string.IsNullOrEmpty(app.InterestedProject))
        {
            if (!member.Projects.Contains(app.InterestedProject))
            {
                member.Projects.Add(app.InterestedProject);
                _context.Entry(member).State = EntityState.Modified;
            }
        }

        app.Status = "Approved"; 
        await _context.SaveChangesAsync();
        return Ok(new { message = "Üye projeye başarıyla eklendi." });
    }

}