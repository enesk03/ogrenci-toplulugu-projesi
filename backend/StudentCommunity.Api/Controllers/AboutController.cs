using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCommunity.Api.Data;
using StudentCommunity.Api.Entities;

namespace StudentCommunity.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AboutController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AboutController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var about = await _context.Abouts.FirstOrDefaultAsync();

            if (about == null)
            {
                return NotFound("Hakkımızda verisi bulunamadı.");
            }

            return Ok(new { data = about }); 
        }
    }
}