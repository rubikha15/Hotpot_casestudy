using FluentValidation;
using HotByte.DTOs;

namespace HotByte.Validations
{
    public class AddCartValidator
        : AbstractValidator<AddCartItemDto>
    {
        public AddCartValidator()
        {
            RuleFor(x => x.MenuItemId)
                .GreaterThan(0)
                .WithMessage("Invalid menu item");

            RuleFor(x => x.Quantity)
                .InclusiveBetween(1, 20)
                .WithMessage("Quantity must be between 1 and 20");
        }
    }
}