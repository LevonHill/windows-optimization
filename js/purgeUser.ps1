param(
    [string]$TargetUsername
)

Write-Host "[+] Locating SID for user $TargetUsername..."

# Resolve SID from username
$sid = (Get-WmiObject Win32_UserAccount | Where-Object { $_.Name -eq $TargetUsername }).SID

if (-not $sid) {
    Write-Error "[✖] Could not find SID for user $TargetUsername"
    exit 1
}

# Get Profile Path
$profilePath = "C:\Users\$TargetUsername"

if (-not (Test-Path $profilePath)) {
    Write-Error "[✖] Profile path $profilePath not found."
    exit 1
}

Write-Host "[+] Found SID: $sid"
Write-Host "[+] Found Profile: $profilePath"

# === START PURGE LOGIC ===

# Clear mapped network drives (registry)
$mappedDrivesKey = "Registry::HKEY_USERS\$sid\Software\Microsoft\Windows\CurrentVersion\Explorer\Map Network Drive MRU"
$networkDrivesKey = "Registry::HKEY_USERS\$sid\Network"

if (Test-Path $mappedDrivesKey) {
    Remove-Item $mappedDrivesKey -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "[✓] Cleared mapped drives MRU"
}

if (Test-Path $networkDrivesKey) {
    Remove-Item $networkDrivesKey -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "[✓] Cleared network drive mappings"
}

# Clear Windows credentials
$credPath = Join-Path $profilePath "AppData\Roaming\Microsoft\Credentials"
if (Test-Path $credPath) {
    Remove-Item "$credPath\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "[✓] Cleared Windows Credentials"
}

# Clear WebCache
$webCache = Join-Path $profilePath "AppData\Local\Microsoft\Windows\WebCache"
if (Test-Path $webCache) {
    Stop-Process -Name "dllhost" -Force -ErrorAction SilentlyContinue
    Remove-Item "$webCache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "[✓] Cleared WebCache"
}

Write-Host "[✔] Cleanup complete for user $TargetUsername"
