import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MusicBrief from '../../src/components/MusicBrief.jsx';

const mockBrief = {
  moods: ['tense', 'melancholic'],
  pacing: 'slow',
  matches: [
    {
      title: 'Clair de Lune',
      composer: 'Debussy',
      notes: 'Gentle and introspective',
      youtubeSearch: 'Debussy Clair de Lune',
      spotifySearch: 'Clair de Lune Debussy',
    },
    {
      title: 'Adagio for Strings',
      composer: 'Barber',
      notes: 'Deeply sorrowful',
      youtubeSearch: 'Barber Adagio for Strings',
      spotifySearch: 'Adagio for Strings Barber',
    },
  ],
};

describe('MusicBrief', () => {

  describe('loading state', () => {
    test('renders loading message when loading is true', () => {
      render(<MusicBrief loading={true} brief={null} error={null} />);
      expect(screen.getByTestId('music-loading')).toBeInTheDocument();
      expect(screen.getByText('Scoring the scene...')).toBeInTheDocument();
    });

    test('renders sidebar container when loading', () => {
      render(<MusicBrief loading={true} brief={null} error={null} />);
      expect(screen.getByTestId('music-sidebar')).toBeInTheDocument();
    });

    test('does not render piece titles when loading', () => {
      render(<MusicBrief loading={true} brief={mockBrief} error={null} />);
      expect(screen.queryByTestId('piece-title')).not.toBeInTheDocument();
    });
  });

  describe('empty / error state', () => {
    test('renders fallback when brief is null', () => {
      render(<MusicBrief loading={false} brief={null} error={null} />);
      expect(screen.getByText('No score available')).toBeInTheDocument();
    });

    test('renders fallback when error is provided', () => {
      render(<MusicBrief loading={false} brief={null} error="API failed" />);
      expect(screen.getByText('No score available')).toBeInTheDocument();
    });

    test('renders sidebar container in error state', () => {
      render(<MusicBrief loading={false} brief={null} error="something broke" />);
      expect(screen.getByTestId('music-sidebar')).toBeInTheDocument();
    });
  });

  describe('populated state', () => {
    test('renders mood tags', () => {
      render(<MusicBrief loading={false} brief={mockBrief} error={null} />);
      const moodTags = screen.getAllByTestId('mood-tag');
      expect(moodTags).toHaveLength(2);
      expect(moodTags[0]).toHaveTextContent('tense');
      expect(moodTags[1]).toHaveTextContent('melancholic');
    });

    test('renders pacing tag', () => {
      render(<MusicBrief loading={false} brief={mockBrief} error={null} />);
      expect(screen.getByTestId('pacing-tag')).toHaveTextContent('slow');
    });

    test('renders all matched piece titles', () => {
      render(<MusicBrief loading={false} brief={mockBrief} error={null} />);
      const titles = screen.getAllByTestId('piece-title');
      expect(titles).toHaveLength(2);
      expect(titles[0]).toHaveTextContent('Clair de Lune');
      expect(titles[1]).toHaveTextContent('Adagio for Strings');
    });

    test('renders composer names', () => {
      render(<MusicBrief loading={false} brief={mockBrief} error={null} />);
      expect(screen.getByText('Debussy')).toBeInTheDocument();
      expect(screen.getByText('Barber')).toBeInTheDocument();
    });

    test('renders YouTube links for each piece', () => {
      render(<MusicBrief loading={false} brief={mockBrief} error={null} />);
      const youtubeLinks = screen.getAllByText('YouTube');
      expect(youtubeLinks).toHaveLength(2);
      expect(youtubeLinks[0].href).toContain('youtube.com');
    });

    test('renders Spotify links for each piece', () => {
      render(<MusicBrief loading={false} brief={mockBrief} error={null} />);
      const spotifyLinks = screen.getAllByText('Spotify');
      expect(spotifyLinks).toHaveLength(2);
      expect(spotifyLinks[0].href).toContain('spotify.com');
    });

    test('renders SCORE COMPANION label', () => {
      render(<MusicBrief loading={false} brief={mockBrief} error={null} />);
      expect(screen.getByText('SCORE COMPANION')).toBeInTheDocument();
    });

    test('renders correctly with a single match', () => {
      const singleMatch = { ...mockBrief, matches: [mockBrief.matches[0]] };
      render(<MusicBrief loading={false} brief={singleMatch} error={null} />);
      expect(screen.getAllByTestId('piece-title')).toHaveLength(1);
    });

    test('renders correctly with no moods', () => {
      const noMoods = { ...mockBrief, moods: [] };
      render(<MusicBrief loading={false} brief={noMoods} error={null} />);
      expect(screen.queryByTestId('mood-tag')).not.toBeInTheDocument();
      expect(screen.getByTestId('pacing-tag')).toBeInTheDocument();
    });
  });

});
