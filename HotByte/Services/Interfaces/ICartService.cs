using HotByte.DTOs;

namespace HotByte.Services.Interfaces
{
    public interface ICartService
    {
        Task<CartResponseDto?> GetCartAsync(int userId);

        Task AddItemAsync(int userId, AddCartItemDto dto);

        Task UpdateQtyAsync(int cartItemId, UpdateCartQtyDto dto);

        Task DeleteItemAsync(int cartItemId);

        Task ClearCartAsync(int userId);
    }
}