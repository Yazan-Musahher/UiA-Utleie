namespace Server;

public class Category
{
    public int CategoryId { get; set; }
    public string Name { get; set; }
    public ICollection<Tool> Tools { get; set; } = new List<Tool>();
}
