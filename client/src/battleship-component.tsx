import * as React from 'react';
import { Component } from 'react-simplified';
import battleshipService, { Subscription, ServerMessage } from './battleship-service';
import { Alert, Card, Row, Column } from './widgets';

export class Battleship extends Component {
  subscription: Subscription | null = null;
  connected = false;
  gameResult: string = '';
  guess: [number, number] = [0, 0];

  componentDidMount() {
    this.subscription = battleshipService.subscribe();

    this.subscription.onopen = () => {
      this.connected = true;
      this.forceUpdate(); // To re-render the component
    }; 

    this.subscription.onmessage = (message: ServerMessage) => {
      if ('result' in message) {
        this.gameResult = message.result;
        this.forceUpdate(); // Update the component with the new game result
      }
    };
    

    this.subscription.onerror = (error) => {
      this.connected = false;
      Alert.danger('Connection error: ' + error.message);
      this.forceUpdate(); // To re-render the component
    };
  }

  beforeUnmount() {
    if (this.subscription) battleshipService.unsubscribe(this.subscription);
  }
  
  render() {
    return (
      <Card title={'Battleship (' + (this.connected ? 'Connected' : 'Not connected') + ')'}>
        <Card title="Make Your Guess 0-4">
          <Row>
            {/* Input fields for coordinates */}
            <Column>
              <input
                type="number"
                min="0"
                max="4"
                value={this.guess[0]}
                onChange={(e) => this.setGuess(0, parseInt(e.target.value))}
                placeholder="Row (0-4)"
              />
            </Column>
            <Column>
              <input
                type="number"
                min="0"
                max="4"
                value={this.guess[1]}
                onChange={(e) => this.setGuess(1, parseInt(e.target.value))}
                placeholder="Column (0-4)"
              />
            </Column>
            <Column>
              <button onClick={this.sendGuess}>Guess</button>
            </Column>
          </Row>
          </Card>
          <Card title="Game Result">
  <div>
    {this.gameResult === 'hit' ? 'Hit! You found the boat!' :
     this.gameResult === 'miss' ? 'Miss. Try again.' :
     this.gameResult === 'otherhit' ? 'Someone else found the boat' :
     'No value'}
  </div>
</Card>

        </Card>
    );
  }

  setGuess(index: number, value: number) {
    if (value >= 0 && value <= 4) {
      this.guess[index] = value;
      this.forceUpdate(); // Oppdater komponenten
    }
  }

  sendGuess = () => {
    if (this.connected) {
      battleshipService.send({ coordinates: this.guess });
    } else {
      Alert.danger('Not connected to server');
    }
  }

}


