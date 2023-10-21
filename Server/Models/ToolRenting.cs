using Server.Models;
using Microsoft.AspNetCore.Identity;

namespace Server;

public class ToolRenting
{

    public int ToolRentingId { get; set; }
    public string ApplicationUserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; }
    public int ToolId { get; set; }
    public Tool Tool { get; set; }
    public DateTime RentingDate { get; set; }


}
