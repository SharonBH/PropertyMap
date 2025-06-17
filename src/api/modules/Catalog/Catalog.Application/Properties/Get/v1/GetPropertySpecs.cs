using Ardalis.Specification;
using FSH.Starter.WebApi.Catalog.Domain;

namespace FSH.Starter.WebApi.Catalog.Application.Properties.Get.v1;

public class GetPropertySpecs : Specification<Property>
{
    public GetPropertySpecs(Guid id)
    {
        Query
            .Where(p => p.Id == id)
            .Include(p => p.Images);
    }
}
