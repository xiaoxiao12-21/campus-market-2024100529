# Start mock server in separate window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\1\campus-market-seed\campus-market-seed'; npx json-server --watch db.json --port 3001"

# Wait for mock to start
Start-Sleep -Seconds 4

# Start dev server with host
npx vite --host
