namespace HotByte.Models
{
    public class Order
    {
        public int OrderId { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int RestaurantId { get; set; }
        public Restaurant? Restaurant { get; set; }

        public DateTime OrderDate { get; set; }

        public decimal TotalAmount { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Processing;

        public string ShippingAddress { get; set; } = string.Empty;

        public string PaymentMethod { get; set; } = string.Empty;

        public Payment? Payment { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}