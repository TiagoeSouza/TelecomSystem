using TelecomSystem.Domain.Entities;

namespace TelecomSystem.Domain.Repositories
{
    public interface IUserAuthRepository
    {
        Task<bool> Authorized(UserAuth userAuth);
        Task<UserAuth> CreateUserAuth(UserAuth userAuth);
    }
}