import { render } from '@testing-library/react';
import { test, expect } from 'vitest';
import App from './App';

test('otwiera grę matematyczną z menu i pozwala wrócić', () => {
  const { container } = render(<App />);

  container.querySelector<HTMLButtonElement>('.Menu__choice--math')?.click();
  expect(container.textContent).toContain('Liczba pytań na poziom');

  container.querySelector<HTMLButtonElement>('.ArithmeticGame__start')?.click();
  expect(container.textContent).toContain('Ile to jest?');
  expect(container.textContent).toContain('PUNKTY');

  container.querySelector<HTMLButtonElement>('.ArithmeticGame__back')?.click();
  expect(container.textContent).toContain('Liczba pytań na poziom');
  container.querySelector<HTMLButtonElement>('.ArithmeticGame__back')?.click();
  expect(container.textContent).toContain('Wybierz grę');
});
