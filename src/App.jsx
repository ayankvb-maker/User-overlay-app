import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(true);
  const [notification, setNotification] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState("");
  const [aiSymbol, setAiSymbol] = useState("");

  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() === "h") {
        setVisible((v) => !v);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const checkWinner = (b) => {
    for (const [a, b1, c] of wins) {
      if (
        b[a] &&
        b[a] === b[b1] &&
        b[a] === b[c]
      ) {
        return b[a];
      }
    }

    if (!b.includes("")) {
      return "draw";
    }

    return null;
  };

  const minimax = (boardState, isMaximizing) => {
    const result = checkWinner(boardState);

    if (result === aiSymbol) return 10;
    if (result === playerSymbol) return -10;
    if (result === "draw") return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;

      for (let i = 0; i < 9; i++) {
        if (boardState[i] === "") {
          boardState[i] = aiSymbol;

          const score = minimax(boardState, false);

          boardState[i] = "";

          bestScore = Math.max(bestScore, score);
        }
      }

      return bestScore;
    } else {
      let bestScore = Infinity;

      for (let i = 0; i < 9; i++) {
        if (boardState[i] === "") {
          boardState[i] = playerSymbol;

          const score = minimax(boardState, true);

          boardState[i] = "";

          bestScore = Math.min(bestScore, score);
        }
      }

      return bestScore;
    }
  };

  const findBestMove = (boardState) => {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = aiSymbol;

        const score = minimax(boardState, false);

        boardState[i] = "";

        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    return move;
  };

  const aiMove = (currentBoard) => {
    let move;

    // Opening move: take center if available
    if (currentBoard.every((cell) => cell === "") && currentBoard[4] === "") {
      move = 4;
    } else {
      move = findBestMove([...currentBoard]);
    }

    if (move === -1 || move === undefined) return;

    currentBoard[move] = aiSymbol;

    const winner = checkWinner(currentBoard);

    if (winner === aiSymbol) {
      setMessage("AI Wins!");
    } else if (winner === "draw") {
      setMessage("Draw!");
    }

    setBoard([...currentBoard]);

    setNotification(true);
  };

  const startGameAsX = () => {
    setPlayerSymbol("X");
    setAiSymbol("O");
    setGameStarted(true);
  };

  const startGameAsO = () => {
    const newBoard = Array(9).fill("");

    setPlayerSymbol("O");
    setAiSymbol("X");
    setGameStarted(true);

    // AI starts in center
    newBoard[4] = "X";

    setBoard(newBoard);
  };

  const handleClick = (index) => {
    if (!gameStarted) return;

    if (board[index] || message) return;

    const newBoard = [...board];

    newBoard[index] = playerSymbol;

    const winner = checkWinner(newBoard);

    if (winner === playerSymbol) {
      setBoard(newBoard);
      setMessage("You Win!");
      return;
    }

    if (winner === "draw") {
      setBoard(newBoard);
      setMessage("Draw!");
      return;
    }

    setBoard(newBoard);

    // Existing invisibility rule
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

    setGameStarted(false);
    setPlayerSymbol("");
    setAiSymbol("");
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

          {!gameStarted ? (
            <>
              <h2>Choose Your Side</h2>

              <button
                className="reset"
                onClick={startGameAsX}
              >
                Play First (X)
              </button>

              <br />
              <br />

              <button
                className="reset"
                onClick={startGameAsO}
              >
                Play Second (O)
              </button>
            </>
          ) : (
            <>
              <div className="board">
                {board.map((cell, index) => (
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
            </>
          )}
        </div>
      )}
    </>
  );
}

export default App;
