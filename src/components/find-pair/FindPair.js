import { Outlet } from "react-router-dom";
import Popup from "./Popup";
import { useState, useEffect } from "react";

function FindPair() {
  const [playerName, setPlayerName] = useState("");
  const [gameResult, setGameResult] = useState(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [restartHandler, setRestartHandler] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  function openPopup() {
    setIsPopupOpen(true);
  }

  function closePopup() {
    setIsPopupOpen(false);
    console.log("Popup closed");
  }

  function restartGame() {
    restartHandler?.();
    setIsPopupOpen(false);
  }

  const handleEscPress = (e) => {
    const { keyCode } = e;
    if (keyCode === 27 && isPopupOpen) {
      closePopup();
    }
  };

  useEffect(
    (e) => {
      window.addEventListener("keydown", handleEscPress);
      return () => {
        window.removeEventListener("keydown", handleEscPress);
      };
    },
    [isPopupOpen],
  );

  return (
    <>
      <Outlet
        context={{
          playerName,
          setPlayerName,
          gameResult,
          setGameResult,
          openPopup,
          isGameFinished,
          setIsGameFinished,
          setRestartHandler,
        }}
      />
      <Popup
        gameResult={gameResult}
        isOpen={isPopupOpen}
        onClose={closePopup}
        onPlayAgain={restartGame}
      />
    </>
  );
}

export default FindPair;
