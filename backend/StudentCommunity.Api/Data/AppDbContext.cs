using Microsoft.EntityFrameworkCore;
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
        public DbSet<Application> Applications { get; set; }
        public DbSet<Team> Teams { get; set; }

        public DbSet<Project> Projects { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Member>()
                .Property(e => e.Projects)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                );
        }
    }
}