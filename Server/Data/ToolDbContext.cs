using Microsoft.EntityFrameworkCore;

namespace Server.Data
{
    public class ToolDbContext : DbContext
    {
        public ToolDbContext(DbContextOptions<ToolDbContext> options) : base(options)
        {
        }

        public DbSet<Tool> Tools { get; set; }
        public DbSet<ToolRenting> ToolRentings { get; set; }
        public DbSet<Category> Categories { get; set; }
    }
}
