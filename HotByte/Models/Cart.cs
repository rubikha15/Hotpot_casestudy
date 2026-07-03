using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotByte.Models
{
    public class Cart
    {
        [Key]
        public int CartId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        public User? User { get; set; }

        public ICollection<CartItem>? CartItems { get; set; }

        [NotMapped]
        public decimal TotalAmount =>
            CartItems?.Sum(x => x.Price * x.Quantity) ?? 0;
    }
}