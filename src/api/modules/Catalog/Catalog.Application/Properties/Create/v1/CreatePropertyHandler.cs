using FSH.Framework.Core.Persistence;
using FSH.Starter.WebApi.Catalog.Domain;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace FSH.Starter.WebApi.Catalog.Application.Properties.Create.v1;
public sealed class CreatePropertyHandler(
    ILogger<CreatePropertyHandler> logger,
    [FromKeyedServices("catalog:properties")] IRepository<Property> repository)
    : IRequestHandler<CreatePropertyCommand, CreatePropertyResponse>
{
    public async Task<CreatePropertyResponse> Handle(CreatePropertyCommand request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);
        var property = Property.Create(request.Name!, request.Description, request.NeighborhoodId, request.Address, request.AskingPrice, request.Size, request.Rooms, request.Bathrooms, request.PropertyTypeId, request.PropertyStatusId, request.AgencyId, request.ListedDate, request.FeatureList, request.MarkerYaw, request.MarkerPitch);
        if (request.Images is not null && request.Images.Count > 0)
        {
            foreach (var img in request.Images)
            {
                property.Images.Add(new PropertyImage(property.Id, img.ImageUrl, img.IsMain));
            }
        }
        await repository.AddAsync(property, cancellationToken);
        logger.LogInformation("property created {PropertyId}", property.Id);
        return new CreatePropertyResponse(property.Id);
    }
}
