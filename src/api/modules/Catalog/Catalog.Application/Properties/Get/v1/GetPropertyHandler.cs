using Microsoft.Extensions.DependencyInjection;
using FSH.Starter.WebApi.Catalog.Domain.Exceptions;
using FSH.Framework.Core.Persistence;
using FSH.Framework.Core.Caching;
using FSH.Starter.WebApi.Catalog.Domain;
using MediatR;

namespace FSH.Starter.WebApi.Catalog.Application.Properties.Get.v1;
public sealed class GetPropertyHandler(
    [FromKeyedServices("catalog:properties")] IReadRepository<Property> repository,
    ICacheService cache)
    : IRequestHandler<GetPropertyRequest, PropertyResponse>
{
    public async Task<PropertyResponse> Handle(GetPropertyRequest request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);
        var item = await cache.GetOrSetAsync(
            $"Property:{request.Id}",
            async () =>
            {
                var PropertyItem = await repository.GetByIdAsync(request.Id, cancellationToken);
                if (PropertyItem == null) throw new PropertyNotFoundException(request.Id);
                var images = PropertyItem.Images.Select(img => new PropertyImageResponse(img.Id, img.ImageUrl, img.IsMain)).ToList();
                return new PropertyResponse(PropertyItem.Id, PropertyItem.Name, PropertyItem.Description, PropertyItem.Address, PropertyItem.AskingPrice, PropertyItem.Size, PropertyItem.Rooms, PropertyItem.Bathrooms, PropertyItem.NeighborhoodId, PropertyItem.PropertyTypeId, PropertyItem.ListedDate, PropertyItem.SoldDate, PropertyItem.SoldPrice, PropertyItem.FeatureList, PropertyItem.PropertyStatusId, PropertyItem.MarkerYaw, PropertyItem.MarkerPitch, images);
            },
            cancellationToken: cancellationToken);
        return item!;
    }
}
