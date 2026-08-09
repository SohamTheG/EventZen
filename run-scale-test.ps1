Write-Host "=========================================="
Write-Host "RUN A: BASELINE TEST (1 INSTANCE)"
Write-Host "=========================================="
docker-compose up --scale venue-vendor-api=1 -d
Start-Sleep -Seconds 3

npx artillery run test-redistest2.yml --record --key a9_3sovz394pndc9at1d3vwleb57oqxrbll

Write-Host "=========================================="
Write-Host "SCALING UP TO 3 INSTANCES..."
Write-Host "=========================================="
docker-compose up --scale venue-vendor-api=3 -d

Start-Sleep -Seconds 10

# ---------------------------------------------------------
# NEW: CHECK IF 3 CONTAINERS SUCCESSFULLY SPAWNED
# ---------------------------------------------------------
$containerCount = (docker ps -q --filter "name=venue-vendor-api").Count
if ($containerCount -ge 3) {
    Write-Host ""
    Write-Host "✅ SUCCESS: 3 Node.js Venue Containers are now actively running and load balancing!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ ERROR: Only $containerCount containers are running! Did you remove the container_name?" -ForegroundColor Red
    Write-Host ""
    exit
}

Write-Host "=========================================="
Write-Host "RUN B: THE PROOF (3 INSTANCES)"
Write-Host "=========================================="
npx artillery run test-redistest2.yml --record --key a9_3sovz394pndc9at1d3vwleb57oqxrbll

Write-Host "=========================================="
Write-Host "SCALING BACK DOWN TO 1 INSTANCE"
Write-Host "=========================================="
docker-compose up --scale venue-vendor-api=1 -d

Write-Host "TEST COMPLETE!"
