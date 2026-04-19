import { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";

import Cards from "./Cards.js";
import Timer from "./Timer.js";
import BackLink from "./BackLink.js";
import cards from "../../utils/cards.js";

import formatTime from "../../utils/formatTime.js";

function FinPairGame({
  playerName,
  gameResultSetter,
  popupOpener,
  isGameFinished,
  isGameFinishedSetter,
  restartHandlerSetter,
}) {
  const history = useHistory();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 830);
  const [isBigScreen, setIsBigScreen] = useState(window.innerWidth >= 830);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 830) {
        setIsSmallScreen(true);
        setIsBigScreen(false);
      } else {
        setIsBigScreen(true);
        setIsSmallScreen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Timer
  const startTimeRef = useRef(0);
  const intervalRef = useRef(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Cards
  const [gameCards, setGameCards] = useState([]);
  const [gameKey, setGameKey] = useState(0); // to reset Cards component

  // Start / Restart game
  const startGame = () => {
    // Reset game logical state
    isGameFinishedSetter(false);
    gameResultSetter(null);
    // 1. Shuffle cards
    const shuffled = [...cards, ...cards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({
        ...card,
        id: Math.random(),
        matched: false,
        status: "normal",
      }));
    setGameCards(shuffled);
    setGameKey((prev) => prev + 1);

    // 2. Restart timer
    clearInterval(intervalRef.current);
    startTimeRef.current = performance.now();
    setElapsedTime(0);

    intervalRef.current = setInterval(() => {
      setElapsedTime(performance.now() - startTimeRef.current);
    }, 1000);
  };

  useEffect(() => {
    restartHandlerSetter(() => startGame);
  }, [restartHandlerSetter]);

  // Start game on component mount
  useEffect(() => {
    startGame();
    return () => clearInterval(intervalRef.current);
  }, []);

  // Finish game
  const finishGame = () => {
    if (isGameFinished) return;
    isGameFinishedSetter(true);
    clearInterval(intervalRef.current);
    const totalTime = performance.now() - startTimeRef.current;
    const formattedTime = formatTime(totalTime);
    gameResultSetter(formattedTime);
    popupOpener();
  };

  useEffect(() => {
    if (!playerName) {
      history.push("/alina/games/find-pair");
    }
  }, [playerName]);

  if (isBigScreen) {
    return (
      <div className="find-pair-game">
        <Cards
          key={gameKey}
          cards={gameCards}
          setGameCards={setGameCards}
          onGameFinish={finishGame}
        />

        <div className="find-pair-game__info-container">
          <div className="find-pair-game__info">
            <div className="find-pair-game__player-icon" />
            <p className="find-pair-game__player-name">{playerName}</p>
            <Timer elapsedTime={elapsedTime} />
          </div>

          <button className="find-pair-game__restart-btn" onClick={startGame}>
            Restart
          </button>
        </div>

        <BackLink href="/" linkText="Back to menu" />
      </div>
    );
  }
  if (isSmallScreen) {
    return (
      <div className="find-pair-game">
        <div className="find-pair-game__info-container">
          <div className="find-pair-game__info">
            <div className="find-pair-game__player-icon" />
            <p className="find-pair-game__player-name">{playerName}</p>
          </div>
          <div className="find-pair-game__info">
            <Timer elapsedTime={elapsedTime} />
            <button className="find-pair-game__restart-btn" onClick={startGame}>
              Restart
            </button>
          </div>
        </div>

        <Cards
          key={gameKey}
          cards={gameCards}
          setGameCards={setGameCards}
          onGameFinish={finishGame}
        />

        <BackLink href="/" linkText="Back to menu" />
      </div>
    );
  }
}

export default FinPairGame;
