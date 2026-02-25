using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens; 
using StudentCommunity.Api.Data;
using StudentCommunity.Api.Entities;
using System.IdentityModel.Tokens.Jwt; 
using System.Security.Claims; 
using System.Text; 

namespace StudentCommunity.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto.Username == "admin" && loginDto.Password == "123456")
            {
                var token = GenerateJwtToken(0, "admin", "SuperAdmin", "Yönetim Kurulu");
                return Ok(new
                {
                    message = "Giriş Başarılı (SuperAdmin)",
                    token = token, 
                    role = "SuperAdmin",
                    team = "Yönetim Kurulu"
                });
            }

            var user = await _context.AdminUsers
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username && u.Password == loginDto.Password);

            if (user != null)
            {
                var token = GenerateJwtToken(user.Id, user.Username, "TeamLead", user.ResponsibleTeam);
                return Ok(new
                {
                    message = "Giriş Başarılı",
                    token = token,
                    userId = user.Id,
                    username = user.Username,
                    role = "TeamLead",
                    team = user.ResponsibleTeam
                });
            }

            return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı!" });
        }

        private string GenerateJwtToken(int userId, string username, string role, string team)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("bu_cok_gizli_ve_uzun_bir_anahtar_kelimedir_123456");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", userId.ToString()),
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Role, role),
                    new Claim("Team", team ?? "")
                }),
                Expires = DateTime.UtcNow.AddHours(2), 
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}