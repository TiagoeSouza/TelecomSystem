using TelecomSystem.Domain.Entities;

namespace TelecomSystem.Application.Interfaces
{
    public interface IUserAuthService
    {
        Task<bool> Authorized(UserAuth userAuth);

        Task<UserAuth> CreateUserAuth(UserAuth userAuth);
    }
}