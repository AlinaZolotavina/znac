import { useLocation } from "react-router-dom";

function GamesButtons({ onRestart }) {
  const location = useLocation();
  if (location.pathname === "/alina/games/tic-tac-toe/new-game") {
    return (
      <div className="games__links">
        <a className="games__link" href="/alina">
          Back to Blog
        </a>
        <a className="games__link" href="/alina/games/tic-tac-toe">
          Back to Game menu
        </a>
        <button className="games__link" href="/alina" onClick={onRestart}>
          Restart
        </button>
      </div>
    );
  }
  return (
    <div className="games__links">
      <a className="games__link" href="/alina/games">
        Back to Games
      </a>
      <a className="games__link" href="/alina">
        Back to Blog
      </a>
      {location.pathname === "/alina/games/tic-tac-toe/new-game" && (
        <button className="games__link" href="/alina" onClick={onRestart}>
          Restart
        </button>
      )}
    </div>
  );
}

export default GamesButtons;
