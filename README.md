## Getting Started

clone the app and go inside of root dir run
npm install

then
go inside rootDir/JsonServer (inside JsonServer dir) run

npm install

then open this dir in terminal or command prompt and run
```
npm run tunnel //to start ngrok tunnel server
```
then run
```
npm run db //to start database server
```
then copy ngrok tunnel url and past in App.js
```
url = "https://ae06fec9c1a7.ngrok.io" + 'YOUR_DATABASE_OBJECT_KEY'
//LIKE -> https://ae06fec9c1a7.ngrok.io/posts
```
