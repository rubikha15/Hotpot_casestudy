using HotByte.DTOs;
using HotByte.Models;
using HotByte.Repositories.Interfaces;
using HotByte.Services.Implementations;
using Moq;
using NUnit.Framework;
using System.Threading.Tasks;
using System.Timers;

namespace HotByte.Tests.Services
{
    [TestFixture]
    public class CategoryServiceTests
    {
        [Test]
        public async Task AddCategory_Should_Call_Repository()
        {
            var repo = new Mock<ICategoryRepository>();
            var service = new CategoryService(repo.Object);

            var dto = new CreateCategoryDto
            {
                CategoryName = "Pizza"
            };

            await service.AddAsync(dto);

            repo.Verify(x => x.AddAsync(It.IsAny<Category>()), Times.Once);
        }
    }
}