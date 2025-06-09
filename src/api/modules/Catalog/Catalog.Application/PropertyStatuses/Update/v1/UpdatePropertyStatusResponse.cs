using System;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Update.v1;
public class UpdatePropertyStatusResponse
{
    public Guid Id { get; set; }
    public UpdatePropertyStatusResponse(Guid id)
    {
        Id = id;
    }
}
