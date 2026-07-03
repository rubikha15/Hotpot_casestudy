namespace HotByte.DTOs
{
    public class CartResponseDto
    {
        public int CartId { get; set; }
        public int UserId { get; set; }

        public List<CartItemResponseDto> Items { get; set; } = new();

        public decimal GrandTotal { get; set; }
    }

    public class CartItemResponseDto
    {
        public int CartItemId { get; set; }
        public int MenuItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;

        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Total { get; set; }
    }
}