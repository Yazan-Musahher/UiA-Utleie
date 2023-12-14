using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // GET: api/Admin/Users
        [HttpGet("Users")]
        [Authorize(Roles = "Admin")] // Ensure only admins can access this method
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = _userManager.Users.ToList();
            var userDtos = users.Select(user => new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                LastName = user.LastName,
                StudentNumber = user.StudentNumber
                // Add more fields as needed
            });

            return Ok(userDtos);
        }

         // PUT: api/Admin/Users/{}
        [HttpPut("Users/{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> UpdateUser(string id, UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                // Return a detailed error response if the model state is invalid
                return BadRequest(new { message = "Model state is not valid", errors = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage)) });
            }

            if (id != userDto.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = $"User with ID {id} not found." });
            }

            // Map the DTO to the user entity
            user.Email = userDto.Email;
            user.UserName = userDto.Email; // Assuming the email is the username
            user.Name = userDto.Name;
            user.LastName = userDto.LastName;
            user.StudentNumber = userDto.StudentNumber;
            // Update additional fields as needed

            try
            {
                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    return Ok(new { message = $"User with ID {id} updated successfully." });
                }

                // If there are errors during the update, return them in the response
                return BadRequest(new { message = "Update failed", errors = result.Errors.Select(e => e.Description) });
            }
            catch (DbUpdateConcurrencyException ex)
            {
                // Handle the concurrency issues here
                return BadRequest(new { message = "Concurrency error occurred.", errors = ex.Message });
            }
            catch (DbUpdateException ex)
            {
                // Handle the database update issues here
                return BadRequest(new { message = "Database error occurred.", errors = ex.Message });
            }
            catch (System.Exception ex)
            {
                // For other types of exceptions, you might not want to expose the details to the client for security reasons
                // Log the exception details for the server logs and return a generic error message
                return StatusCode(500, new { message = "An error occurred.", errors = "Internal server error" });
            }
        }

        // DELETE: api/Admin/Users/5
        [HttpDelete("Users/{id}")]
        [Authorize(Roles = "Admin")] // Ensure only admins can access this method
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return NoContent();
            }
            return BadRequest(result.Errors);
        }
    }

    // DTO class should be outside the AdminController class
    public class UserDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string StudentNumber { get; set; }

        // Add more fields as needed
    }
}
