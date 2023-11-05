using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;


namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AccountController> _logger;

    public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, ILogger<AccountController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _logger = logger; // Initialize the logger
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
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            // Generate the token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials =
                    new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { token = tokenString, name = user.Name, message = "Login successful" });
        }
        else
        {
            return BadRequest(new { message = "Login failed" });
        }
    }
    
    // Method to redirect to Feide for authentication
[HttpGet("login/feide")]
public IActionResult LoginWithFeide()
{
    var redirectUrl = Url.Action(nameof(HandleFeideLogin), "Account");
    var properties = _signInManager.ConfigureExternalAuthenticationProperties("Feide", redirectUrl);
    return new ChallengeResult("Feide", properties);
}

    // Callback method for handling the response from Feide
    [HttpGet("handle-feide-login")]
    public async Task<IActionResult> HandleFeideLogin()
    {
        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info == null)
        {
            return RedirectToAction("Login"); // Replace with your login endpoint if different
        }

        // Sign in the user with this external login provider if the user already has a login.
        var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);

        if (result.Succeeded)
        {
            // User is now signed in, now get your user based on the login info:
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
            // Generate a JWT token for the user and return it to the client.
            var token = GenerateJwtTokenForUser(user);
            // Redirect to the client application with the JWT token
            var reactAppUrl = "http://localhost:3000/login";
            reactAppUrl += $"?token={token}&name={Uri.EscapeDataString(user.Name)}"; // Assuming user.Name contains the name
            return Redirect(reactAppUrl);
        }
        else
        {
            // Attempt to retrieve the email and name from Feide's specific claim types
            var emailClaim = info.Principal.FindFirst("email")?.Value; // Custom claim type as provided by Feide
            var nameClaim = info.Principal.FindFirst("userinfo-name")?.Value; // Custom claim type as provided by Feide

            // Check if both claims are not null
            if (!string.IsNullOrEmpty(emailClaim) && !string.IsNullOrEmpty(nameClaim))
            {
                // Redirect to the registration page with email and name as query parameters
                var registrationPageUrl = "http://localhost:3000/signupFeide";
                registrationPageUrl += $"?email={Uri.EscapeDataString(emailClaim)}&name={Uri.EscapeDataString(nameClaim)}";
                return Redirect(registrationPageUrl);
            }
            else
            {
                // Handle the case when the necessary claims are not present
                return BadRequest("Required information is missing from the external login provider.");
            }
        }
    }

    // Utility method to generate JWT token for a given user
    private string GenerateJwtTokenForUser(ApplicationUser user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                // Add more claims if needed
            }),
            Expires = DateTime.UtcNow.AddHours(1), // Token expiration time
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    
  


    [HttpPost("logout")]
public async Task<IActionResult> Logout()
{
    await _signInManager.SignOutAsync(); // This will clear the cookie
    return Ok(new { message = "Logout successful" });
}

}
