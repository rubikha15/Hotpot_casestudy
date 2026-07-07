using System.ComponentModel.DataAnnotations;

namespace HotByte.DTOs
{
    public class AddCartItemDto
    {
        [Required]
        public int MenuItemId { get; set; }

        [Required]
        [Range(1, 100)]
        public int Quantity { get; set; }
    }
}