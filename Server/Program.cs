using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Server.Data;
using Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var postgresConnectionString = builder.Configuration.GetConnectionString("PostgreSQLConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(postgresConnectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// Add PostgreSQL DbContext Service
builder.Services.AddDbContext<ToolDbContext>(options =>
    options.UseNpgsql(postgresConnectionString));

// IdentityRole
builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();


// IHttpClientFactory

builder.Services.AddHttpClient();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder.WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Edit cookies settings
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60); // Set the cookie to expire in 60 minutes
    options.LoginPath = "/api/account/login/"; // Your login path
    options.LogoutPath = "/api/account/logout"; // Your logout path
    options.SlidingExpiration = true; // Resets the expiration time if more than half the time has passed
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.None;
    // More options can be set as needed
});

// JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
})
.AddOpenIdConnect("Feide", options => // Named instance "Feide" to not conflict with other handlers
{

    // Set the authority to the Feide authorization endpoint.
    options.Authority = "https://auth.dataporten.no";

    // Configure the client ID and secret registered with Feide.
    options.ClientId = "474122c6-3ee2-4d00-869e-f146c11a8060";
    options.ClientSecret = "9d5d8a4d-044f-46ac-bb17-315a82172175";
    options.ResponseType = "code"; // Authorization code flow

    // Set the callback path to the redirect URI registered with Feide.
    options.CallbackPath = new PathString("/api/account/handle-feide-login");
    options.SkipUnrecognizedRequests = true;
    options.SignInScheme = IdentityConstants.ExternalScheme; // Use the external cookie scheme for sign-in
    options.NonceCookie.SecurePolicy = CookieSecurePolicy.Always;
    options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.Always;
    

    // Define the scopes required.
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("userid-feide");
    options.Scope.Add("email");
    options.Scope.Add("userinfo-name");

    // Save tokens to be able to use them for subsequent API calls.
    options.SaveTokens = true;
    
});

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true; // Make the session cookie essential
});



var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();

using (var services = app.Services.CreateScope())
{
    try
    {
        var db = services.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var um = services.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var rm = services.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        ApplicationDbInitializer.Initialize(db, um, rm).Wait(); // Again, consider using async/await here
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while initializing the database");
    }
}


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Use CORS policy
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.Run();