# Simple FTP Deployment Script
$ftpServer = "ftp.fasthosts.co.uk"
$ftpUser = "ftp.fasthosts.co.uk"
$ftpPass = "Kidskingdom@"

# List of files to upload (excluding deployment scripts)
$filesToUpload = @(
    "index.html",
    "events.html", 
    "style.css",
    "script.js"
)

# Upload assets folder
$assetFiles = Get-ChildItem "assets" -File

Write-Host "Starting FTP deployment to $ftpServer..." -ForegroundColor Green

try {
    # Upload main files
    foreach ($file in $filesToUpload) {
        if (Test-Path $file) {
            Write-Host "Uploading: $file" -ForegroundColor Cyan
            
            $ftp = "ftp://${ftpUser}:${ftpPass}@${ftpServer}/${file}"
            $webClient = New-Object System.Net.WebClient
            $webClient.UploadFile($ftp, $file)
            $webClient.Dispose()
            
            Write-Host "Uploaded: $file" -ForegroundColor Green
        }
    }
    
    # Upload assets
    foreach ($assetFile in $assetFiles) {
        $remotePath = "assets/" + $assetFile.Name
        Write-Host "Uploading: $remotePath" -ForegroundColor Cyan
        
        $ftp = "ftp://${ftpUser}:${ftpPass}@${ftpServer}/${remotePath}"
        $webClient = New-Object System.Net.WebClient
        $webClient.UploadFile($ftp, $assetFile.FullName)
        $webClient.Dispose()
        
        Write-Host "Uploaded: $remotePath" -ForegroundColor Green
    }
    
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "Error during FTP deployment: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "FTP deployment finished!" -ForegroundColor Green
