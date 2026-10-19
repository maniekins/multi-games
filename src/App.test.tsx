import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { test, expect } from 'vitest';
import App from './App';

test('wyświetla nagłówek aplikacji', () => {
  const { getByRole } = render(<App />);

  expect(getByRole('heading', { name: 'Witaj w aplikacji' })).toBeInTheDocument();
});

test('wyświetla przycisk', () => {
  const { getByRole } = render(<App />);

  expect(getByRole('button', { name: 'Kliknij mnie' })).toBeInTheDocument();
});
