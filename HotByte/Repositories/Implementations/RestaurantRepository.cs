using HotByte.Data;
using HotByte.Models;
using HotByte.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HotByte.Repositories.Implementations
{
    public class RestaurantRepository : IRestaurantRepository
    {
        private readonly AppDbContext _context;

        public RestaurantRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Restaurant restaurant)
        {
            await _context.Restaurants.AddAsync(restaurant);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var restaurant =
                await _context.Restaurants.FindAsync(id);

            if (restaurant != null)
            {
                _context.Restaurants.Remove(restaurant);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Restaurant>> GetAllAsync()
        {
            return await _context.Restaurants
                .Include(x => x.MenuItems)
                .ToListAsync();
        }

        public async Task<Restaurant?> GetByIdAsync(int id)
        {
            return await _context.Restaurants
                .Include(x => x.MenuItems)
                .FirstOrDefaultAsync(x => x.RestaurantId == id);
        }

        public async Task UpdateAsync(Restaurant restaurant)
        {
            _context.Restaurants.Update(restaurant);
            await _context.SaveChangesAsync();
        }
        
    }
}