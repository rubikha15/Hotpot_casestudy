using HotByte.DTOs;
using HotByte.Models;
using HotByte.Models.Enums;
using HotByte.Repositories.Interfaces;
using HotByte.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace HotByte.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly ICartRepository _cartRepo;
        private readonly ILogger<OrderService> _logger;

        public OrderService(
            IOrderRepository orderRepo,
            ICartRepository cartRepo,
            ILogger<OrderService> logger)
        {
            _orderRepo = orderRepo;
            _cartRepo = cartRepo;
            _logger = logger;
        }

        public async Task<IEnumerable<OrderResponseDto>> GetAllAsync()
        {
            var orders = await _orderRepo.GetAllAsync();

            return orders.Select(MapToDto);
        }

        public async Task<OrderResponseDto?> GetByIdAsync(int id)
        {
            var order = await _orderRepo.GetByIdAsync(id);

            if (order == null)
                return null;

            return MapToDto(order);
        }

        public async Task<IEnumerable<OrderResponseDto>> GetOrdersByUserIdAsync(int userId)
        {
            var orders = await _orderRepo.GetAllAsync();

            return orders
                .Where(o => o.UserId == userId)
                .Select(MapToDto);
        }

        public async Task<IEnumerable<OrderResponseDto>> GetOrdersByRestaurantIdAsync(int restaurantId)
        {
            var orders = await _orderRepo.GetAllAsync();

            return orders
                .Where(o => o.RestaurantId == restaurantId)
                .Select(MapToDto);
        }

        public async Task PlaceOrderAsync(int userId, PlaceOrderDto dto)
        {
            var cart = await _cartRepo.GetCartByUserIdAsync(userId);

            if (cart == null)
                throw new Exception("Cart not found");

            if (cart.CartItems == null || !cart.CartItems.Any())
                throw new Exception("Cart is empty");

            var totalAmount = cart.CartItems.Sum(x => x.Price * x.Quantity);

            var restaurantId = cart.CartItems
                .First()
                .MenuItem
                .RestaurantId;

            var order = new Order
            {
                UserId = userId,
                RestaurantId = restaurantId,
                ShippingAddress = dto.ShippingAddress,
                PaymentMethod = dto.PaymentMethod,
                OrderDate = DateTime.Now,
                Status = OrderStatus.Placed,
                TotalAmount = totalAmount,

                OrderItems = cart.CartItems
                    .Select(x => new OrderItem
                    {
                        MenuItemId = x.MenuItemId,
                        Quantity = x.Quantity,
                        Price = x.Price
                    })
                    .ToList()
            };

            await _orderRepo.AddOrderAsync(order);
            await _cartRepo.ClearCartAsync(userId);

            _logger.LogInformation(
                "Order placed successfully. UserId: {UserId}, RestaurantId: {RestaurantId}, Amount: {Amount}",
                userId,
                restaurantId,
                totalAmount);
        }

        public async Task UpdateStatusAsync(int orderId, OrderStatus status)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);

            if (order == null)
                throw new Exception("Order not found");

            order.Status = status;

            await _orderRepo.UpdateAsync(order);
        }

        private OrderResponseDto MapToDto(Order o)
        {
            return new OrderResponseDto
            {
                OrderId = o.OrderId,
                UserId = o.UserId,
                RestaurantId = o.RestaurantId,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                ShippingAddress = o.ShippingAddress,
                PaymentMethod = o.PaymentMethod,

                Items = o.OrderItems != null
                    ? o.OrderItems.Select(i => new OrderItemDto
                    {
                        OrderItemId = i.OrderItemId,
                        MenuItemId = i.MenuItemId,
                        ItemName = i.MenuItem != null ? i.MenuItem.ItemName : "",
                        Quantity = i.Quantity,
                        Price = i.Price,
                        Total = i.Price * i.Quantity
                    }).ToList()
                    : new List<OrderItemDto>()
            };
        }
        
    }
}