using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCommunity.Api.Data;
using StudentCommunity.Api.Entities;

namespace StudentCommunity.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteTextsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SiteTextsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var texts = await _context.SiteTexts.ToListAsync();
            return Ok(new { data = texts });
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] SiteText updatedText)
        {
            var text = await _context.SiteTexts.FirstOrDefaultAsync(t => t.Key == updatedText.Key);

            if (text == null)
            {
                return NotFound(new { message = "Bu ayar bulunamadı." });
            }

            text.Value = updatedText.Value;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Yazı güncellendi", data = text });
        }

    }
}