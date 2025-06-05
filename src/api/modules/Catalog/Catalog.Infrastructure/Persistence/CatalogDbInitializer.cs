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
        const string Name = "נדלן ישראל";
        const string Description = "נדלן ישראל";
        const string Email = "test@agency1.com";
        const string Telephone = "04-5324345";
        const string Address = "address 1";
        const string LogoURL = "";
        const string PrimaryColor = "Blue";
        const string additionalInfo = "אין מידע נוסף כרגע";

        if (await context.Agencies.FirstOrDefaultAsync(t => t.Name == Name, cancellationToken).ConfigureAwait(false) is null)
        {
            var agency = Agency.Create(Name, Email, Telephone, Address, Description, LogoURL, PrimaryColor, additionalInfo);
            await context.Agencies.AddAsync(agency, cancellationToken);
        }

        const string RegionName = "גוש דן";
        const string RegionDescription = "גוש דן";
        const string Region2Name = "צפון";
        const string Region2Description = "צפון";
        const string Region3Name = "מרכז";
        const string Region3Description = "מרכז";
        const string Region4Name = "דרום";
        const string Region4Description = "דרום";

        if (await context.Regions.FirstOrDefaultAsync(t => t.Name == RegionName, cancellationToken).ConfigureAwait(false) is null)
        {
            var region = Region.Create(RegionName, RegionDescription);
            var region2 = Region.Create(Region2Name, Region2Description);
            var region3 = Region.Create(Region3Name, Region3Description);
            var region4 = Region.Create(Region4Name, Region4Description);

            await context.Regions.AddAsync(region, cancellationToken);
            await context.Regions.AddAsync(region2, cancellationToken);
            await context.Regions.AddAsync(region3, cancellationToken);
            await context.Regions.AddAsync(region4, cancellationToken);

        const string CityName = "תל אביב";

            var city1 = City.Create(CityName, CityName, region.Id);
            var city2 = City.Create("חיפה", "חיפה", region2.Id);
            var city3 = City.Create("ראשון לציון", "ראשון לציון", region3.Id);
            var city4 = City.Create("באר שבע", "באר שבע", region4.Id);

            await context.Cities.AddAsync(city1, cancellationToken);
            await context.Cities.AddAsync(city2, cancellationToken);
            await context.Cities.AddAsync(city3, cancellationToken);
            await context.Cities.AddAsync(city4, cancellationToken);

            const string NeighborhoodName = "צהלה";
            const string NeighborhoodDescription = "צהלה";
            const string SphereURL = "16.jpg";
            const string IconURL = "16.jpg";
            const double Score = 4.5;

            var neighborhood1 = Neighborhood.Create(NeighborhoodName, NeighborhoodDescription, city1.Id, SphereURL, IconURL, Score);
            var neighborhood2 = Neighborhood.Create("רמת אביב", "רמת אביב", city1.Id, SphereURL, IconURL, Score);
            var neighborhood3 = Neighborhood.Create("כרמל", "כרמל", city2.Id, SphereURL, IconURL, Score);
            var neighborhood4 = Neighborhood.Create("עתלית", "עתלית", city2.Id, SphereURL, IconURL, Score);
            var neighborhood5 = Neighborhood.Create("על הים", "על הים", city3.Id, SphereURL, IconURL, Score);
            var neighborhood6 = Neighborhood.Create("אוניברסיטה", "אוניברסיטה", city4.Id, SphereURL, IconURL, Score);

            await context.Neighborhoods.AddAsync(neighborhood1, cancellationToken);
            await context.Neighborhoods.AddAsync(neighborhood2, cancellationToken);
            await context.Neighborhoods.AddAsync(neighborhood3, cancellationToken);
            await context.Neighborhoods.AddAsync(neighborhood4, cancellationToken);
            await context.Neighborhoods.AddAsync(neighborhood5, cancellationToken);
            await context.Neighborhoods.AddAsync(neighborhood6, cancellationToken);

        }

        if (await context.PropertyTypes.FirstOrDefaultAsync(cancellationToken).ConfigureAwait(false) is null)
        {
            var propertyType1 = PropertyType.Create("דירה", "דירה");
            var propertyType2 = PropertyType.Create("בית פרטי", "בית פרטי");
            var propertyType3 = PropertyType.Create("דירת גן", "דירת גן");
            var propertyType4 = PropertyType.Create("פנטהאוז", "פנטהאוז");
            var propertyType5 = PropertyType.Create("מיני פנטהאוז", "מיני פנטהאוז");
            var propertyType6 = PropertyType.Create("דירת גג", "דירת גג");
            var propertyType7 = PropertyType.Create("קוטג", "קוטג");

            await context.PropertyTypes.AddAsync(propertyType1, cancellationToken);
            await context.PropertyTypes.AddAsync(propertyType2, cancellationToken);
            await context.PropertyTypes.AddAsync(propertyType3, cancellationToken);
            await context.PropertyTypes.AddAsync(propertyType4, cancellationToken);
            await context.PropertyTypes.AddAsync(propertyType5, cancellationToken);
            await context.PropertyTypes.AddAsync(propertyType6, cancellationToken);
            await context.PropertyTypes.AddAsync(propertyType7, cancellationToken);
        }

            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
            logger.LogInformation("[{Tenant}] seeding default catalog data", context.TenantInfo!.Identifier);
        
    }
}
