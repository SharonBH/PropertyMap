using FSH.Framework.Core.Persistence;
using FSH.Starter.WebApi.Catalog.Domain;
using FSH.Starter.WebApi.Catalog.Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace FSH.Starter.WebApi.Catalog.Application.Properties.Update.v1;
public sealed class UpdatePropertyHandler(
    ILogger<UpdatePropertyHandler> logger,
    [FromKeyedServices("catalog:properties")] IRepository<Property> repository)
    : IRequestHandler<UpdatePropertyCommand, UpdatePropertyResponse>
{
    public async Task<UpdatePropertyResponse> Handle(UpdatePropertyCommand request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);
        var property = await repository.GetByIdAsync(request.Id, cancellationToken);
        _ = property ?? throw new PropertyNotFoundException(request.Id);

        var updatedProperty = property.Update(request.Name, request.Description, request.NeighborhoodId, request.Address, request.AskingPrice, request.Size, request.Rooms, request.Bathrooms, request.PropertyTypeId, request.PropertyStatusId, request.AgencyId, request.ListedDate, request.SoldDate, request.SoldPrice, request.FeatureList, request.MarkerYaw, request.MarkerPitch);

        await repository.UpdateAsync(updatedProperty, cancellationToken);
        logger.LogInformation("Property with id : {PropertyId} updated.", property.Id);

        if (request.Images is not null)
        {
            // Remove images not in the request
            var toRemove = property.Images.Where(img => request.Images.All(r => r.Id != img.Id)).ToList();
            foreach (var img in toRemove)
                property.Images.Remove(img);

            // Add or update images
            foreach (var imgDto in request.Images)
            {
                if (imgDto.Id.HasValue)
                {
                    var existing = property.Images.FirstOrDefault(i => i.Id == imgDto.Id.Value);
                    if (existing != null)
                    {
                        existing.ImageUrl = imgDto.ImageUrl;
                        existing.IsMain = imgDto.IsMain;
                    }
                }
                else
                {
                    property.Images.Add(new PropertyImage(property.Id, imgDto.ImageUrl, imgDto.IsMain));
                }
            }

            // Save the property again after modifying the images collection
            await repository.UpdateAsync(property, cancellationToken);
            logger.LogInformation("Updated {Count} images for property with id: {PropertyId}", request.Images.Count, property.Id);
        }

        return new UpdatePropertyResponse(property.Id);
    }
}
