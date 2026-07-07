using HotByte.Data;
using HotByte.Models;
using HotByte.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HotByte.Repositories.Implementations
{
    public class MenuRepository : IMenuRepository
    {
        private readonly AppDbContext _context;

        public MenuRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(MenuItem menuItem)
        {
            await _context.MenuItems.AddAsync(menuItem);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var menu =
                await _context.MenuItems.FindAsync(id);

            if (menu != null)
            {
                _context.MenuItems.Remove(menu);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<MenuItem>> GetAllAsync()
        {
            return await _context.MenuItems
                .Include(x => x.Category)
                .Include(x => x.Restaurant)
                .ToListAsync();
        }

        public async Task<MenuItem?> GetByIdAsync(int id)
        {
            return await _context.MenuItems
                .Include(x => x.Category)
                .Include(x => x.Restaurant)
                .FirstOrDefaultAsync(x => x.MenuItemId == id);
        }

        public async Task UpdateAsync(MenuItem menuItem)
        {
            _context.MenuItems.Update(menuItem);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<MenuItem>> SearchAsync(string keyword)
        {
            return await _context.MenuItems
                .Where(x =>
                    x.ItemName.Contains(keyword) ||
                    x.Description.Contains(keyword))
                .ToListAsync();
        }

        public async Task<IEnumerable<MenuItem>> FilterAsync(
            int? categoryId,
            bool? isVeg,
            decimal? minPrice,
            decimal? maxPrice)
        {
            IQueryable<MenuItem> query =
                _context.MenuItems;

            if (categoryId.HasValue)
                query = query.Where(x =>
                    x.CategoryId == categoryId);

            if (isVeg.HasValue)
                query = query.Where(x =>
                    x.IsVeg == isVeg);

            if (minPrice.HasValue)
                query = query.Where(x =>
                    x.Price >= minPrice);

            if (maxPrice.HasValue)
                query = query.Where(x =>
                    x.Price <= maxPrice);

            return await query.ToListAsync();
        }
    }
}