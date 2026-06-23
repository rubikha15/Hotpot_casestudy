using HotByte.Data;
using HotByte.DTOs;
using HotByte.Models;
using HotByte.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HotByte.Services.Implementations
{
    public class RestaurantService : IRestaurantService
    {
        private readonly AppDbContext _context;

        public RestaurantService(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL RESTAURANTS
        // =========================
        public async Task<IEnumerable<Restaurant>> GetAllAsync()
        {
            return await _context.Restaurants
                .AsNoTracking()
                .ToListAsync();
        }

        // =========================
        // GET RESTAURANT BY ID
        // =========================
        public async Task<Restaurant?> GetByIdAsync(int id)
        {
            return await _context.Restaurants
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.RestaurantId == id);
        }

        // =========================
        // GET MENU BY RESTAURANT ID (IMPORTANT FIX)
        // =========================
        public async Task<IEnumerable<MenuItemResponseDto>> GetMenuByRestaurantIdAsync(int restaurantId)
        {
            return await _context.MenuItems
                .Where(m => m.RestaurantId == restaurantId)
                .Select(m => new MenuItemResponseDto
                {
                    MenuItemId = m.MenuItemId,
                    ItemName = m.ItemName,
                    Description = m.Description,
                    Price = m.Price,
                    DiscountPrice = m.DiscountPrice,
                    ImageUrl = m.ImageUrl,
                    IsVeg = m.IsVeg,
                    IsAvailable = m.IsAvailable,
                    TasteInfo = m.TasteInfo,
                    NutritionalInfo = m.NutritionalInfo,
                    AvailabilityTime = m.AvailabilityTime,
                    CategoryName = m.Category != null ? m.Category.CategoryName : "",
                    RestaurantName = m.Restaurant != null ? m.Restaurant.RestaurantName : ""
                })
                .ToListAsync();
        }
       
    }
}