import { render, screen } from '@testing-library/react';
import App from './App';

test('renders headers', () => {
  render(<App />);
  const header = screen.getByText(/Stock Market/i);
  const transactions = screen.getByText(/Transaction/i);
  const trade = screen.getByText(/Trade/i);
  expect(header).toBeInTheDocument();
  expect(transactions).toBeInTheDocument();
  expect(trade).toBeInTheDocument();
});

test('getDiferenceInMinutes', () => {
  render(<App />);
  const getDiferenceInMinutes = jest.fn();
  const a= new Date();
  const b= new Date();
  expect(getDiferenceInMinutes).toBeCalledWith(b,a);
});
