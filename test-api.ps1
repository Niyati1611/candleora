$body = '{"email":"test@example.com"}'
$response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/forgot-password' -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing
Write-Host $response.Content
