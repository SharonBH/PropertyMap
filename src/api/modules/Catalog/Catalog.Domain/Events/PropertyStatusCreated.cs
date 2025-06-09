using FSH.Framework.Core.Domain.Events;

namespace FSH.Starter.WebApi.Catalog.Domain.Events;

public sealed record PropertyStatusCreated : DomainEvent
{
    public PropertyStatus? PropertyStatus { get; set; }
}
