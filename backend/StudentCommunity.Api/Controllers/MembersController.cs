using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCommunity.Api.Data;
using StudentCommunity.Api.Entities;
using Microsoft.AspNetCore.Authorization;

namespace StudentCommunity.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MembersController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var members = await _context.Members.OrderBy(x => x.Order).ToListAsync();
            return Ok(new { data = members });
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Member member)
        {
            _context.Members.Add(member);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Üye eklendi", data = member });
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null) return NotFound();
            _context.Members.Remove(member);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Üye silindi" });
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Member member)
        {
            if (id != member.Id) return BadRequest();

            var existingMember = await _context.Members.FindAsync(id);
            if (existingMember == null) return NotFound();

            existingMember.Name = member.Name;
            existingMember.Title = member.Title;
            existingMember.ImageUrl = member.ImageUrl;
            existingMember.Team = member.Team;

            existingMember.GraduationNote = member.GraduationNote;
            existingMember.Projects = member.Projects;           
            existingMember.IsGraduated = member.IsGraduated;
            existingMember.Email = member.Email;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MemberExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        private bool MemberExists(int id)
        {
            return _context.Members.Any(e => e.Id == id);
        }

    }
}