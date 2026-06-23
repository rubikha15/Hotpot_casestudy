namespace HotByte.DTOs
{
    public class MenuItemResponseDto
    {
        public int MenuItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }
        public decimal DiscountPrice { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public bool IsVeg { get; set; }
        public bool IsAvailable { get; set; }

        public string TasteInfo { get; set; } = string.Empty;
        public string NutritionalInfo { get; set; } = string.Empty;
        public string AvailabilityTime { get; set; } = string.Empty;

        public string CategoryName { get; set; } = string.Empty;
        public string RestaurantName { get; set; } = string.Empty;
    }
}