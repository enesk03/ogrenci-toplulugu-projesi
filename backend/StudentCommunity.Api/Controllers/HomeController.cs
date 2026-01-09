using Microsoft.AspNetCore.Mvc;
using StudentCommunity.Api.Data;

namespace StudentCommunity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HomeController(AppDbContext context)
        {
            _context = context;
        }

    }
}
