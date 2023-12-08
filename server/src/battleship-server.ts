import type http from 'http';
import type https from 'https';
import WebSocket from 'ws';

// Message types
export type ClientMessage = { coordinates: [number, number] };
export type ServerMessage = { result: 'hit' | 'miss' };

/**
 * Battleship server
 */
export default class BattleshipServer {
  private boatPosition: [number, number];
  private connections: WebSocket[] = [];

  constructor(webServer: http.Server | https.Server, path: string) {
    const server = new WebSocket.Server({ server: webServer, path: path + '/battleship' });

    // Randomly place the boat
    this.boatPosition = [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)];

    server.on('connection', (connection, _request) => {
      this.connections.push(connection);

      connection.on('message', (message) => {
        const data: ClientMessage = JSON.parse(message.toString());
        const result = this.processGuess(data.coordinates);
        
        // Notify the guessing client
        connection.send(JSON.stringify({ result } as ServerMessage));

        // Notify all other clients if hit
        if (result === 'hit') {
          this.connections.forEach(conn => {
            if (conn !== connection) {
              conn.send(JSON.stringify({ result } as ServerMessage));
            }
          });
        }
      });

      connection.on('close', () => {
        this.connections = this.connections.filter(conn => conn !== connection);
      });
    });
  }

  private processGuess(coordinates: [number, number]): 'hit' | 'miss' {
    return this.boatPosition[0] === coordinates[0] && this.boatPosition[1] === coordinates[1] ? 'hit' : 'miss';
  }
}
