using FSH.Starter.WebApi.Catalog.Domain.Events;
using MediatR;
using Microsoft.Extensions.Logging;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.EventHandlers;

public class PropertyStatusCreatedEventHandler(ILogger<PropertyStatusCreatedEventHandler> logger) : INotificationHandler<PropertyStatusCreated>
{
    public async Task Handle(PropertyStatusCreated notification,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling property type created domain event...");
        await Task.FromResult(notification);
        logger.LogInformation("Finished handling property type created domain event...");
    }
}
