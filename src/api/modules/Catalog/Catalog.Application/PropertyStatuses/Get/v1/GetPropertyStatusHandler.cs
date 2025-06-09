using Microsoft.Extensions.DependencyInjection;
using FSH.Starter.WebApi.Catalog.Domain.Exceptions;
using FSH.Framework.Core.Persistence;
using FSH.Framework.Core.Caching;
using FSH.Starter.WebApi.Catalog.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Get.v1;
public sealed class GetPropertyStatusHandler(
    [FromKeyedServices("catalog:propertystatuses")] IReadRepository<PropertyStatus> repository,
    ICacheService cache)
    : IRequestHandler<GetPropertyStatusRequest, PropertyStatusResponse>
{
    public async Task<PropertyStatusResponse> Handle(GetPropertyStatusRequest request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);
        var item = await cache.GetOrSetAsync(
            $"PropertyStatus:{request.Id}",
            async () =>
            {
                var propertyStatusItem = await repository.GetByIdAsync(request.Id, cancellationToken);
                if (propertyStatusItem == null) throw new PropertyStatusNotFoundException(request.Id);
                return new PropertyStatusResponse(propertyStatusItem.Id, propertyStatusItem.Name, propertyStatusItem.Description);
            },
            cancellationToken: cancellationToken);
        return item!;
    }
}
