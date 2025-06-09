using FSH.Starter.WebApi.Catalog.Domain.Events;
using MediatR;
using Microsoft.Extensions.Logging;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.EventHandlers;

public class PropertyStatusUpdatedEventHandler(ILogger<PropertyStatusUpdatedEventHandler> logger) : INotificationHandler<PropertyStatusUpdated>
{
    public async Task Handle(PropertyStatusUpdated notification,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling property type updated domain event...");
        await Task.FromResult(notification);
        logger.LogInformation("Finished handling property type updated domain event...");
    }
}
