import formatTime from "../../utils/formatTime.js";

function Timer({ elapsedTime }) {
  return (
    <div className="timer">
      <div className="timer__icon" />
      <p className="timer__time">{formatTime(elapsedTime)}</p>
    </div>
  );
}

export default Timer;
