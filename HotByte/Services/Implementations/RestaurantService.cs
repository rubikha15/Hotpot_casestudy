using HotByte.Data;
using HotByte.DTOs;
using HotByte.Models;
using HotByte.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace HotByte.Services.Implementations
{
    public class RestaurantService : IRestaurantService
    {
        private readonly AppDbContext _context;

        public RestaurantService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RestaurantResponseDto>> GetAllAsync()
        {
            return await _context.Restaurants
                .Select(r => new RestaurantResponseDto
                {
                    RestaurantId = r.RestaurantId,
                    RestaurantName = r.RestaurantName,
                    Location = r.Location,
                    ContactNumber = r.ContactNumber
                })
                .ToListAsync();
        }

        public async Task<RestaurantResponseDto?> GetByIdAsync(int id)
        {
            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.RestaurantId == id);

            if (restaurant == null)
                return null;

            return new RestaurantResponseDto
            {
                RestaurantId = restaurant.RestaurantId,
                RestaurantName = restaurant.RestaurantName,
                Location = restaurant.Location,
                ContactNumber = restaurant.ContactNumber
            };
        }

        public async Task<IEnumerable<MenuItemResponseDto>> GetMenuByRestaurantIdAsync(int restaurantId)
        {
            return await _context.MenuItems
                .Where(m => m.RestaurantId == restaurantId)
                .Select(m => new MenuItemResponseDto
                {
                    MenuItemId = m.MenuItemId,
                    ItemName = m.ItemName,
                    Description = m.Description,
                    RestaurantId = m.RestaurantId,
                    Price = m.Price,
                    DiscountPrice = m.DiscountPrice,
                    ImageUrl = m.ImageUrl,
                    TasteInfo = m.TasteInfo,
                    NutritionalInfo = m.NutritionalInfo,
                    AvailabilityTime = m.AvailabilityTime,
                    IsVeg = m.IsVeg,
                    IsAvailable = m.IsAvailable,
                    CategoryName = m.Category != null ? m.Category.CategoryName : "",
                    RestaurantName = m.Restaurant != null ? m.Restaurant.RestaurantName : ""
                })
                .ToListAsync();
        }

        public async Task AddAsync(CreateRestaurantDto dto)
        {
            var existingRestaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.Email == dto.Email);

            if (existingRestaurant != null)
                throw new Exception("Restaurant already exists");

            var restaurant = new Restaurant
            {
                RestaurantName = dto.RestaurantName,
                Location = dto.Location,
                ContactNumber = dto.ContactNumber,
                Email = dto.Email,
                Password = HashPassword(dto.Password)
            };

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.RestaurantId == id);

            if (restaurant == null)
                throw new Exception("Restaurant not found");

            _context.Restaurants.Remove(restaurant);
            await _context.SaveChangesAsync();
        }

        private string HashPassword(string password)
        {
            return Convert.ToBase64String(
                SHA256.HashData(
                    Encoding.UTF8.GetBytes(password)));
        }
    }
}