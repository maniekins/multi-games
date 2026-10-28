import React, { useMemo } from 'react';
import { useViewActions } from '../../services/View';
import './Menu.css';

const Menu = () => {
  const { setViewRougelike, setViewArithmetic, setViewSnake, setViewMemory } = useViewActions();
  return useMemo(
    () => (
      <main className="Menu">
        <section className="Menu__panel" aria-labelledby="menu-title">
          <p className="Menu__eyebrow">MAŁE GRY, WIELKA ZABAWA</p>
          <h1 id="menu-title">Wybierz grę</h1>
          <div className="Menu__choices">
            <button className="Menu__choice Menu__choice--math" onClick={setViewArithmetic}>
              <span aria-hidden="true">＋ −</span>
              Dodawaj, odejmuj
            </button>
            <button className="Menu__choice Menu__choice--snake" onClick={setViewSnake}>
              Snake
            </button>
            <button className="Menu__choice Menu__choice--memory" onClick={setViewMemory}>
              Znajdź pary
            </button>
            <button className="Menu__choice Menu__choice--roguelike" onClick={setViewRougelike}>
              Enter The Rougelike
            </button>
          </div>
        </section>
      </main>
    ),
    [setViewArithmetic, setViewMemory, setViewRougelike, setViewSnake],
  );
};

export default React.memo(Menu);
