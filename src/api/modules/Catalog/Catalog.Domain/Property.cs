using FSH.Framework.Core.Domain;
using FSH.Framework.Core.Domain.Contracts;
using FSH.Starter.WebApi.Catalog.Domain.Events;


namespace FSH.Starter.WebApi.Catalog.Domain;
public class Property : AuditableEntity, IAggregateRoot
{
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public Guid NeighborhoodId { get; private set; }
    public virtual Neighborhood Neighborhood { get; private set; } = default!;
    public string Address { get; private set; } = string.Empty;
    public decimal AskingPrice { get; private set; }
    public double Size { get; private set; }
    public int Rooms { get; private set; }
    public int Bathrooms { get; private set; }
    public Guid PropertyTypeId { get; private set; }
    public virtual PropertyType PropertyType { get; private set; } = default!;

    public Guid AgencyId { get; private set; }
    public virtual Agency Agency { get; private set; } = default!;
    public DateTime ListedDate { get; private set; }
    public DateTime? SoldDate { get; private set; }
    public decimal? SoldPrice { get; private set; }
    public string FeatureList { get; private set; } = string.Empty;
    public Guid PropertyStatusId { get; private set; }
    public virtual PropertyStatus PropertyStatus { get; private set; } = default!;
    public decimal MarkerYaw { get; private set; }
    public decimal MarkerPitch { get; private set; }
    public virtual ICollection<PropertyImage> Images { get; private set; } = new List<PropertyImage>();

    private Property() { }

    private Property(Guid id, string name, string description, Guid neighborhoodId, string address, decimal askingPrice, double size, int rooms, int bathrooms, Guid propertyTypeId, Guid propertyStatusId, Guid agencyId, DateTime listedDate, string featureList, decimal markerYaw, decimal markerPitch)
    {
        Id = id;
        Name = name;
        Description = description;
        NeighborhoodId = neighborhoodId;
        Address = address;
        AskingPrice = askingPrice;
        Size = size;
        Rooms = rooms;
        Bathrooms = bathrooms;
        PropertyTypeId = propertyTypeId;
        PropertyStatusId = propertyStatusId;
        AgencyId = agencyId;
        ListedDate = listedDate;
        FeatureList = featureList;
        MarkerYaw = markerYaw;
        MarkerPitch = markerPitch;
        Images = new List<PropertyImage>();

        QueueDomainEvent(new PropertyCreated { Property = this });
    }

    public static Property Create(string name, string description, Guid neighborhoodId, string address, decimal askingPrice, double size, int rooms, int bathrooms, Guid propertyTypeId, Guid propertyStatusId, Guid agencyId, DateTime listedDate, string featureList, decimal markerYaw, decimal markerPitch)
    {
        return new Property(Guid.NewGuid(), name, description, neighborhoodId, address, askingPrice, size, rooms, bathrooms, propertyTypeId, propertyStatusId, agencyId, listedDate, featureList, markerYaw, markerPitch);
    }

    public Property Update(string? name, string? description, Guid? neighborhoodId, string? address, decimal? askingPrice, double? size, int? rooms, int? bathrooms, Guid? propertyTypeId, Guid? propertyStatusId, Guid? agencyId, DateTime? listedDate, DateTime? soldDate, decimal? soldPrice, string? featureList, decimal? markerYaw, decimal? markerPitch)
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

        if (neighborhoodId.HasValue && NeighborhoodId != neighborhoodId.Value)
        {
            NeighborhoodId = neighborhoodId.Value;
            isUpdated = true;
        }

        if (!string.IsNullOrWhiteSpace(address) && !string.Equals(Address, address, StringComparison.OrdinalIgnoreCase))
        {
            Address = address;
            isUpdated = true;
        }

        if (askingPrice.HasValue && AskingPrice != askingPrice.Value)
        {
            AskingPrice = askingPrice.Value;
            isUpdated = true;
        }

        if (size.HasValue && Math.Abs(Size - size.Value) > 0.0001)
        {
            Size = size.Value;
            isUpdated = true;
        }

        if (rooms.HasValue && Rooms != rooms.Value)
        {
            Rooms = rooms.Value;
            isUpdated = true;
        }

        if (bathrooms.HasValue && Bathrooms != bathrooms.Value)
        {
            Bathrooms = bathrooms.Value;
            isUpdated = true;
        }

        if (propertyTypeId.HasValue && PropertyTypeId != propertyTypeId.Value)
        {
            PropertyTypeId = propertyTypeId.Value;
            isUpdated = true;
        }

        if (agencyId.HasValue && AgencyId != agencyId.Value)
        {
            AgencyId = agencyId.Value;
            isUpdated = true;
        }

        if (listedDate.HasValue && ListedDate != listedDate.Value)
        {
            ListedDate = listedDate.Value;
            isUpdated = true;
        }

        if (soldDate.HasValue && SoldDate != soldDate.Value)
        {
            SoldDate = soldDate.Value;
            isUpdated = true;
        }

        if (soldPrice.HasValue && SoldPrice != soldPrice.Value)
        {
            SoldPrice = soldPrice.Value;
            isUpdated = true;
        }

        if (!string.IsNullOrWhiteSpace(featureList) && !string.Equals(FeatureList, featureList, StringComparison.OrdinalIgnoreCase))
        {
            FeatureList = featureList;
            isUpdated = true;
        }
        if (propertyStatusId.HasValue && PropertyStatusId != propertyStatusId.Value)
        {
            PropertyStatusId = propertyStatusId.Value;
            isUpdated = true;
        }
        if (markerYaw.HasValue && MarkerYaw != markerYaw.Value)
        {
            MarkerYaw = markerYaw.Value;
            isUpdated = true;
        }
        if (markerPitch.HasValue && MarkerPitch != markerPitch.Value)
        {
            MarkerPitch = markerPitch.Value;
            isUpdated = true;
        }

        if (isUpdated)
        {
            QueueDomainEvent(new PropertyUpdated { Property = this });
        }

        return this;
    }
}
