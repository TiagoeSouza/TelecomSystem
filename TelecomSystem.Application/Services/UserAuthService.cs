using TelecomSystem.Application.Interfaces;
using TelecomSystem.Domain.Entities;
using TelecomSystem.Domain.Repositories;

namespace TelecomSystem.Application.Services
{

    public class UserAuthService : IUserAuthService
    {
        private readonly IUserAuthRepository _repo;

        public UserAuthService(IUserAuthRepository repo)
        {
            _repo = repo;
        }

        public async Task<bool> Authorized(UserAuth userAuth) => await _repo.Authorized(userAuth);

        public async Task<UserAuth> CreateUserAuth(UserAuth userAuth) => await _repo.CreateUserAuth(userAuth);

    }
}