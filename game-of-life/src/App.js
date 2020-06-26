import React, { useState, useRef, useCallback } from 'react';
import produce from 'immer';

import './App.css';

const numRows = 50;
const numColumns = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1] 
];

const emptyGrid = () => {
  const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numColumns), () => 0));
    }
    return rows;
}

const App = () => { 
  const [grid, setGrid] = useState(() => {
   return emptyGrid()
  });

const [running, setRunning] = useState(false);

const runningRef = useRef(running);
runningRef.current = running

const runGame = useCallback(() => {
  if (!runningRef.current) {
    return;
  }
  setGrid(g => {
    return produce(g, gridCopy => {
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numColumns) {
              neighbors += g[newI][newJ]
            }
          })
          if (neighbors < 2 || neighbors > 3) {
            gridCopy[i][j] = 0;
          } else if (g[i][j] === 0 && neighbors === 3) {
            gridCopy[i][j] = 1;
          }
        }
      }
    })
  });
 setTimeout(runGame, 1000);
}, []);

return ( 
  <>
  <button
    onClick={() => {
      setRunning(!running);
      if (!running) {
      runningRef.current = true;
      runGame();
    }
  }}>
    {running ? 'Stop' : 'Start'}
  </button>
  
  <button
    onClick={() => {
      const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numColumns), () => (Math.random() > 0.77 ? 1 : 0)));
    }
    setGrid(rows);
  }}>
    Random!
  </button>

  <button onClick={() => {
    setGrid(emptyGrid());
  }}>
    Clear
  </button>

  <div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${numColumns}, 20px)`
    }}>
      {grid.map((rows, i) =>
        rows.map((columns, j) => (
          <div
            key={`${i}-${j}`}
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][j] = grid[i][j] ? 0 : 1;
              })
              setGrid(newGrid);
            }}
            style={{
              width: 20,
              height: 20,
              backgroundColor: grid[i][j] ? 'black' : undefined,
              border: 'solid 1px black'
            }}
            />
        ))
      )}
  </div>
</>
)};

export default App;
