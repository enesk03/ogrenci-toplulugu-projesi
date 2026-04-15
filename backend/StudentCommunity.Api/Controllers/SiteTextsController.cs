using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCommunity.Api.Data;
using StudentCommunity.Api.Entities;
using Microsoft.AspNetCore.Authorization;

namespace StudentCommunity.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteTextsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SiteTextsController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var texts = await _context.SiteTexts.ToListAsync();
            return Ok(new { data = texts });
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SiteText siteText)
        {
            var existingText = await _context.SiteTexts.FindAsync(id);
            if (existingText == null) return NotFound(new { message = "Yazı bulunamadı." });
            existingText.Value = siteText.Value;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Yazı güncellendi." });
        }
    }
}