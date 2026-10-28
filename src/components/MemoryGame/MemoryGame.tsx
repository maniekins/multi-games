import { useCallback, useEffect, useMemo, useState } from 'react';
import { useViewActions } from '../../services/View';
import './MemoryGame.css';

type MemoryCard = {
  id: number;
  pairId: number;
  symbol: string;
};

type MemoryState = {
  cards: MemoryCard[];
  revealedCardIds: number[];
  matchedPairIds: number[];
  moves: number;
  playerScores: number[];
  playerNames: string[];
  currentPlayer: number;
};

const symbols = [
  '🐶',
  '🐱',
  '🐰',
  '🐼',
  '🦊',
  '🐸',
  '🐵',
  '🐧',
  '🍎',
  '🍐',
  '🍊',
  '🍋',
  '🍉',
  '🍇',
  '🍓',
  '🍒',
  '🚗',
  '🚲',
  '🚀',
  '🚁',
  '🚂',
  '🛴',
  '🚒',
  '🚕',
  '⭐',
  '🌙',
  '☀️',
  '🌈',
  '⚽',
  '🎈',
  '🎁',
  '🎨',
  '🐢',
  '🐠',
  '🦄',
  '🐻',
  '🐨',
  '🐯',
  '🐮',
  '🐷',
  '🥝',
  '🥭',
  '🍍',
  '🥑',
  '🌽',
  '🥕',
  '🍌',
  '🍪',
];

