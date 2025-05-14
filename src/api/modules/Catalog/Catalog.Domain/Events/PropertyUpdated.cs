using FSH.Framework.Core.Domain.Events;

namespace FSH.Starter.WebApi.Catalog.Domain.Events;

public sealed record PropertyUpdated : DomainEvent
{
    public Property? Property { get; set; }
}
