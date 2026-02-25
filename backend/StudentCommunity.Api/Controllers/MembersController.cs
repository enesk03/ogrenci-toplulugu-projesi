using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCommunity.Api.Data;
using StudentCommunity.Api.Entities;

namespace StudentCommunity.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MembersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var members = await _context.Members
                                    .OrderBy(x => x.Order)
                                    .ToListAsync();

            return Ok(new { data = members });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Member member)
        {
            _context.Members.Add(member);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Üye eklendi", data = member });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
            {
                return NotFound();
            }

            _context.Members.Remove(member);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Üye silindi" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Member member)
        {
            var existingMember = await _context.Members.FindAsync(id);

            if (existingMember == null)
            {
                return NotFound(new { message = "Üye bulunamadı." });
            }

           
            existingMember.Name = member.Name;
            existingMember.Title = member.Title;
            existingMember.ImageUrl = member.ImageUrl;
            existingMember.Team = member.Team;
            existingMember.Order = member.Order; 

            await _context.SaveChangesAsync();

            return Ok(new { message = "Üye başarıyla güncellendi.", data = existingMember });
        }
    }
}