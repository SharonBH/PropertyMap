using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;

namespace FSH.Starter.WebApi.Catalog.Infrastructure.Storage;

public class AzureBlobStorageService : IFileStorageService
{
    private readonly BlobContainerClient _containerClient;
    private readonly string _publicUrlBase;

    public AzureBlobStorageService(IConfiguration config)
    {
        var connectionString = config["AzureBlob:ConnectionString"];
        var containerName = config["AzureBlob:Container"] ?? "property-images";
        _publicUrlBase = config["AzureBlob:PublicUrlBase"] ?? "";
        _containerClient = new BlobContainerClient(connectionString, containerName);
        _containerClient.CreateIfNotExists();
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var safeFileName = Guid.NewGuid() + Path.GetExtension(fileName);
        var blobClient = _containerClient.GetBlobClient(safeFileName);
        await blobClient.UploadAsync(fileStream, overwrite: true, cancellationToken: cancellationToken);
        return string.IsNullOrEmpty(_publicUrlBase)
            ? blobClient.Uri.ToString()
            : _publicUrlBase.TrimEnd('/') + "/" + safeFileName;
    }
}
