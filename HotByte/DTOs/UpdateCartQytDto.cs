using System.ComponentModel.DataAnnotations;

namespace HotByte.DTOs
{
    public class UpdateCartQtyDto
    {
        [Required]
        [Range(1, 100)]
        public int Quantity { get; set; }
    }
}