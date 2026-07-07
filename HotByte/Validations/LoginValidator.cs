using FluentValidation;
using HotByte.DTOs;

namespace HotByte.Validations
{
    public class LoginValidator
        : AbstractValidator<LoginDto>
    {
        public LoginValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress()
                .WithMessage("Enter a valid email");

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(6)
                .WithMessage("Password must contain at least 6 characters");
        }
    }
}