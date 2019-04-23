  ## Deploying Files
  
  ```
  $ npm run build:local
  $ coral-bridge daemon
  $ ipfs add -r dist
  ...
  added QmP68Ny4DU5A6wrQLBFygVRpXzppgzEq2aq4aGe6kUpi5M dist
  
  $ ipfs name publish QmP68Ny4DU5A6wrQLBFygVRpXzppgzEq2aq4aGe6kUpi5M
  ```
  
  Navigate to: 
  
  http://localhost:3001
