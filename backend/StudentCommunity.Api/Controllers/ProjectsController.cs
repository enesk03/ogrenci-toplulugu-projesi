using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCommunity.Api.Data;
using StudentCommunity.Api.Entities;
using StudentCommunity.Api.DTOs.Project;

namespace StudentCommunity.Api.Controllers
{
    [Route("api/projeler")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var projects = await _context.Projects
                .Select(p => new ProjectDetailDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    ImageUrl = p.ImageUrl,
                    GithubUrl = p.GithubUrl,
                    Team = p.Team,
                    Category = p.Category,
                    ProjectMembers = p.Members.Select(m => m.Name).ToList()
                })
                .ToListAsync();

            return Ok(new { data = projects });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var project = await _context.Projects
                .Where(p => p.Id == id)
                .Select(p => new ProjectDetailDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    ImageUrl = p.ImageUrl,
                    GithubUrl = p.GithubUrl,
                    Team = p.Team,
                    Category = p.Category,
                    ProjectMembers = p.Members.Select(m => m.Name).ToList()
                })
                .FirstOrDefaultAsync();

            if (project == null) return NotFound();

            return Ok(new { data = project });
        }

        [HttpPost]
        public async Task<IActionResult> Create(ProjectDto dto)
        {
            var project = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                GithubUrl = dto.GithubUrl,
                Team = dto.Team ?? "Genel",
                Category = dto.Category ?? "Diğer"
            };

            if (dto.ProjectMembers != null && dto.ProjectMembers.Any())
            {
                var members = await _context.Members
                    .Where(m => dto.ProjectMembers.Contains(m.Name))
                    .ToListAsync();
                project.Members = members;
            }

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return Ok(new { data = dto });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProjectDto dto)
        {
            var project = await _context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return NotFound();

            project.Title = dto.Title;
            project.Description = dto.Description;
            project.ImageUrl = dto.ImageUrl;
            project.GithubUrl = dto.GithubUrl;
            project.Team = dto.Team;
            project.Category = dto.Category;

            project.Members.Clear();

            if (dto.ProjectMembers != null && dto.ProjectMembers.Any())
            {
                var selectedMembers = await _context.Members
                    .Where(m => dto.ProjectMembers.Contains(m.Name))
                    .ToListAsync();

                foreach (var member in selectedMembers)
                {
                    project.Members.Add(member);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { data = dto });
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
}