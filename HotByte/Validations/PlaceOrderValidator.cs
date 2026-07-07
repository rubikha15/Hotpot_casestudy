using FluentValidation;
using HotByte.DTOs;

namespace HotByte.Validations
{
    public class PlaceOrderValidator
        : AbstractValidator<PlaceOrderDto>
    {
        public PlaceOrderValidator()
        {
            RuleFor(x => x.ShippingAddress)
                .NotEmpty()
                .Length(10, 200)
                .WithMessage("Shipping address should be between 10 and 200 characters");

            RuleFor(x => x.PaymentMethod)
                .NotEmpty()
                .Must(x =>
                    x == "UPI" ||
                    x == "Card" ||
                    x == "Cash On Delivery")
                .WithMessage("Payment method must be UPI, Card, or Cash On Delivery");
        }
    }
}