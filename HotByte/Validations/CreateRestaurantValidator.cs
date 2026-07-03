using FluentValidation;
using HotByte.DTOs;

namespace HotByte.Validations
{
    public class CreateRestaurantValidator
        : AbstractValidator<CreateRestaurantDto>
    {
        public CreateRestaurantValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .Length(3, 100)
                .WithMessage("Restaurant name must be between 3 and 100 characters");

            RuleFor(x => x.Address)
                .NotEmpty()
                .Length(10, 200)
                .WithMessage("Address should be between 10 and 200 characters");

            RuleFor(x => x.ContactNumber)
                .NotEmpty()
                .Matches(@"^[6-9]\d{9}$")
                .WithMessage("Enter a valid 10-digit Indian mobile number");
        }
    }
}