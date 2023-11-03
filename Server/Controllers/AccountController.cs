using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] Signup model)
    {
        if (ModelState.IsValid)
        {
            var user = new ApplicationUser 
            { 
                UserName = model.Email,
                Email = model.Email,
                Name = model.Name,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber,
                StudentNumber = model.StudentNumber,
                EmailConfirmed = true
                
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                return Ok(new { message = "Signup successful" });
            }
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }
        return BadRequest(new { message = "User already exists", errors = ModelState });
    }

   [HttpPost("login")]
public async Task<IActionResult> Login([FromBody] Login model)
{
    if (ModelState.IsValid)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            ModelState.AddModelError(string.Empty, "Invalid login attempt.");
            return BadRequest(new { message = "Login failed", errors = ModelState });
        }

        var result = await _signInManager.PasswordSignInAsync(user, model.Password, isPersistent: true, lockoutOnFailure: false);
        if (result.Succeeded)
        {
            return Ok(new { message = "Login successful", name = user.Name });
        }
        ModelState.AddModelError(string.Empty, "Invalid login attempt.");
    }
    return BadRequest(new { message = "Login failed", errors = ModelState });
}

[HttpPost("logout")]
public async Task<IActionResult> Logout()
{
    await _signInManager.SignOutAsync(); // This will clear the cookie
    return Ok(new { message = "Logout successful" });
}

}
