import { useEffect, useState } from "react";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'%3E%3Crect fill='%231a1a2e' width='400' height='220'/%3E%3Ctext fill='%23e94560' font-family='Arial' font-size='20' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3E%F0%9F%8E%AE Game Image%3C/text%3E%3C/svg%3E";

function formatPlayers(millions) {
  if (millions >= 1000) return (millions / 1000).toFixed(1) + " billion";
  return millions + " million";
}

export default function Game({ games }) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(
    parseInt(localStorage.getItem("bestStreak")) || 0
  );

  const [leftGame, setLeftGame] = useState(null);
  const [rightGame, setRightGame] = useState(null);
  const [usedGames, setUsedGames] = useState([]);
  const [winningGame, setWinningGame] = useState(null);

  const [result, setResult] = useState(null);

  function getRandomGame(exclude = []) {
    let available = games.filter(
      (g) => !exclude.includes(g.name) && !usedGames.includes(g.name)
    );

    if (available.length === 0) {
      setUsedGames([]);
      available = games.filter((g) => !exclude.includes(g.name));
    }

    return available[Math.floor(Math.random() * available.length)];
  }

  function setupRound(keepWinner = false) {
    if (keepWinner && winningGame) {
      setLeftGame(winningGame);
      setRightGame(getRandomGame([winningGame.name]));
    } else {
      const left = getRandomGame();
      const right = getRandomGame([left.name]);

      setLeftGame(left);
      setRightGame(right);
    }

    setResult(null);
  }

  useEffect(() => {
    setupRound();
  }, []);

  function makeChoice(side) {
    if (!leftGame || !rightGame) return;

    const chosen = side === "left" ? leftGame : rightGame;
    const other = side === "left" ? rightGame : leftGame;

    const isCorrect = chosen.players >= other.players;

    setResult({ chosen, other, isCorrect });

    if (isCorrect) {
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);

      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        localStorage.setItem("bestStreak", newStreak);
      }

      setWinningGame(other);

      setTimeout(() => {
        setupRound(true);
      }, 1200);
    } else {
      setCurrentStreak(0);
      setWinningGame(null);
    }
  }

  if (!leftGame || !rightGame) return <div>Loading...</div>;

  return (
    <>
      <aside className="score-panel">
        

        <div className="score-item">
          <label>Current Streak</label>
          <span>{currentStreak}</span>
        </div>

        <div className="score-item best">
          <label> Best Streak</label>
          <span>{bestStreak}</span>
        </div>
      </aside>

      {/* RESULT OP PAGINA (geen overlay meer) */}
      {result && (
        <div className={`result-box ${result.isCorrect ? "win" : "lose"}`}>
          <h2>{result.isCorrect ? "✅ Correct!" : "❌ Wrong!"}</h2>

          <p>
            <strong>{result.chosen.name}</strong> vs{" "}
            <strong>{result.other.name}</strong>
            <br />
            {result.chosen.name}: {formatPlayers(result.chosen.players)} players
            <br />
            {result.other.name}: {formatPlayers(result.other.players)} players
          </p>
        </div>
      )}

      <main className="game-container">
        <div className="game-card left-side" onClick={() => makeChoice("left")}>
          <img
            className="game-image"
            src={leftGame.image}
            alt="Game"
            onError={(e) => (e.target.src = PLACEHOLDER)}
          />
          <div className="game-title">{leftGame.name}</div>
        </div>

        <div className="vs-container">
          <div className="vs-badge">VS</div>
        </div>

        <div className="game-card right-side" onClick={() => makeChoice("right")}>
          <img
            className="game-image"
            src={rightGame.image}
            alt="Game"
            onError={(e) => (e.target.src = PLACEHOLDER)}
          />
          <div className="game-title">{rightGame.name}</div>
        </div>
      </main>
    </>
  );
}