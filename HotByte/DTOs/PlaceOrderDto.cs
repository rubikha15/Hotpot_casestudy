using System.ComponentModel.DataAnnotations;

namespace HotByte.DTOs
{
    public class PlaceOrderDto
    {
        [Required]
        public string ShippingAddress { get; set; }

        [Required]
        public string PaymentMethod { get; set; }
    }
}