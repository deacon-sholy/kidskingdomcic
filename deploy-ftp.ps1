# FTP Deployment Script for Kids Kingdom CIC
$ftpServer = "ftp.fasthosts.co.uk"
$ftpUser = "ftp.fasthosts.co.uk"
$ftpPass = "Kidskingdom@"
$localPath = "c:\Users\dell\Downloads\kidskingdomcic"
$remotePath = "/"

Write-Host "Starting FTP deployment to $ftpServer..." -ForegroundColor Green

# Create FTP request
$ftpRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpServer$remotePath")
$ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
$ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
$ftpRequest.UsePassive = $true
$ftpRequest.UseBinary = $true
$ftpRequest.KeepAlive = $false

try {
    # Test connection
    $ftpResponse = $ftpRequest.GetResponse()
    $ftpResponse.Close()
    Write-Host "FTP connection successful!" -ForegroundColor Green
    
    # Upload files
    $files = Get-ChildItem -Path $localPath -File -Recurse
    $totalFiles = $files.Count
    $uploadedFiles = 0
    
    foreach ($file in $files) {
        $relativePath = $file.FullName.Replace($localPath, "").Replace("\", "/")
        $remoteFilePath = "$remotePath$relativePath"
        
        Write-Host "Uploading: $relativePath" -ForegroundColor Cyan
        
        # Create directory if needed
        $remoteDir = [System.IO.Path]::GetDirectoryName($remoteFilePath)
        if ($remoteDir -and $remoteDir -ne "/") {
            $dirRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpServer$remoteDir")
            $dirRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
            $dirRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
            try {
                $dirResponse = $dirRequest.GetResponse()
                $dirResponse.Close()
            } catch {
                # Directory might already exist
            }
        }
        
        # Upload file
        $uploadRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpServer$remoteFilePath")
        $uploadRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
        $uploadRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $uploadRequest.UseBinary = $true
        $uploadRequest.UsePassive = $true
        
        $fileContent = [System.IO.File]::ReadAllBytes($file.FullName)
        $uploadRequest.ContentLength = $fileContent.Length
        
        $requestStream = $uploadRequest.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $uploadedFiles++
        Write-Progress -Activity "FTP Deployment" -Status "Uploaded $uploadedFiles of $totalFiles files" -PercentComplete (($uploadedFiles / $totalFiles) * 100)
    }
    
    Write-Host "Deployment completed successfully! Uploaded $uploadedFiles files." -ForegroundColor Green
    
} catch {
    Write-Host "Error during FTP deployment: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "FTP deployment finished!" -ForegroundColor Green
