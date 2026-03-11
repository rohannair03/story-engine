import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App.jsx';

// ── jsdom doesn't implement scrollIntoView ───────────────────────────────────
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// ── Mock API and music utilities ─────────────────────────────────────────────
jest.mock('../../src/utils/api.js', () => ({
  generateStoryResponse: jest.fn(),
}));

jest.mock('../../src/utils/musicAnalyzer.js', () => ({
  analyzeSceneMood: jest.fn(),
}));

jest.mock('../../src/utils/musicMatcher.js', () => ({
  matchMusic: jest.fn(),
}));

import { generateStoryResponse } from '../../src/utils/api.js';
import { analyzeSceneMood } from '../../src/utils/musicAnalyzer.js';
import { matchMusic } from '../../src/utils/musicMatcher.js';

// jsdom doesn't implement scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

const MOCK_RESPONSE = `You grip the cold stone and haul yourself upward. The rain finds every gap in your collar.

1. Climb towards the nearest cave | 2. Search for better handholds | 3. Look down at Mirileth`;

const MOCK_ANALYSIS = { moods: ['tense', 'grim'], pacing: 'slow' };
const MOCK_MATCHES = [
  {
    title: 'Adagio for Strings',
    composer: 'Barber',
    notes: 'Sorrowful and tense',
    youtubeSearch: 'Barber Adagio',
    spotifySearch: 'Adagio for Strings',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  generateStoryResponse.mockResolvedValue(MOCK_RESPONSE);
  analyzeSceneMood.mockResolvedValue(MOCK_ANALYSIS);
  matchMusic.mockReturnValue(MOCK_MATCHES);
});

describe('App', () => {

  describe('initial render', () => {
    test('renders the VALDRIS title', () => {
      render(<App />);
      expect(screen.getByText('VALDRIS')).toBeInTheDocument();
    });

    test('renders the opening card before any choice is made', () => {
      render(<App />);
      expect(screen.getByTestId('opening-card')).toBeInTheDocument();
    });

    test('renders exactly 3 initial choice buttons', () => {
      render(<App />);
      expect(screen.getByTestId('choice-button-0')).toBeInTheDocument();
      expect(screen.getByTestId('choice-button-1')).toBeInTheDocument();
      expect(screen.getByTestId('choice-button-2')).toBeInTheDocument();
    });

    test('renders the Score Companion sidebar', () => {
      render(<App />);
      expect(screen.getByTestId('music-sidebar')).toBeInTheDocument();
    });

    test('does not show loading indicator on initial render', () => {
      render(<App />);
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    test('does not show error message on initial render', () => {
      render(<App />);
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });
  });

  describe('making a choice', () => {
    test('calls generateStoryResponse when a choice is clicked', async () => {
      render(<App />);
      fireEvent.click(screen.getByTestId('choice-button-0'));
      await waitFor(() => expect(generateStoryResponse).toHaveBeenCalledTimes(1));
    });

    test('shows loading indicator while waiting for response', async () => {
      generateStoryResponse.mockImplementation(() => new Promise(() => {})); // never resolves
      render(<App />);
      fireEvent.click(screen.getByTestId('choice-button-0'));
      await waitFor(() =>
        expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
      );
    });

    test('removes choice buttons while loading', async () => {
      generateStoryResponse.mockImplementation(() => new Promise(() => {}));
      render(<App />);
      fireEvent.click(screen.getByTestId('choice-button-0'));
      await waitFor(() =>
        expect(screen.queryByTestId('choice-button-0')).not.toBeInTheDocument()
      );
    });

    test('renders story text after response is received', async () => {
      render(<App />);
      fireEvent.click(screen.getByTestId('choice-button-0'));
      await waitFor(() =>
        expect(screen.getByText(/You grip the cold stone/)).toBeInTheDocument()
      );
    });

    test('renders new choices after response', async () => {
      render(<App />);
      fireEvent.click(screen.getByTestId('choice-button-0'));
      await waitFor(() =>
        expect(screen.getByText('Climb towards the nearest cave')).toBeInTheDocument()
      );
    });

    test('hides the opening card after first choice', async () => {
      render(<App />);
      fireEvent.click(screen.getByTestId('choice-button-0'));
      await waitFor(() =>
        expect(screen.queryByTestId('opening-card')).not.toBeInTheDocument()
      );
    });

    test('calls analyzeSceneMood after story response', async () => {
      render(<App />);
      fireEvent.click(screen.getByTestId('choice-button-0'));
      await waitFor(() => expect(analyzeSceneMood).toHaveBeenCalledTimes(1));
    });

    test('passes story text (without choices line) to analyzeSceneMood', async () => {
      render(<App />);
      fireEvent.click(screen.getByTestId('choice-button-0'));
      await waitFor(() => {
        const calledWith = analyzeSceneMood.mock.calls[0][0];
        expect(calledWith).toContain('You grip the cold stone');
        expect(calledWith).not.toContain('1.');
      });
    });
  });

  describe('error handling', () => {
    test('shows error message when API call fails', async () => {
      generateStoryResponse.mockRejectedValue(new Error('Network error'));
      render(<App />);
      fireEvent.click(screen.getByTestId('choice-button-0'));
      await waitFor(() =>
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      );
    });

    test('restores initial choices after API failure', async () => {
      generateStoryResponse.mockRejectedValue(new Error('Network error'));
      render(<App />);
      fireEvent.click(screen.getByTestId('choice-button-0'));
      await waitFor(() =>
        expect(screen.getByTestId('choice-button-0')).toBeInTheDocument()
      );
    });
  });

  describe('music sidebar integration', () => {
    test('shows loading state in sidebar while analyzing', async () => {
      analyzeSceneMood.mockImplementation(() => new Promise(() => {}));
      render(<App />);
      fireEvent.click(screen.getByTestId('choice-button-0'));
      await waitFor(() =>
        expect(screen.getByTestId('music-loading')).toBeInTheDocument()
      );
    });

    test('shows piece title in sidebar after analysis completes', async () => {
      render(<App />);
      fireEvent.click(screen.getByTestId('choice-button-0'));
      await waitFor(() =>
        expect(screen.getByTestId('piece-title')).toBeInTheDocument()
      );
    });
  });

});
