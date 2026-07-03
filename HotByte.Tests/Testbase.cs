using Microsoft.EntityFrameworkCore;
using HotByte.Data;

public class TestBase
{
    protected AppDbContext GetContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }
}