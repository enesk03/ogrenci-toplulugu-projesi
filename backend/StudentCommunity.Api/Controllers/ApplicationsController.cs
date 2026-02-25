using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCommunity.Api.Data;
using StudentCommunity.Api.Entities;

[ApiController]
[Route("api/applications")]
public class ApplicationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ApplicationsController(AppDbContext context)
    {
        _context = context;
    }

    // 1. BAŞVURU YAP (Herkes erişebilir)
    [HttpPost]
    public async Task<IActionResult> Apply([FromBody] Application app)
    {
        app.Status = "Beklemede";
        app.AppliedAt = DateTime.Now;

        _context.Applications.Add(app);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Başvurunuz alındı!" });
    }

    // 2. BAŞVURULARI LİSTELE (Sadece Adminler)
    [HttpGet]
    public async Task<IActionResult> GetApplications()
    {
        var apps = await _context.Applications
            .OrderByDescending(x => x.AppliedAt)
            .ToListAsync();

        return Ok(new { data = apps });
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
    {
        var app = await _context.Applications.FindAsync(id);

        if (app == null)
            return NotFound(new { message = "Başvuru bulunamadı." });

        if (newStatus == "Onaylandı")
        {
            var newMember = new Member
            {
                Name = $"{app.FirstName} {app.LastName}", 
                Title = "Yeni Üye", 
                Team = app.InterestedTeam, 
                ImageUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png" // Varsayılan Profil Resmi
            };

            // 2. Üyeler tablosuna ekle
            _context.Members.Add(newMember);
        }

        // REDDEDİLDİ VEYA ONAYLANDI (HER İKİ DURUMDA DA SİL)
        
        _context.Applications.Remove(app);

        await _context.SaveChangesAsync();

        return Ok(new { message = $"İşlem başarılı. Başvuru {newStatus} olarak işaretlendi ve listeden kaldırıldı." });
    }

}