using System;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Create.v1;
public class CreatePropertyStatusResponse
{
    public Guid Id { get; set; }
    public CreatePropertyStatusResponse(Guid id)
    {
        Id = id;
    }
}
