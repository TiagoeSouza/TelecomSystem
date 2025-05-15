using Microsoft.EntityFrameworkCore;
using TelecomSystem.Domain.Entities;
using TelecomSystem.Domain.Repositories;
using TelecomSystem.Infrastructure;

public class UserAuthRepository : IUserAuthRepository
{
    private readonly TelecomDbContext _context;

    public UserAuthRepository(TelecomDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Authorized(UserAuth userAuth)
    {
        var user = await _context.UserAuths
            .FirstOrDefaultAsync(u => u.UserEmail == userAuth.UserEmail && u.Password == userAuth.Password);

        return user != null;
    }

    public async Task<UserAuth> CreateUserAuth(UserAuth userAuth)
    {
        await _context.UserAuths.AddAsync(userAuth);
        await _context.SaveChangesAsync();
        return userAuth;
    }
}