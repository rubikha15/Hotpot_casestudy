using HotByte.Models.Enums;

namespace HotByte.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        public PaymentMethod PaymentMethod { get; set; }

        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

        public string? TransactionId { get; set; }

        public DateTime? PaidAt { get; set; }
    }
}