using FluentValidation;
using HotByte.DTOs;

namespace HotByte.Validations
{
    public class CreateMenuValidator
        : AbstractValidator<CreateMenuItemDto>
    {
        public CreateMenuValidator()
        {
            RuleFor(x => x.ItemName)
                .NotEmpty()
                .Length(3, 100)
                .WithMessage("Item name must be between 3 and 100 characters");

            RuleFor(x => x.Description)
                .NotEmpty()
                .Length(10, 500)
                .WithMessage("Description should be between 10 and 500 characters");

            RuleFor(x => x.Price)
                .GreaterThan(0)
                .LessThanOrEqualTo(5000)
                .WithMessage("Price must be between ₹1 and ₹5000");

            RuleFor(x => x.DiscountPrice)
                .GreaterThanOrEqualTo(0)
                .LessThanOrEqualTo(x => x.Price)
                .WithMessage("Discount price cannot exceed actual price");

            RuleFor(x => x.CategoryId)
                .GreaterThan(0);

            RuleFor(x => x.RestaurantId)
                .GreaterThan(0);
        }
    }
}