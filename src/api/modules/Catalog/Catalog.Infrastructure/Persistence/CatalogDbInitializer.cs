using FSH.Framework.Core.Persistence;
using FSH.Starter.WebApi.Catalog.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FSH.Starter.WebApi.Catalog.Infrastructure.Persistence;
internal sealed class CatalogDbInitializer(
    ILogger<CatalogDbInitializer> logger,
    CatalogDbContext context) : IDbInitializer
{
    public async Task MigrateAsync(CancellationToken cancellationToken)
    {
        if ((await context.Database.GetPendingMigrationsAsync(cancellationToken)).Any())
        {
            await context.Database.MigrateAsync(cancellationToken).ConfigureAwait(false);
            logger.LogInformation("[{Tenant}] applied database migrations for catalog module", context.TenantInfo!.Identifier);
        }
    }

    public async Task SeedAsync(CancellationToken cancellationToken)
    {
        var id = Guid.Parse("662247D4-3A11-4FA3-8E01-A54452D3AD4C");
        var tenatInfo = context.TenantInfo!.Identifier;
        string name = $"{tenatInfo}-חברת נדלן";
        const string Description = "נדלן ישראל";
        string email = $"info@{tenatInfo}.com";
        const string Telephone = "04-5324345";
        const string Address = "address 2";
        const string LogoURL = "";
        const string PrimaryColor = "Blue";
        const string additionalInfo = "אין מידע נוסף כרגע";

        if (await context.Agencies.FirstOrDefaultAsync(cancellationToken).ConfigureAwait(false) is null)
        {
            var agency = Agency.Create(name, email, Telephone, Address, Description, LogoURL, PrimaryColor, additionalInfo);
            await context.Agencies.AddAsync(agency, cancellationToken);


            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
            logger.LogInformation("[{Tenant}] seeding default catalog data", context.TenantInfo!.Identifier);
        }
        else
        {
            logger.LogInformation("[{Tenant}] catalog data already seeded", context.TenantInfo!.Identifier);
        }
    }
}
