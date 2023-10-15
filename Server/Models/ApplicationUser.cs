namespace Server.Models;
using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string Name { get; set; }
    public string LastName { get; set; }
    public string StudentNumber { get; set; }
}

// Models/SignupInputModel.cs
public class SignupInputModel
{
    public string Email { get; set; }
    public string Name { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public string StudentNumber { get; set; } 
    public string Password { get; set; }
    
    
    // Additional signup properties can go here
}

// Models/LoginInputModel.cs
public class LoginInputModel
{
    public string Email { get; set; }
    public string Password { get; set; }
}