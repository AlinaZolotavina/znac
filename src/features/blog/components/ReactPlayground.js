const playgroundItems = [
  {
    title: "Find Pair Game",
    description:
      "A memory game where I practice React state, reusable components and testing.",
    tags: ["React", "TypeScript", "Testing"],
    iconClassName: "react-playground-card__icon_type_find-pair",
    link: "https://alinazolotavina.github.io/find-pair/",
  },
  {
    title: "Tic-Tac-Toe",
    description:
      "Classic game logic with single-player and multiplayer modes in React.",
    tags: ["React", "TypeScript", "UI logic"],
    iconClassName: "react-playground-card__icon_type_tic-tac-toe",
    link: "https://alinazolotavina.github.io/tic-tac-toe/",
  },
];

function ReactPlayground() {
  return (
    <section className="react-playground" aria-labelledby="playground-title">
      <div className="react-playground__header">
        <h2 className="section-title react-playground__title" id="playground-title">
          React Playground
        </h2>
        <p className="react-playground__subtitle">
          Small interactive projects where I practice React, TypeScript, state
          management, UI logic and testing.
        </p>
      </div>
      <ul className="react-playground__container">
        {playgroundItems.map((item) => (
          <li className="react-playground-card" key={item.title}>
            <div
              className={`react-playground-card__icon ${item.iconClassName}`}
              aria-hidden="true"
            />
            <div className="react-playground-card__content">
              <h3 className="react-playground-card__title">{item.title}</h3>
              <ul className="react-playground-card__tags">
                {item.tags.map((tag) => (
                  <li className="react-playground-card__tag" key={tag}>
                    #{tag}
                  </li>
                ))}
              </ul>
              <p className="react-playground-card__description">
                {item.description}
              </p>
              <a
                className="react-playground-card__link"
                href={item.link}
                target="_blank"
                rel="noreferrer"
              >
                Play →
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ReactPlayground;
