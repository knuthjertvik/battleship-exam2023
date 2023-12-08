import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Battleship } from './battleship-component';
import { Alert } from './widgets';

let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <>
      <Alert />
      <Battleship />
    </>
  );
