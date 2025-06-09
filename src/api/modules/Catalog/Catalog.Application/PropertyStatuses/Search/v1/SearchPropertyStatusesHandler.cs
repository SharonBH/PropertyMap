using FSH.Framework.Core.Paging;
using FSH.Framework.Core.Persistence;
using FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Get.v1;
using FSH.Starter.WebApi.Catalog.Domain;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Search.v1;
public sealed class SearchPropertyStatusHandler(
    [FromKeyedServices("catalog:propertystatuses")] IReadRepository<PropertyStatus> repository)
    : IRequestHandler<SearchPropertyStatusCommand, PagedList<PropertyStatusResponse>>
{
    public async Task<PagedList<PropertyStatusResponse>> Handle(SearchPropertyStatusCommand request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);

        var spec = new SearchPropertyStatusSpecs(request);

        var items = await repository.ListAsync(spec, cancellationToken).ConfigureAwait(false);
        var totalCount = await repository.CountAsync(spec, cancellationToken).ConfigureAwait(false);

        return new PagedList<PropertyStatusResponse>(items, request!.PageNumber, request!.PageSize, totalCount);
    }
}
