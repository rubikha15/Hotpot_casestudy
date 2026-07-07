namespace HotByte.DTOs
{
    public class PlaceOrderDto
    {
        public string ShippingAddress { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
    }
}