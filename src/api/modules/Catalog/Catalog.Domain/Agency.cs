using FSH.Framework.Core.Domain;
using FSH.Framework.Core.Domain.Contracts;
using FSH.Starter.WebApi.Catalog.Domain.Events;

namespace FSH.Starter.WebApi.Catalog.Domain;
public class Agency : AuditableEntity, IAggregateRoot
{
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Telephone { get; private set; } = string.Empty;
    public string Address { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string LogoURL { get; private set; } = string.Empty;
    public string PrimaryColor { get; private set; } = string.Empty;
    public string? AdditionalInfo { get; private set; }

    private Agency() { }

    private Agency(Guid id, string name, string email, string telephone, string address, string description, string logoURL, string primaryColor, string? additionalInfo)
    {
        Id = id;
        Name = name;
        Email = email;
        Telephone = telephone;
        Address = address;
        Description = description;
        LogoURL = logoURL;
        PrimaryColor = primaryColor;
        AdditionalInfo = additionalInfo;
        QueueDomainEvent(new AgencyCreated { Agency = this });
    }

    public static Agency Create(string name, string email, string telephone, string address, string description, string logoURL, string primaryColor, string? additionalInfo)
    {
        return new Agency(Guid.NewGuid(), name, email, telephone, address, description, logoURL, primaryColor, additionalInfo);
    }

    public Agency Update(string? name, string? email, string? telephone, string? address, string? description, string? logoURL, string? primaryColor, string? additionalInfo)
    {
        bool isUpdated = false;

        if (!string.IsNullOrWhiteSpace(name) && !string.Equals(Name, name, StringComparison.OrdinalIgnoreCase))
        {
            Name = name;
            isUpdated = true;
        }

        if (!string.IsNullOrWhiteSpace(email) && !string.Equals(Email, email, StringComparison.OrdinalIgnoreCase))
        {
            Email = email;
            isUpdated = true;
        }

        if (!string.IsNullOrWhiteSpace(telephone) && !string.Equals(Telephone, telephone, StringComparison.OrdinalIgnoreCase))
        {
            Telephone = telephone;
            isUpdated = true;
        }

        if (!string.IsNullOrWhiteSpace(address) && !string.Equals(Address, address, StringComparison.OrdinalIgnoreCase))
        {
            Address = address;
            isUpdated = true;
        }

        if (!string.IsNullOrWhiteSpace(description) && !string.Equals(Description, description, StringComparison.OrdinalIgnoreCase))
        {
            Description = description;
            isUpdated = true;
        }

        if (!string.IsNullOrWhiteSpace(logoURL) && !string.Equals(LogoURL, logoURL, StringComparison.OrdinalIgnoreCase))
        {
            LogoURL = logoURL;
            isUpdated = true;
        }

        if (!string.IsNullOrWhiteSpace(primaryColor) && !string.Equals(PrimaryColor, primaryColor, StringComparison.OrdinalIgnoreCase))
        {
            PrimaryColor = primaryColor;
            isUpdated = true;
        }

        // Special handling for additionalInfo: allow null or empty string
        if (additionalInfo != AdditionalInfo) // Compare directly, allow null assignment
        {
            AdditionalInfo = additionalInfo;
            isUpdated = true;
        }

        if (isUpdated)
        {
            QueueDomainEvent(new AgencyUpdated { Agency = this });
        }

        return this;
    }
}
