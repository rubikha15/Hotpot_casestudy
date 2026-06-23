using HotByte.Models;

namespace HotByte.Models
{
    public class Order
    {
        public int OrderId { get; set; }

        public int UserId { get; set; }

        public DateTime OrderDate { get; set; }

        public decimal TotalAmount { get; set; }

        public OrderStatus Status { get; set; }   // ✅ HERE

        public string ShippingAddress { get; set; }

        public string PaymentMethod { get; set; }

        public User User { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; }
    }
}