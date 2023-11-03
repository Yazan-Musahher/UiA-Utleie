using Server.Models;
using Microsoft.AspNetCore.Identity;

namespace Server;

public class ToolRenting
{
    public int ToolRentingId { get; set; }
    public string ApplicationUserId { get; set; } // Foreign key property
    public virtual ApplicationUser ApplicationUser { get; set; } // Navigation property
    public int ToolId { get; set; }
    public virtual Tool Tool { get; set; }
    public DateTime RentingDate { get; set; }
}
