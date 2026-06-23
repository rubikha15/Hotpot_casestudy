using HotByte.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CartItem
{
    [Key]
    public int CartItemId { get; set; }

    [ForeignKey("Cart")]
    public int CartId { get; set; }

    public Cart? Cart { get; set; }

    [ForeignKey("MenuItem")]
    public int MenuItemId { get; set; }

    public MenuItem? MenuItem { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    public decimal Price { get; set; }
}