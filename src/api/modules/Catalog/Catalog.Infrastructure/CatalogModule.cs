using Carter;
using FSH.Framework.Core.Persistence;
using FSH.Framework.Infrastructure.Persistence;
using FSH.Starter.WebApi.Catalog.Domain;
using FSH.Starter.WebApi.Catalog.Infrastructure.Endpoints.v1;
using FSH.Starter.WebApi.Catalog.Infrastructure.Persistence;
using FSH.Starter.WebApi.Catalog.Infrastructure.Storage;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;

namespace FSH.Starter.WebApi.Catalog.Infrastructure;
public static class CatalogModule
{
    public class Endpoints : CarterModule
    {
        public Endpoints() : base("catalog") { }
        public override void AddRoutes(IEndpointRouteBuilder app)
        {
            var productGroup = app.MapGroup("products").WithTags("products");
            productGroup.MapProductCreationEndpoint();
            productGroup.MapGetProductEndpoint();
            productGroup.MapGetProductListEndpoint();
            productGroup.MapProductUpdateEndpoint();
            productGroup.MapProductDeleteEndpoint();

            var brandGroup = app.MapGroup("brands").WithTags("brands");
            brandGroup.MapBrandCreationEndpoint();
            brandGroup.MapGetBrandEndpoint();
            brandGroup.MapGetBrandListEndpoint();
            brandGroup.MapBrandUpdateEndpoint();
            brandGroup.MapBrandDeleteEndpoint();

            var agencyGroup = app.MapGroup("agencies").WithTags("agencies");
            agencyGroup.MapAgencyCreationEndpoint();
            agencyGroup.MapGetAgencyEndpoint();
            agencyGroup.MapGetAgencyListEndpoint();
            agencyGroup.MapAgencyUpdateEndpoint();
            agencyGroup.MapAgencyDeleteEndpoint();

            var regionGroup = app.MapGroup("regions").WithTags("regions");
            regionGroup.MapRegionCreationEndpoint();
            regionGroup.MapGetRegionEndpoint();
            regionGroup.MapSearchRegionsEndpoint();
            regionGroup.MapRegionUpdateEndpoint();
            regionGroup.MapRegionDeleteEndpoint();

            var cityGroup = app.MapGroup("cities").WithTags("cities");
            cityGroup.MapCityCreationEndpoint();
            cityGroup.MapGetCityEndpoint();
            cityGroup.MapSearchCitiesEndpoint();
            cityGroup.MapCityUpdateEndpoint();
            cityGroup.MapCityDeleteEndpoint();

            var neighborhoodGroup = app.MapGroup("neighborhoods").WithTags("neighborhoods");
            neighborhoodGroup.MapNeighborhoodCreationEndpoint();
            neighborhoodGroup.MapGetNeighborhoodEndpoint();
            neighborhoodGroup.MapSearchNeighborhoodsEndpoint();
            neighborhoodGroup.MapNeighborhoodUpdateEndpoint();
            neighborhoodGroup.MapNeighborhoodDeleteEndpoint();

            var propertyTypeGroup = app.MapGroup("propertytypes").WithTags("propertytypes");
            propertyTypeGroup.MapPropertyTypeCreationEndpoint();
            propertyTypeGroup.MapGetPropertyTypeEndpoint();
            propertyTypeGroup.MapSearchPropertyTypesEndpoint();
            propertyTypeGroup.MapPropertyTypeUpdateEndpoint();
            propertyTypeGroup.MapPropertyTypeDeleteEndpoint();

            var propertyGroup = app.MapGroup("properties").WithTags("properties");
            propertyGroup.MapPropertyCreationEndpoint();
            propertyGroup.MapGetPropertyEndpoint();
            propertyGroup.MapPropertyUpdateEndpoint();
            propertyGroup.MapGetPropertiesListEndpoint();
            propertyGroup.MapPropertyDeleteEndpoint();

            var reviewGroup = app.MapGroup("reviews").WithTags("reviews");
            reviewGroup.MapReviewCreationEndpoint();
            reviewGroup.MapGetReviewEndpoint();
            reviewGroup.MapSearchReviewsEndpoint();
            reviewGroup.MapReviewUpdateEndpoint();
            reviewGroup.MapReviewDeleteEndpoint();

            var propertyStatusGroup = app.MapGroup("propertystatuses").WithTags("propertystatuses");
            propertyStatusGroup.MapPropertyStatusCreationEndpoint();
            propertyStatusGroup.MapGetPropertyStatusEndpoint();
            propertyStatusGroup.MapSearchPropertyStatusesEndpoint();
            propertyStatusGroup.MapPropertyStatusUpdateEndpoint();
            propertyStatusGroup.MapPropertyStatusDeleteEndpoint();

            // File upload endpoint (minimal API style)
            app.MapPost("/files/upload", async (IFileStorageService fileStorageService, HttpRequest request, CancellationToken cancellationToken) =>
            {
                if (!request.HasFormContentType)
                    return Results.BadRequest("No file uploaded");

                var form = await request.ReadFormAsync(cancellationToken);
                var file = form.Files["file"];
                if (file == null || file.Length == 0)
                    return Results.BadRequest("No file uploaded");

                var url = await fileStorageService.UploadAsync(file.OpenReadStream(), file.FileName, file.ContentType, cancellationToken);
                return Results.Ok(new { url });
            })
            .WithName("FileUpload")
            .WithTags("files")
            .WithSummary("Uploads a file and returns its URL.")
            .WithDescription("Uploads a file to storage and returns the public URL.")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .MapToApiVersion(1);

        
        }
    }
    public static WebApplicationBuilder RegisterCatalogServices(this WebApplicationBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);
        builder.Services.BindDbContext<CatalogDbContext>();
        builder.Services.AddScoped<IDbInitializer, CatalogDbInitializer>();
        builder.Services.AddKeyedScoped<IRepository<Product>, CatalogRepository<Product>>("catalog:products");
        builder.Services.AddKeyedScoped<IReadRepository<Product>, CatalogRepository<Product>>("catalog:products");
        builder.Services.AddKeyedScoped<IRepository<Brand>, CatalogRepository<Brand>>("catalog:brands");
        builder.Services.AddKeyedScoped<IReadRepository<Brand>, CatalogRepository<Brand>>("catalog:brands");
        builder.Services.AddKeyedScoped<IRepository<Agency>, CatalogRepository<Agency>>("catalog:agencies");
        builder.Services.AddKeyedScoped<IReadRepository<Agency>, CatalogRepository<Agency>>("catalog:agencies");
        builder.Services.AddKeyedScoped<IRepository<Region>, CatalogRepository<Region>>("catalog:regions");
        builder.Services.AddKeyedScoped<IReadRepository<Region>, CatalogRepository<Region>>("catalog:regions");
        builder.Services.AddKeyedScoped<IRepository<City>, CatalogRepository<City>>("catalog:cities");
        builder.Services.AddKeyedScoped<IReadRepository<City>, CatalogRepository<City>>("catalog:cities");
        builder.Services.AddKeyedScoped<IRepository<Neighborhood>, CatalogRepository<Neighborhood>>("catalog:neighborhoods");
        builder.Services.AddKeyedScoped<IReadRepository<Neighborhood>, CatalogRepository<Neighborhood>>("catalog:neighborhoods");
        builder.Services.AddKeyedScoped<IRepository<PropertyType>, CatalogRepository<PropertyType>>("catalog:propertytypes");
        builder.Services.AddKeyedScoped<IReadRepository<PropertyType>, CatalogRepository<PropertyType>>("catalog:propertytypes");
        builder.Services.AddKeyedScoped<IRepository<Property>, CatalogRepository<Property>>("catalog:properties");
        builder.Services.AddKeyedScoped<IReadRepository<Property>, CatalogRepository<Property>>("catalog:properties");
        builder.Services.AddKeyedScoped<IRepository<Review>, CatalogRepository<Review>>("catalog:reviews");
        builder.Services.AddKeyedScoped<IReadRepository<Review>, CatalogRepository<Review>>("catalog:reviews");
        builder.Services.AddKeyedScoped<IRepository<PropertyStatus>, CatalogRepository<PropertyStatus>>("catalog:propertystatuses");
        builder.Services.AddKeyedScoped<IReadRepository<PropertyStatus>, CatalogRepository<PropertyStatus>>("catalog:propertystatuses");
        var services = builder.Services;
        var config = builder.Configuration;
        var storageProvider = config["STORAGE_PROVIDER"] ?? "local";
        if (string.Equals(storageProvider, "azure", StringComparison.OrdinalIgnoreCase))
        {
            services.AddSingleton<IFileStorageService, AzureBlobStorageService>();
        }
        else
        {
            services.AddSingleton<IFileStorageService, LocalFileStorageService>();
        }
        return builder;
    }
    public static WebApplication UseCatalogModule(this WebApplication app)
    {
        return app;
    }
}
