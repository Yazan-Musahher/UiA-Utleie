namespace Server;
using System.ComponentModel.DataAnnotations.Schema;


public class Tool
{
    public int ToolId { get; set; }
    public string Name { get; set; }
    public bool IsAvailable { get; set; }
    public string Image { get; set; }  // Image URL or path

    [ForeignKey("Category")]
    public int CategoryId { get; set; }  // Foreign key

    public Category Category { get; set; }  // Navigation property
}


