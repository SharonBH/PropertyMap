using FSH.Framework.Core.Domain;

namespace FSH.Starter.WebApi.Catalog.Domain;

public class PropertyImage : BaseEntity<Guid>
{
    public Guid PropertyId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsMain { get; set; }

    public virtual Property Property { get; set; } = default!;

    public PropertyImage() { }
    public PropertyImage(Guid propertyId, string imageUrl, bool isMain)
    {
        PropertyId = propertyId;
        ImageUrl = imageUrl;
        IsMain = isMain;
    }
}
