# Native FTP Deployment Script
$ftpServer = "ftp.fasthosts.co.uk"
$ftpUser = "ftp.fasthosts.co.uk"
$ftpPass = "Kidskingdom@"

Write-Host "Starting FTP deployment to $ftpServer..." -ForegroundColor Green

# Create temporary FTP script file
$ftpScript = @"
open $ftpServer
$ftpUser
$ftpPass
binary
lcd "c:\Users\dell\Downloads\kidskingdomcic"
cd /
put index.html
put events.html
put style.css
put script.js
mkdir assets
cd assets
mput assets/*
bye
"@

$ftpScript | Out-File -FilePath "temp-ftp.txt" -Encoding ASCII

try {
    Write-Host "Executing FTP commands..." -ForegroundColor Cyan
    ftp -s:temp-ftp.txt
    
    Write-Host "Deployment completed!" -ForegroundColor Green
    
    # Clean up
    Remove-Item "temp-ftp.txt" -ErrorAction SilentlyContinue
    
} catch {
    Write-Host "Error during FTP deployment: $($_.Exception.Message)" -ForegroundColor Red
    Remove-Item "temp-ftp.txt" -ErrorAction SilentlyContinue
    exit 1
}
