using HotByte.Models;

namespace HotByte.Repositories.Interfaces
{
    public interface ICartRepository
    {
        Task<Cart?> GetCartByUserIdAsync(int userId);

        Task<CartItem?> GetCartItemAsync(int cartItemId);

        Task AddCartItemAsync(CartItem item);

        Task UpdateCartItemAsync(CartItem item);

        Task DeleteCartItemAsync(int cartItemId);

        Task ClearCartAsync(int userId);

        Task CreateCartAsync(Cart cart);
    }
}