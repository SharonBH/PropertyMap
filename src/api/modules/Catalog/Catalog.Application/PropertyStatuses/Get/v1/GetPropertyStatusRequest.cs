using MediatR;
using System;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Get.v1;
public class GetPropertyStatusRequest : IRequest<PropertyStatusResponse>
{
    public Guid Id { get; set; }
    public GetPropertyStatusRequest(Guid id)
    {
        Id = id;
    }
}
