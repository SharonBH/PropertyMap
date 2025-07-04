using FSH.Framework.Core.Domain;
using FSH.Framework.Core.Domain.Contracts;

namespace FSH.Starter.WebApi.Catalog.Domain;
public class PropertyStatus : AuditableEntity, IAggregateRoot
{
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;

    private PropertyStatus() { }

    private PropertyStatus(Guid id, string name, string description)
    {
        Id = id;
        Name = name;
        Description = description;
    }

    public static PropertyStatus Create(string name, string description)
    {
        return new PropertyStatus(Guid.NewGuid(), name, description);
    }

    public PropertyStatus Update(string? name, string? description)
    {
        bool isUpdated = false;

        if (!string.IsNullOrWhiteSpace(name) && !string.Equals(Name, name, StringComparison.OrdinalIgnoreCase))
        {
            Name = name;
            isUpdated = true;
        }

        if (!string.IsNullOrWhiteSpace(description) && !string.Equals(Description, description, StringComparison.OrdinalIgnoreCase))
        {
            Description = description;
            isUpdated = true;
        }

        if (isUpdated)
        {
            //QueueDomainEvent(new PropertyStatusUpdated { PropertyStatus = this });
        }

        return this;
    }
}
