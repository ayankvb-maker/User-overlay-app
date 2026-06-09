import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(true);
  const [notification, setNotification] = useState(false);

  const wins = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() === "h") {
        setVisible(v => !v);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const checkWinner = (b) => {
    for (const [a,b1,c] of wins) {
      if (
        b[a] &&
        b[a] === b[b1] &&
        b[a] === b[c]
      ) {
        return b[a];
      }
    }

    return null;
  };

  const aiMove = (currentBoard) => {
    const empty = currentBoard
      .map((v,i) => v === "" ? i : null)
      .filter(v => v !== null);

    if (empty.length === 0) return;

    const move =
      empty[Math.floor(Math.random() * empty.length)];

    currentBoard[move] = "O";

    const winner = checkWinner(currentBoard);

    if (winner) {
      setMessage("AI Wins!");
    }

    setBoard([...currentBoard]);

    setNotification(true);
  };

  const handleClick = (index) => {
    if (board[index] || message) return;

    const newBoard = [...board];

    newBoard[index] = "X";

    const winner = checkWinner(newBoard);

    if (winner) {
      setBoard(newBoard);
      setMessage("You Win!");
      return;
    }

    setBoard(newBoard);

    setVisible(false);

    setTimeout(() => {
      aiMove([...newBoard]);
    }, 500);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setMessage("");
    setVisible(true);
    setNotification(false);
  };

  return (
    <>
      {!visible && (
        <div className="dot">
          {notification ? "🔴" : "⚪"}
        </div>
      )}

      {visible && (
        <div className="container">
          <h1>Tic Tac Toe</h1>

          <div className="board">
            {board.map((cell,index) => (
              <button
                key={index}
                className="cell"
                onClick={() => handleClick(index)}
              >
                {cell}
              </button>
            ))}
          </div>

          <h2>{message}</h2>

          <button
            className="reset"
            onClick={resetGame}
          >
            Reset Game
          </button>

          <p>
            Press <b>H</b> to hide/show
          </p>
        </div>
      )}
    </>
  );
}

export default App;
