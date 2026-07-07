using HotByte.DTOs;
using HotByte.Models;
using HotByte.Models.Enums;

namespace HotByte.Services.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderResponseDto>> GetAllAsync();
        Task<OrderResponseDto?> GetByIdAsync(int id);
        Task PlaceOrderAsync(int userId, PlaceOrderDto dto);
        Task UpdateStatusAsync(int orderId, OrderStatus status);
        Task<IEnumerable<OrderResponseDto>> GetOrdersByUserIdAsync(int userId);
        Task<IEnumerable<OrderResponseDto>> GetOrdersByRestaurantIdAsync(int restaurantId);
    }
}