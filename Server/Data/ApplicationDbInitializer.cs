using Microsoft.AspNetCore.Identity;
using Server.Models;
using System.Threading.Tasks;

namespace Server.Data
{
    public static class ApplicationDbInitializer
    {
        public static async Task Initialize(ApplicationDbContext db, UserManager<ApplicationUser> um, RoleManager<IdentityRole> rm)
        {
            // Create roles
            if (!await rm.RoleExistsAsync("Admin"))
            {
                var adminRole = new IdentityRole("Admin");
                await rm.CreateAsync(adminRole);
            }

            // Add standard users
            await CreateUser(um, "admin@uia.no", "Admin", "Adminson", "S123456", "Password1.", "Admin");
            await CreateUser(um, "user@uia.no", "User", "Userson", "S123457", "Password1.");
            await CreateUser(um, "user2@uia.no", "User2", "User2son", "S123457", "Password1.");

            // Save changes made to database
            db.SaveChanges();
        }

        private static async Task CreateUser(UserManager<ApplicationUser> um, string email, string firstName, string lastName, string studentNumber, string password, string role = null)
        {
            if (await um.FindByNameAsync(email) == null)
            {
                var user = new ApplicationUser()
                {
                    UserName = email,
                    Email = email,
                    Name = firstName,
                    LastName = lastName,
                    StudentNumber = studentNumber,
                    EmailConfirmed = true
                };

                await um.CreateAsync(user, password);

                if (role != null)
                {
                    await um.AddToRoleAsync(user, role);
                }
            }
        }
    }
}
