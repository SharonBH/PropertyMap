using System;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Get.v1;
public class PropertyStatusResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public PropertyStatusResponse(Guid id, string name, string description)
    {
        Id = id;
        Name = name;
        Description = description;
    }
}
