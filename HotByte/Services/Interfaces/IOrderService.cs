using HotByte.DTOs;
using HotByte.Models;

namespace HotByte.Services.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderResponseDto>> GetAllAsync();
        Task<OrderResponseDto?> GetByIdAsync(int id);

        Task PlaceOrderAsync(int userId, PlaceOrderDto dto);

        Task UpdateStatusAsync(int orderId, OrderStatus status);
    }
}