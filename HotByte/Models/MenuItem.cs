using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotByte.Models
{
    public class MenuItem
    {
        [Key]
        public int MenuItemId { get; set; }

        [Required]
        public string ItemName { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public decimal DiscountPrice { get; set; }

        public string ImageUrl { get; set; }

        public bool IsVeg { get; set; }

        public bool IsAvailable { get; set; }

        public string TasteInfo { get; set; }

        public string NutritionalInfo { get; set; }

        public string AvailabilityTime { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }

        public Category? Category { get; set; }

        [ForeignKey("Restaurant")]
        public int RestaurantId { get; set; }

        public Restaurant? Restaurant { get; set; }
    }
}