using System;

namespace FSH.Starter.WebApi.Catalog.Domain.Exceptions;
public class PropertyStatusNotFoundException : Exception
{
    public PropertyStatusNotFoundException(Guid id)
        : base($"PropertyStatus with id '{id}' was not found.")
    {
    }
}
