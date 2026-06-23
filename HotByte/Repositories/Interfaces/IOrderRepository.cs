using HotByte.Models;

namespace HotByte.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<List<Order>> GetAllAsync();

        Task<Order?> GetByIdAsync(int id);

        Task AddOrderAsync(Order order);
        Task UpdateAsync(Order order);
    }
}