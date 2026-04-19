import BackLink from "./BackLink";

function Leaderboard() {
  return (
    <div className="leaderboard">
      <div className="leaderboard__icon" />
      <h2 className="leaderboard__title">LEADERBOARD</h2>
      <div className="leaderboard__list-wrapper">
        <ul className="leaderboard__list">
          <li className="leaderboard__element">
            <div className="leaderboard__element-icon leaderboard__element-icon_place_first">
              1
            </div>
            <p className="leaderboard__element-name">Name 1</p>
            <p className="leaderboard__element-time">1m 25s</p>
          </li>
          <li className="leaderboard__element">
            <div className="leaderboard__element-icon leaderboard__element-icon_place_second">
              2
            </div>
            <p className="leaderboard__element-name">Name 2</p>
            <p className="leaderboard__element-time">1m 48s</p>
          </li>
          <li className="leaderboard__element">
            <div className="leaderboard__element-icon leaderboard__element-icon_place_third">
              3
            </div>
            <p className="leaderboard__element-name">Name 3</p>
            <p className="leaderboard__element-time">2m 13s</p>
          </li>
        </ul>
        <div className="leaderboard__overlay">Feature in progress</div>
      </div>
      <BackLink href="/" linkText="Back to menu" />
    </div>
  );
}

export default Leaderboard;
