import { useEffect, useMemo, useRef, useState } from 'react';
import CSS from 'csstype';
import { KeyboardProvider, useKeyboardContext } from '../../services/Keyboard';
import { useViewActions } from '../../services/View';
import Tile from '../Game/Models/Components/Tile';
import { TYPES } from '../Game/Models/Tile';
import './SnakeGame.css';

type Position = { x: number; y: number };
type Direction = Position;
type GameStatus = 'playing' | 'crashed' | 'won';
type GameState = {
  snake: Position[];
  food: Position;
  score: number;
  status: GameStatus;
};

const initialDirection: Direction = { x: 1, y: 0 };
const tileStyle: CSS.Properties = {
  width: '100%',
  height: '100%',
  margin: 0,
  boxShadow: 'none',
  opacity: 1,
};

const clampSetting = (value: string, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.floor(Number(value) || min)));

const createFood = (columns: number, rows: number, snake: Position[]): Position | null => {
  const freeCells: Position[] = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      if (!snake.some((segment) => segment.x === x && segment.y === y)) freeCells.push({ x, y });
    }
  }
  return freeCells.length ? freeCells[Math.floor(Math.random() * freeCells.length)] : null;
};

const SnakeGame = () => (
  <KeyboardProvider>
    <SnakeGameSession />
  </KeyboardProvider>
);

