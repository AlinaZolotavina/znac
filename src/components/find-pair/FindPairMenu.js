import MenuOption from "./MenuOption";

function FindPairMenu() {
  return (
    <div className="find-pair">
      <div className="find-pair__logo" />
      <div className="find-pair__menu">
        <MenuOption
          buttonText="New game"
          page="/alina/games/find-pair/get-player-name"
        />
        <MenuOption
          buttonText="Leaderboard"
          page="/alina/games/find-pair/leaderboard"
        />
      </div>
    </div>
  );
}

export default FindPairMenu;
