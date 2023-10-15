using Microsoft.AspNetCore.Identity;
using Server.Models;

namespace Server.Data;

public static class ApplicationDbInitializer
{
    public static void Initialize(ApplicationDbContext db, UserManager<ApplicationUser> um, RoleManager<IdentityRole> rm)
    {
        
        // Delete existing database
        db.Database.EnsureDeleted();

        // Create new database
        db.Database.EnsureCreated();
        
        // Create roles
        var adminRole = new IdentityRole("Admin");
        rm.CreateAsync(adminRole).Wait();
        
        
        // Add standard users
        var admin = new ApplicationUser()
            { UserName = "admin@uia.no", Email = "admin@uia.no", Name = "Admin",LastName = "Adminson",StudentNumber = "S123456", EmailConfirmed = true };
        
        var user = new ApplicationUser()
            { UserName = "user@uia.no", Email = "user@uia.no", Name = "User", LastName = "Userson",StudentNumber = "S123457" ,EmailConfirmed = true };
        
        var user2 = new ApplicationUser()
            { UserName = "user2@uia.no", Email = "user2@uia.no", Name = "User2",LastName = "User2son",StudentNumber = "S123457", EmailConfirmed = true };

        um.CreateAsync(admin, "Password1.").Wait();
        um.AddToRoleAsync(admin, "Admin").Wait();
        
        um.CreateAsync(user, "Password1.").Wait();
        um.CreateAsync(user2, "Password1.").Wait();
        
       
        // Save changes made to database
        db.SaveChanges();
        
    }
}