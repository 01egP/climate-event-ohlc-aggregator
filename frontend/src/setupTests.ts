// Setup for React Testing Library + Plotly
import '@testing-library/jest-dom';

if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = () => '';
}
