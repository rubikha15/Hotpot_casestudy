namespace HotByte.DTOs
{
    public class CreateMenuItemDto
    {
        public string ItemName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int RestaurantId { get; set; }
        public decimal Price { get; set; }
        public decimal DiscountPrice { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string TasteInfo { get; set; } = string.Empty;
        public string NutritionalInfo { get; set; } = string.Empty;
        public string AvailabilityTime { get; set; } = string.Empty;
        public bool IsVeg { get; set; }

        // Add this
        public bool IsAvailable { get; set; }

        public int CategoryId { get; set; }
    }
}