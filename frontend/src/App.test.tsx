import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
// Mocking the react-plotly.js component
jest.mock('react-plotly.js', () => () => <div data-testid="mock-plot" />);

describe('App', () => {
  test('renders header and city selector', () => {
    render(<App />);

    // Check header
    expect(screen.getByText(/OHLC Weather Aggregator/i)).toBeInTheDocument();

    // Check if city selector is present
    const citySelect = screen.getByLabelText(/Select city/i);
    expect(citySelect).toBeInTheDocument();
    expect(citySelect).toHaveValue('Berlin');
  });

  test('switches to mock data', () => {
    render(<App />);

    const mockButton = screen.getByText(/Use Mock OHLC/i);
    fireEvent.click(mockButton);

    // Check if chart (mocked) is displayed
    expect(screen.getByTestId('mock-plot')).toBeInTheDocument();
  });
});
