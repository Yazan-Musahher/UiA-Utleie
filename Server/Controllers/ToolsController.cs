using Microsoft.AspNetCore.Mvc;
using Server.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToolsController : ControllerBase
    {
        private readonly ToolDbContext _context;

        public ToolsController(ToolDbContext context)
        {
            _context = context;
        }

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
    }
}
