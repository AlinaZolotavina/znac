import { useState } from "react";

function GamesPage() {
  const [ticTacToeActiveClassname, setTicTacToeActiveClassname] = useState("");
  const [findPairActiveClassname, setFindPairActiveClassname] = useState("");

  function handleMouseOver(game) {
    if (game === "tic-tac-toe") {
      setTicTacToeActiveClassname("games__tic-tac-toe_state_hover-on");
      setFindPairActiveClassname("games__tic-tac-toe_state_hover-off");
    } else if (game === "find-pair") {
      setFindPairActiveClassname("games__find-pair_state_hover-on");
      setTicTacToeActiveClassname("games__find-pair_state_hover-off");
    }
  }

  function handleMouseOut() {
    setTicTacToeActiveClassname("");
    setFindPairActiveClassname("");
  }

  return (
    <div className="games">
      <h2 className="games__title">Choose game to play ;)</h2>
      <div className="games__container">
        <a
          className={`games__tic-tac-toe ${ticTacToeActiveClassname}`}
          aria-label="tic-tac-toe game"
          href="https://alinazolotavina.github.io/tic-tac-toe/"
          target="_blanc"
          rel="noreferrer"
          onMouseOver={() => handleMouseOver("tic-tac-toe")}
          onMouseOut={handleMouseOut}
        />
        <a
          className={`games__find-pair ${findPairActiveClassname}`}
          aria-label="find pair game"
          href="https://alinazolotavina.github.io/find-pair/"
          target="_blank"
          rel="noreferrer"
          onMouseOver={() => handleMouseOver("find-pair")}
          onMouseOut={handleMouseOut}
        >
          <span className="games__sr-only">Find pair game</span>
        </a>
      </div>
      <a className="games__link games__back-to-blog-btn" href="/alina">
        Back to Blog
      </a>
    </div>
  );
}

export default GamesPage;
