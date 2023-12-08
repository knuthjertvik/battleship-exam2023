import * as React from 'react';
import { Component } from 'react-simplified';
import battleshipService, { Subscription } from './battleship-service';
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
        <Card title="Make Your Guess">
          <Row>
            {/* Input fields for coordinates */}
            <Column>
              <input
                type="number"
                value={this.guess[0]}
                onChange={(e) => this.setGuess(0, parseInt(e.target.value))}
                placeholder="Row (0-4)"
              />
            </Column>
            <Column>
              <input
                type="number"
                value={this.guess[1]}
                onChange={(e) => this.setGuess(1, parseInt(e.target.value))}
                placeholder="Column (0-4)"
              />
            </Column>
            <Column>
              <button onClick={this.sendGuess}>Guess</button>
            </Column>
          </Row>
          {this.gameResult && <div>Result: {this.gameResult}</div>}
        </Card>
      </Card>
    );
  }

  setGuess(index: number, value: number) {
    this.guess[index] = value;
  }

  sendGuess = () => {
    if (this.connected) {
      battleshipService.send({ coordinates: this.guess });
    } else {
      Alert.danger('Not connected to server');
    }
  }

  // Lifecycle methods and event handlers (onopen, onmessage, etc.) similar to Chat component
}

// Make sure to include the beforeUnmount method to unsubscribe from the service