const SnakeGameSession = () => {
  const { setViewMenu } = useViewActions();
  const { keyPressed } = useKeyboardContext();
  const [columnsInput, setColumnsInput] = useState('20');
  const [rowsInput, setRowsInput] = useState('14');
  const [levelsInput, setLevelsInput] = useState('5');
  const [pointsPerLevelInput, setPointsPerLevelInput] = useState('5');
  const [game, setGame] = useState<GameState | null>(null);
  const directionRef = useRef<Direction>(initialDirection);
  const queuedDirectionRef = useRef<Direction>(initialDirection);

  const columns = clampSetting(columnsInput, 8, 30);
  const rows = clampSetting(rowsInput, 8, 24);
  const totalLevels = clampSetting(levelsInput, 1, 20);
  const pointsPerLevel = clampSetting(pointsPerLevelInput, 1, 20);
  const score = game?.score ?? 0;
  const level = Math.min(totalLevels, Math.floor(score / pointsPerLevel) + 1);
  const pointsThisLevel = game?.status === 'won' ? pointsPerLevel : score % pointsPerLevel;
  const progress = (pointsThisLevel / pointsPerLevel) * 100;
  const speed = 220 - (level - 1) * 16;
  const isPlaying = game?.status === 'playing';

  const startGame = () => {
    setColumnsInput(String(columns));
    setRowsInput(String(rows));
    setLevelsInput(String(totalLevels));
    setPointsPerLevelInput(String(pointsPerLevel));
    const head = { x: Math.floor(columns / 2), y: Math.floor(rows / 2) };
    const snake = [head, { x: head.x - 1, y: head.y }, { x: head.x - 2, y: head.y }];
    directionRef.current = initialDirection;
    queuedDirectionRef.current = initialDirection;
    setGame({ snake, food: createFood(columns, rows, snake)!, score: 0, status: 'playing' });
  };

  useEffect(() => {
    if (!isPlaying) return;

    let nextDirection: Direction | null = null;
    if (keyPressed.up()) nextDirection = { x: 0, y: -1 };
    else if (keyPressed.down()) nextDirection = { x: 0, y: 1 };
    else if (keyPressed.left()) nextDirection = { x: -1, y: 0 };
    else if (keyPressed.right()) nextDirection = { x: 1, y: 0 };

    if (nextDirection && (nextDirection.x !== -directionRef.current.x || nextDirection.y !== -directionRef.current.y)) {
      queuedDirectionRef.current = nextDirection;
    }
  }, [isPlaying, keyPressed]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setGame((current) => {
        if (!current || current.status !== 'playing') return current;

        const direction = queuedDirectionRef.current;
        directionRef.current = direction;
        const head = current.snake[0];
        const nextHead = { x: head.x + direction.x, y: head.y + direction.y };
        const eating = nextHead.x === current.food.x && nextHead.y === current.food.y;
        const hitsWall = nextHead.x < 0 || nextHead.x >= columns || nextHead.y < 0 || nextHead.y >= rows;
        const bodyToCheck = eating ? current.snake : current.snake.slice(0, -1);
        const hitsSnake = bodyToCheck.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

        if (hitsWall || hitsSnake) return { ...current, status: 'crashed' };

        const snake = eating ? [nextHead, ...current.snake] : [nextHead, ...current.snake.slice(0, -1)];
        const score = current.score + Number(eating);
        const food = eating ? createFood(columns, rows, snake) : current.food;
        const status: GameStatus = score >= totalLevels * pointsPerLevel || !food ? 'won' : 'playing';

        return { snake, food: food ?? current.food, score, status };
      });
    }, speed);

    return () => window.clearInterval(timer);
  }, [columns, isPlaying, pointsPerLevel, rows, speed, totalLevels]);

  const cells = useMemo(() => {
    const snake = game?.snake ?? [];
    const food = game?.food;

    return Array.from({ length: columns * rows }, (_, index) => {
      const position = { x: index % columns, y: Math.floor(index / columns) };
      const snakeIndex = snake.findIndex((segment) => segment.x === position.x && segment.y === position.y);
      const isFood = food?.x === position.x && food.y === position.y;
      const isHead = snakeIndex === 0;
      const type = isFood ? TYPES.WATER : snakeIndex >= 0 ? TYPES.ROOM : TYPES.GRASS;

      return (
        <Tile
          key={`${position.x}-${position.y}`}
          modelSize={18}
          type={isHead ? `${type} SnakeGame__head` : type}
          visible
          visited
          style={tileStyle}
          aria-hidden="true"
        >
          {isFood && <span className="SnakeGame__food-dot" />}
        </Tile>
      );
    });
  }, [columns, game?.food, game?.snake, rows]);

  return (
    <main className="SnakeGame">
      <header className="SnakeGame__topbar">
        <button className="SnakeGame__back" type="button" onClick={setViewMenu}>
          ← Wróć do menu
        </button>
        <h1>Snake</h1>
        {game && (
          <button className="SnakeGame__back" type="button" onClick={() => setGame(null)}>
            Ustawienia
          </button>
        )}
      </header>

      {!game ? (
        <section className="SnakeGame__panel" aria-labelledby="snake-settings-title">
          <p className="SnakeGame__eyebrow">USTAWIENIA GRY</p>
          <h2 id="snake-settings-title">Przygotuj planszę</h2>
          <div className="SnakeGame__settings-grid">
            <label htmlFor="snake-columns">
              Szerokość planszy
              <input
                id="snake-columns"
                type="number"
                min="8"
                max="30"
                value={columnsInput}
                onChange={(event) => setColumnsInput(event.target.value)}
              />
            </label>
            <label htmlFor="snake-rows">
              Wysokość planszy
              <input
                id="snake-rows"
                type="number"
                min="8"
                max="24"
                value={rowsInput}
                onChange={(event) => setRowsInput(event.target.value)}
              />
            </label>
            <label htmlFor="snake-levels">
              Liczba poziomów
              <input
                id="snake-levels"
                type="number"
                min="1"
                max="20"
                value={levelsInput}
                onChange={(event) => setLevelsInput(event.target.value)}
              />
            </label>
            <label htmlFor="snake-points-per-level">
              Punkty na poziom
              <input
                id="snake-points-per-level"
                type="number"
                min="1"
                max="20"
                value={pointsPerLevelInput}
                onChange={(event) => setPointsPerLevelInput(event.target.value)}
              />
            </label>
          </div>
          <p className="SnakeGame__hint">Zbieraj owoce. Po każdym poziomie wąż porusza się szybciej.</p>
          <button className="SnakeGame__start" type="button" onClick={startGame}>
            Rozpocznij grę
          </button>
        </section>
      ) : (
        <section className="SnakeGame__play" aria-label="Gra Snake">
          <div className="SnakeGame__stats">
            <div>
              <span>POZIOM</span>
              <strong>
                {level} / {totalLevels}
              </strong>
            </div>
            <div>
              <span>PUNKTY</span>
              <strong>{score}</strong>
            </div>
            <div>
              <span>SZYBKOŚĆ</span>
              <strong>{speed} ms</strong>
            </div>
          </div>
          <div className="SnakeGame__progress" aria-label={`Postęp poziomu: ${progress}%`}>
            <div style={{ width: `${progress}%` }} />
          </div>
          <p className="SnakeGame__controls">Sterowanie: strzałki</p>
          <div
            className="SnakeGame__board"
            role="img"
            aria-label={`Plansza Snake, ${columns} na ${rows}`}
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              aspectRatio: `${columns} / ${rows}`,
            }}
          >
            {cells}
          </div>
          {game.status !== 'playing' && (
            <div className="SnakeGame__result" role="status">
              <strong>{game.status === 'won' ? 'Świetnie! Ukończono grę.' : 'Koniec gry!'}</strong>
              <button className="SnakeGame__start" type="button" onClick={startGame}>
                Zagraj ponownie
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default SnakeGame;
