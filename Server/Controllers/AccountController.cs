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

    [HttpGet("login/feide")]
public IActionResult LoginWithFeide()
{
    // Additional scopes are being set in the properties to be included in the challenge request
    var properties = new AuthenticationProperties
    {
        RedirectUri = Url.Action("HandleFeideLogin"),
        Items = { { "scope", "openid profile email userid-feide userinfo-name" } } // Requesting the userinfo-name scope
    };
    return Challenge(properties, "Feide");
}

[HttpGet("handle-feide-login")]
public async Task<IActionResult> HandleFeideLogin()
{
    // This method is called after the user has been authenticated with Feide
    if (User.Identity.IsAuthenticated)
    {
        var claims = User.Claims.ToList();
        var userIdClaim = claims.FirstOrDefault(c => c.Type == "userid-feide")?.Value;
        var emailClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var nameClaim = claims.FirstOrDefault(c => c.Type == "userinfo-name")?.Value;

        ApplicationUser user = await _userManager.FindByEmailAsync(emailClaim);
        if (user == null)
        {
            user = new ApplicationUser
            {
                Id = userIdClaim,
                UserName = emailClaim, // Assuming you want the user's email to be their username
                Email = emailClaim,
                Name = nameClaim,
                EmailConfirmed = true
            };

            var createUserResult = await _userManager.CreateAsync(user);
            if (!createUserResult.Succeeded)
            {
                // Log each error
                foreach (var error in createUserResult.Errors)
                {
                    _logger.LogError("User creation failed: {Error}", error.Description);
                }

                return BadRequest(new { message = "Failed to create local user account" });
            }
        }

        var tokenString = GenerateJwtToken(user);
        Response.Cookies.Append("authToken", tokenString, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None });
        var frontendRedirectUrl = "http://localhost:3000/Gallery/";
        return Redirect(frontendRedirectUrl + $"Authenticated?authToken={Uri.EscapeDataString(tokenString)}");
    }

    return BadRequest(new { message = "Feide login failed" });
}

private string GenerateJwtToken(ApplicationUser user)
{
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email)
            // Add other claims as needed
        }),
        Expires = DateTime.UtcNow.AddMinutes(30),
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
