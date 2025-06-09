using Ardalis.Specification;
using FSH.Framework.Core.Paging;
using FSH.Framework.Core.Specifications;
using FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Get.v1;
using FSH.Starter.WebApi.Catalog.Domain;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Search.v1;
public class SearchPropertyStatusSpecs : EntitiesByPaginationFilterSpec<PropertyStatus, PropertyStatusResponse>
{
    public SearchPropertyStatusSpecs(SearchPropertyStatusCommand command)
        : base(command) =>
        Query
            .OrderBy(c => c.Name, !command.HasOrderBy())
            .Where(a => a.Name.Contains(command.Keyword), !string.IsNullOrEmpty(command.Keyword));
}
