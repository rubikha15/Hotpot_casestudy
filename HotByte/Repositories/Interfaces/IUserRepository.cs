using HotByte.Models;

namespace HotByte.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);

        Task<User?> GetByIdAsync(int id);

        Task<IEnumerable<User>> GetAllAsync();

        Task AddAsync(User user);

        Task DeleteAsync(int id);

        Task SaveChangesAsync();
    }
}