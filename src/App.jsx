import Game from "./Game";
import Footer from "./footer";
import "./style.css";
import games from "./games";

export default function App() {
  return (
    <div>
      <header className="header">
        <h1>H1gherL0wer</h1>
        <p className="ondertitel">Pick the game with the higher all-time player count!</p>
      </header>

      <Game games={games} />
      <Footer />
    </div>
  );
}