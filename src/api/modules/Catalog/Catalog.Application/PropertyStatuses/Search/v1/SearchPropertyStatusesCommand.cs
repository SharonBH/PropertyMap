using FSH.Framework.Core.Paging;
using FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Get.v1;
using MediatR;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Search.v1;

public class SearchPropertyStatusCommand : PaginationFilter, IRequest<PagedList<PropertyStatusResponse>>
{
    public string? Name { get; set; }
    public string? Description { get; set; }
}