const shuffle = <T,>(values: T[]): T[] => {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

const createDeck = (cellCount: number): MemoryCard[] => {
  const chosenSymbols = shuffle(symbols).slice(0, cellCount / 2);
  const pairs = chosenSymbols.flatMap((symbol, pairId) => [
    { pairId, symbol },
    { pairId, symbol },
  ]);

  return shuffle(pairs).map((card, id) => ({ ...card, id }));
};

const clampBoardDimension = (value: string) => Math.min(12, Math.max(2, Math.floor(Number(value) || 2)));
const clampPlayerCount = (value: string) => Math.min(4, Math.max(1, Math.floor(Number(value) || 1)));

const MemoryGame = () => {
  const { setViewMenu } = useViewActions();
  const [columnsInput, setColumnsInput] = useState('4');
  const [rowsInput, setRowsInput] = useState('4');
  const [playerCountInput, setPlayerCountInput] = useState('1');
  const [playerNamesInput, setPlayerNamesInput] = useState(['Gracz 1', 'Gracz 2', 'Gracz 3', 'Gracz 4']);
  const [viewportSize, setViewportSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const [game, setGame] = useState<MemoryState | null>(null);
  const columns = clampBoardDimension(columnsInput);
  const rows = clampBoardDimension(rowsInput);
  const playerCount = clampPlayerCount(playerCountInput);
  const cellCount = columns * rows;
  const pairCount = Math.floor(cellCount / 2);
  const boardIsValid = cellCount % 2 === 0;
  const gameIsWon = Boolean(game && game.matchedPairIds.length === game.cards.length / 2);
  const boardMaxWidth = Math.max(120, Math.min(1040, viewportSize.width - 48));
  const boardMaxHeight = Math.max(100, Math.min(620, viewportSize.height - (playerCount > 1 ? 230 : 180)));
  const boardHeight = Math.min(boardMaxHeight, (boardMaxWidth * rows) / columns);
  const boardWidth = (boardHeight * columns) / rows;
  const cardGap = Math.min(8, Math.max(1, (boardWidth / columns) * 0.08));
  const cardWidth = (boardWidth - cardGap * (columns - 1)) / columns;
  const cardFontSize = Math.min(100, Math.max(12, cardWidth * 0.5));

  useEffect(() => {
    const updateViewportSize = () => setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', updateViewportSize);
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

  const startGame = () => {
    if (!boardIsValid) return;
    setColumnsInput(String(columns));
    setRowsInput(String(rows));
    setPlayerCountInput(String(playerCount));
    setGame({
      cards: createDeck(cellCount),
      revealedCardIds: [],
      matchedPairIds: [],
      moves: 0,
      playerScores: new Array(playerCount).fill(0),
      playerNames: playerNamesInput.slice(0, playerCount).map((name, index) => name.trim() || `Gracz ${index + 1}`),
      currentPlayer: 0,
    });
  };

  useEffect(() => {
    if (!game || game.revealedCardIds.length !== 2) return;

    const [firstId, secondId] = game.revealedCardIds;
    const firstCard = game.cards.find((card) => card.id === firstId);
    const secondCard = game.cards.find((card) => card.id === secondId);
    if (firstCard?.pairId === secondCard?.pairId) return;

    const timeout = window.setTimeout(() => {
      setGame((current) =>
        current
          ? {
              ...current,
              revealedCardIds: [],
              currentPlayer: (current.currentPlayer + 1) % current.playerScores.length,
            }
          : current,
      );
    }, 850);

    return () => window.clearTimeout(timeout);
  }, [game]);

  const selectCard = useCallback((cardId: number) => {
    setGame((current) => {
      if (
        !current ||
        current.matchedPairIds.length === current.cards.length / 2 ||
        current.revealedCardIds.length === 2
      ) {
        return current;
      }

      const card = current.cards.find((item) => item.id === cardId);
      if (!card || current.revealedCardIds.includes(cardId) || current.matchedPairIds.includes(card.pairId)) {
        return current;
      }

      if (current.revealedCardIds.length === 0) {
        return { ...current, revealedCardIds: [cardId] };
      }

      const firstCard = current.cards.find((item) => item.id === current.revealedCardIds[0]);
      const moves = current.moves + 1;

      if (firstCard?.pairId === card.pairId) {
        const playerScores = [...current.playerScores];
        playerScores[current.currentPlayer] += 1;

        return {
          ...current,
          revealedCardIds: [],
          matchedPairIds: [...current.matchedPairIds, card.pairId],
          playerScores,
          moves,
        };
      }

      return { ...current, revealedCardIds: [...current.revealedCardIds, cardId], moves };
    });
  }, []);

  const topbar = (
    <header className="Memory__topbar">
      <button className="Memory__button" type="button" onClick={setViewMenu}>
        ← Wróć do menu
      </button>
      <h1>Znajdź pary</h1>
      {game && (
        <button className="Memory__button" type="button" onClick={() => setGame(null)}>
          Ustawienia
        </button>
      )}
    </header>
  );

  const highestScore = game ? Math.max(...game.playerScores) : 0;
  const winners = game
    ? game.playerScores.flatMap((score, index) => (score === highestScore ? [game.playerNames[index]] : []))
    : [];

  const cards = useMemo(() => {
    if (!game) return null;

    return game.cards.map((card) => {
      const matched = game.matchedPairIds.includes(card.pairId);
      const revealed = matched || game.revealedCardIds.includes(card.id);

      return (
        <button
          key={card.id}
          className={`Memory__card${revealed ? ' Memory__card--revealed' : ''}${matched ? ' Memory__card--matched' : ''}`}
          type="button"
          aria-label={revealed ? `Karta: ${card.symbol}` : 'Zakryta karta'}
          aria-pressed={revealed}
          disabled={matched || game.revealedCardIds.length === 2}
          style={{ fontSize: `${cardFontSize}px` }}
          onClick={() => selectCard(card.id)}
        >
          <span aria-hidden="true">{revealed ? card.symbol : '?'}</span>
        </button>
      );
    });
  }, [cardFontSize, game, selectCard]);

  return (
    <main className="Memory">
      {topbar}
      {!game ? (
        <section className="Memory__panel" aria-labelledby="memory-settings-title">
          <p className="Memory__eyebrow">PAMIĘĆ I SPOSTRZEGAWCZOŚĆ</p>
          <h2 id="memory-settings-title">Ustaw planszę</h2>
          <div className="Memory__settings">
            <label htmlFor="memory-columns">
              Szerokość planszy
              <input
                id="memory-columns"
                type="number"
                min="2"
                max="12"
                step="1"
                value={columnsInput}
                onChange={(event) => setColumnsInput(event.target.value)}
                onBlur={() => setColumnsInput(String(columns))}
              />
            </label>
            <label htmlFor="memory-rows">
              Wysokość planszy
              <input
                id="memory-rows"
                type="number"
                min="2"
                max="8"
                step="1"
                value={rowsInput}
                onChange={(event) => setRowsInput(event.target.value)}
                onBlur={() => setRowsInput(String(rows))}
              />
            </label>
            <label htmlFor="memory-players">
              Liczba graczy
              <input
                id="memory-players"
                type="number"
                min="1"
                max="4"
                step="1"
                value={playerCountInput}
                onChange={(event) => setPlayerCountInput(event.target.value)}
                onBlur={() => setPlayerCountInput(String(playerCount))}
              />
            </label>
          </div>
          <section className="Memory__player-names" aria-labelledby="memory-player-names-title">
            <h3 id="memory-player-names-title">Imiona graczy</h3>
            <div className="Memory__player-name-list">
              {Array.from({ length: playerCount }, (_, index) => (
                <label key={`player-name-${index}`} htmlFor={`memory-player-${index}`}>
                  Gracz {index + 1}
                  <input
                    id={`memory-player-${index}`}
                    type="text"
                    maxLength={20}
                    value={playerNamesInput[index]}
                    onChange={(event) =>
                      setPlayerNamesInput((current) =>
                        current.map((name, nameIndex) => (nameIndex === index ? event.target.value : name)),
                      )
                    }
                  />
                </label>
              ))}
            </div>
          </section>
          <p className={`Memory__hint${boardIsValid ? '' : ' Memory__hint--error'}`} aria-live="polite">
            {boardIsValid
              ? `Plansza ${columns} × ${rows}: ${pairCount} par.`
              : 'Wybierz rozmiar z parzystą liczbą pól, aby każda karta miała parę.'}
          </p>
          <button className="Memory__start" type="button" disabled={!boardIsValid} onClick={startGame}>
            Rozpocznij grę
          </button>
        </section>
      ) : (
        <section className="Memory__play" aria-label="Gra Znajdź pary">
          <div className="Memory__stats">
            <div>
              <span>RUCHY</span>
              <strong>{game.moves}</strong>
            </div>
            <div>
              <span>ZNALEZIONE PARY</span>
              <strong>
                {game.matchedPairIds.length} / {game.cards.length / 2}
              </strong>
            </div>
            <div className="Memory__turn" aria-live="polite">
              <span>TURA</span>
              <strong>{game.playerNames[game.currentPlayer]}</strong>
            </div>
          </div>
          {game.playerScores.length > 1 && (
            <div className="Memory__scores" aria-label="Wyniki graczy">
              {game.playerScores.map((score, index) => (
                <div
                  key={index}
                  className={index === game.currentPlayer ? 'Memory__player Memory__player--active' : 'Memory__player'}
                >
                  <span>{game.playerNames[index]}</span>
                  <strong>{score}</strong>
                </div>
              ))}
            </div>
          )}
          <div
            className={`Memory__board-stage${gameIsWon ? ' Memory__board-stage--finished' : ''}`}
            style={{ width: `${boardWidth}px`, height: `${boardHeight}px` }}
          >
            <div
              className="Memory__board"
              role="group"
              aria-label={`Plansza Memory, ${columns} na ${rows}`}
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                gap: `${cardGap}px`,
              }}
            >
              {cards}
            </div>
            {gameIsWon && (
              <div className="Memory__result" role="status">
                <strong>
                  {game.playerScores.length === 1
                    ? 'Świetna pamięć! Wszystkie pary znalezione.'
                    : winners.length === 1
                      ? `${winners[0]} wygrywa!`
                      : `Remis: ${winners.join(' i ')}!`}
                </strong>
                <span>Liczba ruchów: {game.moves}</span>
                <button className="Memory__start" type="button" onClick={startGame}>
                  Zagraj ponownie
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default MemoryGame;
