using System.ComponentModel.DataAnnotations;

namespace HotByte.DTOs
{
    public class UpdateMenuItemDto
    {
        [Required]
        public string ItemName { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public decimal DiscountPrice { get; set; }

        public string ImageUrl { get; set; }

        public bool IsVeg { get; set; }

        public bool IsAvailable { get; set; }

        public string TasteInfo { get; set; }

        public string NutritionalInfo { get; set; }

        public string AvailabilityTime { get; set; }

        public int CategoryId { get; set; }

        public int RestaurantId { get; set; }
    }
}