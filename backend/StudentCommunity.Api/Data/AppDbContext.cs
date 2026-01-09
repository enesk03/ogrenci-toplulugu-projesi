using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using StudentCommunity.Api.Entities;



namespace StudentCommunity.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<About> Abouts { get; set; }
        public DbSet<SiteText> SiteTexts { get; set; }
        public DbSet<AdminUser> AdminUsers { get; set; }


    }
}
