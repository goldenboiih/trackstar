# Notes

https://firebase.google.com/docs/cloud-messaging/migrate-v1?hl=de

https://stackoverflow.com/questions/75501854/expo-push-notification-not-working-in-production


# Installation

1. Install dependencies with `npm i` inside the root folder
2. Replace the ip address in `src/config.js` with your local ip4 address
3. Run the docker-compose file with `docker-compose up -d` inside the ./db folder. This will start a postgres database on port 5432 with a sample database as well as adminer on port 8080. 
If the sample database does not initialize for whatever reason, you can use the init.sql file and import it via adminer.
4. Run the server with `node backend/index.js` inside the root folder or use the serve script inside package.json.
The server is available on port 3000.
5. Run expo with `expo start` inside the root folder or use the start script inside package.json
6. Scan the QR code with your phone and open the app with the expo app
