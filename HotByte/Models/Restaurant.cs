using System.ComponentModel.DataAnnotations;

namespace HotByte.Models
{
    public class Restaurant
    {
        [Key]
        public int RestaurantId { get; set; }

        [Required]
        public string RestaurantName { get; set; }

        [Required]
        public string Location { get; set; }

        [Required]
        public string ContactNumber { get; set; }

        public string Email { get; set; }

        public ICollection<MenuItem>? MenuItems { get; set; }
    }
}