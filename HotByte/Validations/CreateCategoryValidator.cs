using FluentValidation;
using HotByte.DTOs;

namespace HotByte.Validations
{
    public class CreateCategoryValidator
        : AbstractValidator<CreateCategoryDto>
    {
        public CreateCategoryValidator()
        {
            RuleFor(x => x.CategoryName)
                .NotEmpty()
                .Length(3, 50)
                .WithMessage("Category name must be between 3 and 50 characters");
        }
    }
}