import { FormEvent, useState } from 'react';
import { useViewActions } from '../../services/View';
import './ArithmeticGame.css';

type LevelSettings = {
  maxNumber: number;
  terms: number;
};

type Question = {
  expression: string;
  answer: number;
};

const levelSettings: LevelSettings[] = [
  { maxNumber: 20, terms: 2 },
  { maxNumber: 50, terms: 2 },
  { maxNumber: 100, terms: 2 },
  { maxNumber: 100, terms: 3 },
  { maxNumber: 200, terms: 3 },
  { maxNumber: 500, terms: 3 },
  { maxNumber: 1000, terms: 3 },
  { maxNumber: 1000, terms: 4 },
  { maxNumber: 5000, terms: 4 },
  { maxNumber: 10000, terms: 4 },
];

const randomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const createQuestion = (level: number): Question => {
  const { maxNumber, terms } = levelSettings[level - 1];
  const values = [randomInteger(1, maxNumber)];
  const operators: string[] = [];
  let answer = values[0];

  for (let index = 1; index < terms; index += 1) {
    const canSubtract = answer > 1;
    const operator = canSubtract && Math.random() < 0.5 ? '−' : '+';
    const value = randomInteger(1, operator === '−' ? answer : maxNumber);
    operators.push(operator);
    values.push(value);
    answer = operator === '−' ? answer - value : answer + value;
  }

  return {
    expression: values.map((value, index) => (index === 0 ? `${value}` : `${operators[index - 1]} ${value}`)).join(' '),
    answer,
  };
};

const ArithmeticGame = () => {
  const { setViewMenu } = useViewActions();
  const [hasStarted, setHasStarted] = useState(false);
  const [questionsPerLevelInput, setQuestionsPerLevelInput] = useState('10');
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(() => createQuestion(1));
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const parsedQuestionsPerLevel = Number(questionsPerLevelInput);
  const questionsPerLevel = Number.isFinite(parsedQuestionsPerLevel)
    ? Math.min(50, Math.max(1, Math.floor(parsedQuestionsPerLevel)))
    : 1;
  const level = Math.min(levelSettings.length, Math.floor(score / questionsPerLevel) + 1);
  const pointsInLevel = score % questionsPerLevel;
  const progress = level === levelSettings.length ? 100 : (pointsInLevel / questionsPerLevel) * 100;

  const startGame = () => {
    setQuestionsPerLevelInput(String(questionsPerLevel));
    setScore(0);
    setQuestion(createQuestion(1));
    setAnswer('');
    setFeedback('');
    setHasStarted(true);
  };

  const checkAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (answer.trim() === '') return;

    if (Number(answer) === question.answer) {
      const nextScore = score + 1;
      const nextLevel = Math.min(levelSettings.length, Math.floor(nextScore / questionsPerLevel) + 1);
      setScore(nextScore);
      setQuestion(createQuestion(nextLevel));
      setAnswer('');
      setFeedback('Brawo! Zdobywasz punkt.');
      return;
    }

    setFeedback('Spróbuj jeszcze raz!');
  };

  return (
    <main className="ArithmeticGame">
      <div className="ArithmeticGame__topbar">
        <button
          className="ArithmeticGame__back"
          type="button"
          onClick={hasStarted ? () => setHasStarted(false) : setViewMenu}
        >
          {hasStarted ? '← Ustawienia' : '← Wróć do menu'}
        </button>
        <span className="ArithmeticGame__game-name">Dodawaj, odejmuj</span>
      </div>

      {!hasStarted ? (
        <section className="ArithmeticGame__settings" aria-labelledby="arithmetic-settings-title">
          <p className="ArithmeticGame__settings-eyebrow">USTAWIENIA GRY</p>
          <h1 id="arithmetic-settings-title">Przygotuj się do liczenia</h1>
          <label htmlFor="questions-per-level">Liczba pytań na poziom</label>
          <div className="ArithmeticGame__settings-control">
            <input
              id="questions-per-level"
              type="number"
              min="1"
              max="50"
              step="1"
              value={questionsPerLevelInput}
              onChange={(event) => setQuestionsPerLevelInput(event.target.value)}
            />
            <span>poprawnych odpowiedzi</span>
          </div>
          <p className="ArithmeticGame__settings-hint">
            Wybierz od 1 do 50. Po tylu dobrych odpowiedziach przejdziesz na kolejny poziom.
          </p>
          <button className="ArithmeticGame__start" type="button" onClick={startGame}>
            Rozpocznij grę
          </button>
        </section>
      ) : (
        <section className="ArithmeticGame__board" aria-labelledby="arithmetic-title">
          <div className="ArithmeticGame__stats">
            <div>
              <span className="ArithmeticGame__stat-label">POZIOM</span>
              <strong>
                {level}
                <span> / 10</span>
              </strong>
            </div>
            <div className="ArithmeticGame__score">
              <span className="ArithmeticGame__stat-label">PUNKTY</span>
              <strong>{score}</strong>
            </div>
          </div>

          <div className="ArithmeticGame__progress" aria-label={`Postęp poziomu: ${progress}%`}>
            <div style={{ width: `${progress}%` }} />
          </div>
          <p className="ArithmeticGame__progress-label">
            {level === levelSettings.length
              ? 'Maksymalny poziom!'
              : `Jeszcze ${questionsPerLevel - pointsInLevel} pytań do kolejnego poziomu`}
          </p>

          <div className="ArithmeticGame__challenge">
            <p id="arithmetic-title">Ile to jest?</p>
            <div className="ArithmeticGame__expression" aria-live="polite">
              {question.expression} = ?
            </div>
          </div>

          <form className="ArithmeticGame__form" onSubmit={checkAnswer}>
            <label htmlFor="arithmetic-answer">Twoja odpowiedź</label>
            <div className="ArithmeticGame__answer-row">
              <input
                id="arithmetic-answer"
                type="number"
                inputMode="numeric"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                autoFocus
              />
              <button type="submit">Sprawdź</button>
            </div>
            <p className="ArithmeticGame__feedback" aria-live="polite">
              {feedback || 'Każda dobra odpowiedź to 1 punkt.'}
            </p>
          </form>
        </section>
      )}
    </main>
  );
};

export default ArithmeticGame;
