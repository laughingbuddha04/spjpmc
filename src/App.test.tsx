import { render, screen } from '@testing-library/react';
import App from './App';
describe ('appsuit', () => {
  test('renders headers', () => {
    render(<App />);
    const header = screen.getByText(/Stock Market/i);
    const transactions = screen.getByText(/Transactions/i);
    expect(header).toBeInTheDocument();
    expect(transactions).toBeInTheDocument();
  });
});
