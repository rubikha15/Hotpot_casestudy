using HotByte.Models;

namespace HotByte.Repositories.Interfaces
{
    public interface IRestaurantRepository
    {
        Task<IEnumerable<Restaurant>> GetAllAsync();

        Task<Restaurant?> GetByIdAsync(int id);

        Task AddAsync(Restaurant restaurant);
        

        Task UpdateAsync(Restaurant restaurant);

        Task DeleteAsync(int id);
    }
}