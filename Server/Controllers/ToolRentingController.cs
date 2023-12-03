using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Server.Models;
using Server.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System;

namespace Server.Controllers;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ToolRentingController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public ToolRentingController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    [HttpPost("rent")]
    public async Task<IActionResult> RentTool([FromBody] RentToolModel model)
    {
        try
        {
            // Get the currently logged-in user
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "You must be logged in to rent tools." });
            }

            // Check if the tool is available for rent
            var tool = await _context.Tools.FindAsync(model.ToolId);
            if (tool == null)
            {
                return NotFound(new { message = "Tool not found." });
            }

            if (!tool.IsAvailable)
            {
                return BadRequest(new { message = "Tool is not available for rent." });
            }

            // If the tool is available, you can proceed to rent it
            tool.IsAvailable = false; // Set the tool as not available

// Create the ToolRenting entry
var toolRenting = new ToolRenting
{
    ApplicationUserId = user.Id, // Set only the user's ID
    ToolId = model.ToolId,
    RentingDate = model.RentingDate
};

_context.ToolRentings.Add(toolRenting);

// Update the tool as not available without re-attaching the user entity
_context.Entry(tool).Property(t => t.IsAvailable).IsModified = true;

await _context.SaveChangesAsync(); // Save changes to the database


            return Ok(new { message = "Tool rented successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while renting the tool.", error = ex.Message });
        }
    }
}

public class RentToolModel
{
    public int ToolId { get; set; }
    public DateTime RentingDate { get; set; }
}