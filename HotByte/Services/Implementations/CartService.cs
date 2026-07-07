using HotByte.DTOs;
using HotByte.Models;
using HotByte.Repositories.Interfaces;
using HotByte.Services.Interfaces;

namespace HotByte.Services.Implementations
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepo;
        private readonly IMenuRepository _menuRepo;

        public CartService(ICartRepository cartRepo, IMenuRepository menuRepo)
        {
            _cartRepo = cartRepo;
            _menuRepo = menuRepo;
        }

        // =========================
        // GET CART (DTO RESPONSE)
        // =========================
        public async Task<CartResponseDto?> GetCartAsync(int userId)
        {
            var cart = await _cartRepo.GetCartByUserIdAsync(userId);

            if (cart == null)
                return null;

            var items = cart.CartItems?.Select(x => new CartItemResponseDto
            {
                CartItemId = x.CartItemId,
                MenuItemId = x.MenuItemId,
                ItemName = x.MenuItem?.ItemName ?? "",
                Quantity = x.Quantity,
                Price = x.Price,
                Total = x.Quantity * x.Price
            }).ToList() ?? new List<CartItemResponseDto>();

            return new CartResponseDto
            {
                CartId = cart.CartId,
                UserId = cart.UserId,
                Items = items,
                GrandTotal = items.Sum(x => x.Total)
            };
        }

        // =========================
        // ADD ITEM
        // =========================
        public async Task AddItemAsync(int userId, AddCartItemDto dto)
        {
            var cart = await _cartRepo.GetCartByUserIdAsync(userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId
                };

                await _cartRepo.CreateCartAsync(cart);
                cart = await _cartRepo.GetCartByUserIdAsync(userId);
            }

            var menu = await _menuRepo.GetByIdAsync(dto.MenuItemId);

            if (menu == null)
                throw new Exception("Menu item not found");

            var item = new CartItem
            {
                CartId = cart.CartId,
                MenuItemId = menu.MenuItemId,
                Quantity = dto.Quantity,
                Price = menu.DiscountPrice > 0 ? menu.DiscountPrice : menu.Price
            };

            await _cartRepo.AddCartItemAsync(item);
        }

        // =========================
        // UPDATE QUANTITY
        // =========================
        public async Task UpdateQtyAsync(int cartItemId, UpdateCartQtyDto dto)
        {
            var item = await _cartRepo.GetCartItemAsync(cartItemId);

            if (item == null)
                throw new Exception("Cart item not found");

            item.Quantity = dto.Quantity;

            await _cartRepo.UpdateCartItemAsync(item);
        }

        // =========================
        // DELETE ITEM
        // =========================
        public async Task DeleteItemAsync(int cartItemId)
        {
            var item = await _cartRepo.GetCartItemAsync(cartItemId);

            if (item == null)
                throw new Exception("Cart item not found");

            await _cartRepo.DeleteCartItemAsync(cartItemId);
        }

        // =========================
        // CLEAR CART
        // =========================
        public async Task ClearCartAsync(int userId)
        {
            await _cartRepo.ClearCartAsync(userId);
        }
    }
}