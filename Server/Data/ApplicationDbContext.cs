using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Tool> Tools { get; set; }
    public DbSet<ToolRenting> ToolRentings { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configuration for ToolRenting to ApplicationUser relationship
        builder.Entity<ToolRenting>()
            .HasOne(tr => tr.ApplicationUser)
            .WithMany()
            .HasForeignKey(tr => tr.ApplicationUserId)
            .IsRequired();

    }
}
