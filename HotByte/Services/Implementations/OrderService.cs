using HotByte.DTOs;
using HotByte.Models;
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
            _logger.LogInformation("Fetching all orders");

            var orders = await _orderRepo.GetAllAsync();

            return orders.Select(o => new OrderResponseDto
            {
                OrderId = o.OrderId,
                UserId = o.UserId,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                ShippingAddress = o.ShippingAddress,
                PaymentMethod = o.PaymentMethod,

                Items = o.OrderItems.Select(i => new OrderItemDto
                {
                    OrderItemId = i.OrderItemId,
                    MenuItemId = i.MenuItemId,
                    ItemName = i.MenuItem != null
                        ? i.MenuItem.ItemName
                        : "",
                    Quantity = i.Quantity,
                    Price = i.Price,
                    Total = i.Price * i.Quantity
                }).ToList()
            });
        }

        public async Task<OrderResponseDto?> GetByIdAsync(int id)
        {
            _logger.LogInformation(
                "Fetching order with Id {OrderId}",
                id);

            var o = await _orderRepo.GetByIdAsync(id);

            if (o == null)
            {
                _logger.LogWarning(
                    "Order not found. Id: {OrderId}",
                    id);

                return null;
            }

            return new OrderResponseDto
            {
                OrderId = o.OrderId,
                UserId = o.UserId,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                ShippingAddress = o.ShippingAddress,
                PaymentMethod = o.PaymentMethod,

                Items = o.OrderItems.Select(i => new OrderItemDto
                {
                    OrderItemId = i.OrderItemId,
                    MenuItemId = i.MenuItemId,
                    ItemName = i.MenuItem != null
                        ? i.MenuItem.ItemName
                        : "",
                    Quantity = i.Quantity,
                    Price = i.Price,
                    Total = i.Price * i.Quantity
                }).ToList()
            };
        }

        public async Task PlaceOrderAsync(
            int userId,
            PlaceOrderDto dto)
        {
            _logger.LogInformation(
                "Order placement started for UserId {UserId}",
                userId);

            var cart =
                await _cartRepo.GetCartByUserIdAsync(userId);

            if (cart == null)
            {
                _logger.LogWarning(
                    "Order placement failed. Cart not found for UserId {UserId}",
                    userId);

                throw new Exception("Cart not found");
            }

            if (cart.CartItems == null || !cart.CartItems.Any())
            {
                _logger.LogWarning(
                    "Order placement failed. Cart empty for UserId {UserId}",
                    userId);

                throw new Exception("Cart is empty");
            }

            var totalAmount =
                cart.CartItems.Sum(x =>
                    x.Price * x.Quantity);

            var order = new Order
            {
                UserId = userId,
                ShippingAddress = dto.ShippingAddress,
                PaymentMethod = dto.PaymentMethod,
                OrderDate = DateTime.Now,
                Status = OrderStatus.Processing,
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
                "Order placed successfully. UserId: {UserId}, Amount: {Amount}",
                userId,
                totalAmount);
        }

        public async Task UpdateStatusAsync(
            int orderId,
            OrderStatus status)
        {
            _logger.LogInformation(
                "Updating status for OrderId {OrderId} to {Status}",
                orderId,
                status);

            var order =
                await _orderRepo.GetByIdAsync(orderId);

            if (order == null)
            {
                _logger.LogWarning(
                    "Order status update failed. Order not found. Id: {OrderId}",
                    orderId);

                throw new Exception("Order not found");
            }

            order.Status = status;

            await _orderRepo.UpdateAsync(order);

            _logger.LogInformation(
                "Order status updated successfully. OrderId: {OrderId}",
                orderId);
        }
    }
}