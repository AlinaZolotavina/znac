function Card({ card, onHandleChoice, flipped, disabled }) {
  function handleClick() {
    if (!disabled) {
      onHandleChoice(card);
    }
  }
  return (
    <div className="card-container">
      <div
        className={`card-wrapper ${flipped ? "card_state_flipped" : ""} ${`card_status_${card.status}`}`}
      >
        <div className={`card card_side_back`} onClick={handleClick} />
        <div className={`card card_side_front card_image_${card.name}`} />
      </div>
    </div>
  );
}

export default Card;
