using FluentValidation;
using HotByte.DTOs;

namespace HotByte.Validations
{
    public class RegisterUserValidator
        : AbstractValidator<RegisterUserDto>
    {
        public RegisterUserValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .Length(3, 50).WithMessage("Name must be between 3 and 50 characters")
                .Matches(@"^[A-Za-z\s]+$")
                .WithMessage("Name should contain only letters and spaces");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .MaximumLength(20).WithMessage("Password cannot exceed 20 characters")
                .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter")
                .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter")
                .Matches(@"[0-9]").WithMessage("Password must contain at least one number")
                .Matches(@"[\W_]").WithMessage("Password must contain at least one special character");

            RuleFor(x => x.ContactNumber)
                .NotEmpty().WithMessage("Contact number is required")
                .Matches(@"^[6-9]\d{9}$")
                .WithMessage("Enter a valid 10-digit Indian mobile number");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Address is required")
                .Length(5, 200);

            RuleFor(x => x.Gender)
                .NotEmpty().WithMessage("Gender is required")
                .Must(x => x == "Male" || x == "Female" || x == "Other")
                .WithMessage("Gender must be Male, Female or Other");
        }
    }
}