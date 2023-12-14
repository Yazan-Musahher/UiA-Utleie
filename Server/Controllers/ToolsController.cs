using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Server;


namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToolsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ToolsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Tools
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tool>>> GetTools([FromQuery] int? categoryId)
        {
            if (categoryId.HasValue)
            {
                return await _context.Tools
                    .Where(t => t.CategoryId == categoryId.Value)
                    .ToListAsync();
            }
            else
            {
                return await _context.Tools.ToListAsync();
            }
        }

        // PUT: api/Tools/5
[HttpPut("{toolId}")]
[Authorize] // Add your authorization logic here
public async Task<IActionResult> UpdateTool(int toolId, Tool updatedTool)
{
    if (toolId != updatedTool.ToolId)
    {
        return BadRequest("Tool ID mismatch");
    }

    var tool = await _context.Tools.FindAsync(toolId);
    if (tool == null)
    {
        return NotFound();
    }

    // Update fields
    tool.Name = updatedTool.Name;
    tool.IsAvailable = updatedTool.IsAvailable;
    tool.Image = updatedTool.Image;
    tool.CategoryId = updatedTool.CategoryId;

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!ToolExists(toolId))
        {
            return NotFound();
        }
        else
        {
            throw;
        }
    }

    return NoContent();
}

        // DELETE: api/Tools/5
        [HttpDelete("{toolId}")]
        [Authorize] // Add your authorization logic here
        public async Task<IActionResult> DeleteTool(int toolId)
        {
            var tool = await _context.Tools.FindAsync(toolId);
            if (tool == null)
            {
                return NotFound();
            }

            _context.Tools.Remove(tool);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ToolExists(int id)
        {
            return _context.Tools.Any(e => e.ToolId == id);
        }
    }
}

public class Tool
{
    public int ToolId { get; set; }
    public string Name { get; set; }
    public bool IsAvailable { get; set; }
    public string Image { get; set; } // Image URL or path
    public int CategoryId { get; set; } // Foreign key
    public Category Category { get; set; } // Navigation property
}
