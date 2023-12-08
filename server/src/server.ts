import app from './app';
import express from 'express';
import path from 'path';
import http from 'http';
import BattleshipServer from './battleship-server';

// Serve client files
app.use(express.static(path.join(__dirname, '/../../client/public')));

const webServer = http.createServer(app);
const battleshipServer = new BattleshipServer(webServer, '/api/v1');

const port = 3000;
webServer.listen(port, () => {
  console.info(`Server running on port ${port}`);
});
