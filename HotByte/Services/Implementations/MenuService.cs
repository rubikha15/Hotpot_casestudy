using HotByte.Data;
using HotByte.DTOs;
using HotByte.Models;
using HotByte.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HotByte.Services.Implementations
{
    public class MenuService : IMenuService
    {
        private readonly AppDbContext _context;

        public MenuService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MenuItemResponseDto>> GetAllAsync(int pageNumber, int pageSize)
        {
            return await _context.MenuItems
                .Include(x => x.Category)
                .Include(x => x.Restaurant)
                .OrderBy(x => x.MenuItemId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new MenuItemResponseDto
                {
                    MenuItemId = x.MenuItemId,
                    ItemName = x.ItemName,
                    Description = x.Description,
                    RestaurantId = x.RestaurantId,
                    Price = x.Price,
                    DiscountPrice = x.DiscountPrice,
                    ImageUrl = x.ImageUrl,
                    IsVeg = x.IsVeg,
                    IsAvailable = x.IsAvailable,
                    TasteInfo = x.TasteInfo,
                    NutritionalInfo = x.NutritionalInfo,
                    AvailabilityTime = x.AvailabilityTime,
                    CategoryName = x.Category.CategoryName,
                    RestaurantName = x.Restaurant.RestaurantName
                })
                .ToListAsync();
        }

        public async Task<MenuItemResponseDto?> GetByIdAsync(int id)
        {
            var item = await _context.MenuItems
                .Include(x => x.Category)
                .Include(x => x.Restaurant)
                .FirstOrDefaultAsync(x => x.MenuItemId == id);

            if (item == null)
                return null;

            return new MenuItemResponseDto
            {
                MenuItemId = item.MenuItemId,
                ItemName = item.ItemName,
                Description = item.Description,
                RestaurantId = item.RestaurantId,
                Price = item.Price,
                DiscountPrice = item.DiscountPrice,
                ImageUrl = item.ImageUrl,
                IsVeg = item.IsVeg,
                IsAvailable = item.IsAvailable,
                TasteInfo = item.TasteInfo,
                NutritionalInfo = item.NutritionalInfo,
                AvailabilityTime = item.AvailabilityTime,
                CategoryName = item.Category.CategoryName,
                RestaurantName = item.Restaurant.RestaurantName
            };
        }

        public async Task AddAsync(CreateMenuItemDto dto)
        {
            var item = new MenuItem
            {
                ItemName = dto.ItemName,
                Description = dto.Description,
                RestaurantId = dto.RestaurantId,
                Price = dto.Price,
                DiscountPrice = dto.DiscountPrice,
                ImageUrl = dto.ImageUrl,
                TasteInfo = dto.TasteInfo,
                NutritionalInfo = dto.NutritionalInfo,
                AvailabilityTime = dto.AvailabilityTime,
                IsVeg = dto.IsVeg,
                IsAvailable = dto.IsAvailable,
                CategoryId = dto.CategoryId
            };

            _context.MenuItems.Add(item);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(int id, UpdateMenuItemDto dto)
        {
            var item = await _context.MenuItems.FindAsync(id);

            if (item == null)
                return;

            item.ItemName = dto.ItemName;
            item.Description = dto.Description;
            item.Price = dto.Price;
            item.DiscountPrice = dto.DiscountPrice;
            item.ImageUrl = dto.ImageUrl;
            item.TasteInfo = dto.TasteInfo;
            item.NutritionalInfo = dto.NutritionalInfo;
            item.AvailabilityTime = dto.AvailabilityTime;
            item.IsVeg = dto.IsVeg;
            item.IsAvailable = dto.IsAvailable;
            item.CategoryId = dto.CategoryId;

            // Important:
            // Do not allow restaurant to change RestaurantId after menu creation.
            // Ownership check is already done in controller.
            // So we are not updating item.RestaurantId here.

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _context.MenuItems.FindAsync(id);

            if (item == null)
                return;

            _context.MenuItems.Remove(item);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<MenuItemResponseDto>> SearchAsync(string keyword)
        {
            return await _context.MenuItems
                .Include(x => x.Category)
                .Include(x => x.Restaurant)
                .Where(x => x.ItemName.Contains(keyword))
                .Select(x => new MenuItemResponseDto
                {
                    MenuItemId = x.MenuItemId,
                    ItemName = x.ItemName,
                    Description = x.Description,
                    RestaurantId = x.RestaurantId,
                    Price = x.Price,
                    DiscountPrice = x.DiscountPrice,
                    ImageUrl = x.ImageUrl,
                    IsVeg = x.IsVeg,
                    IsAvailable = x.IsAvailable,
                    TasteInfo = x.TasteInfo,
                    NutritionalInfo = x.NutritionalInfo,
                    AvailabilityTime = x.AvailabilityTime,
                    CategoryName = x.Category.CategoryName,
                    RestaurantName = x.Restaurant.RestaurantName
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<MenuItemResponseDto>> FilterAsync(
            int? categoryId,
            bool? isVeg,
            decimal? minPrice,
            decimal? maxPrice)
        {
            var query = _context.MenuItems
                .Include(x => x.Category)
                .Include(x => x.Restaurant)
                .AsQueryable();

            if (categoryId.HasValue)
                query = query.Where(x => x.CategoryId == categoryId);

            if (isVeg.HasValue)
                query = query.Where(x => x.IsVeg == isVeg);

            if (minPrice.HasValue)
                query = query.Where(x => x.Price >= minPrice);

            if (maxPrice.HasValue)
                query = query.Where(x => x.Price <= maxPrice);

            return await query
                .Select(x => new MenuItemResponseDto
                {
                    MenuItemId = x.MenuItemId,
                    ItemName = x.ItemName,
                    Description = x.Description,
                    RestaurantId = x.RestaurantId,
                    Price = x.Price,
                    DiscountPrice = x.DiscountPrice,
                    ImageUrl = x.ImageUrl,
                    IsVeg = x.IsVeg,
                    IsAvailable = x.IsAvailable,
                    TasteInfo = x.TasteInfo,
                    NutritionalInfo = x.NutritionalInfo,
                    AvailabilityTime = x.AvailabilityTime,
                    CategoryName = x.Category != null ? x.Category.CategoryName : "",
                    RestaurantName = x.Restaurant != null ? x.Restaurant.RestaurantName : ""
                })
                .ToListAsync();
        }
    }
}