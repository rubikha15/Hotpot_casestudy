using System.ComponentModel.DataAnnotations;

namespace HotByte.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(100)]
        public string CategoryName { get; set; }

        public ICollection<MenuItem>? MenuItems { get; set; }
    }
}