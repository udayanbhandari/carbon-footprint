import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { useAppStore } from '../store/appStore';

// Mock smartEngine so we don't call Gemini during tests
vi.mock('../utils/smartEngine', async () => {
  const actual = await vi.importActual('../utils/smartEngine');
  return {
    ...actual as any,
    getSmartResponse: vi.fn().mockResolvedValue('Mocked AI response about carbon'),
    getTypingDelay: vi.fn().mockReturnValue(0), // Instant for tests
  };
});

describe('CarbonSense Application', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useAppStore.getState();
    store.clearFootprint();
    store.clearMessages();
    store.resetQuiz();
    store.setLanguage('en');
  });

  it('renders chat view by default and accepts input', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Verify layout and default redirect to chat
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    
    // Check if chat elements are there
    expect(screen.getByPlaceholderText(/Ask about your carbon footprint/i)).toBeInTheDocument();
    
    // Send a message
    const input = screen.getByPlaceholderText(/Ask about your carbon footprint/i);
    const form = input.closest('form');
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'How do I reduce my footprint?' } });
      fireEvent.submit(form!);
    });

    // Check that store updated
    const state = useAppStore.getState();
    expect(state.messages.length).toBeGreaterThan(0);
    expect(state.messages[0].content).toBe('How do I reduce my footprint?');
    
    // Check if mock AI response is eventually rendered
    expect(await screen.findByText('Mocked AI response about carbon')).toBeInTheDocument();
  });

  it('calculates footprint correctly when adding entries', async () => {
    const store = useAppStore.getState();
    
    act(() => {
      store.upsertFootprintEntry({
        activityId: 'car_petrol',
        category: 'transport',
        quantity: 10000,
        kgCO2e: 10000 * 0.192,
        recordedAt: new Date().toISOString()
      });
    });

    const updatedState = useAppStore.getState();
    expect(updatedState.footprintEntries.length).toBe(1);
    expect(updatedState.footprintSummary?.totalKgCO2e).toBe(1920);
    expect(updatedState.footprintSummary?.totalTonnesCO2e).toBe(1.92);
  });

  it('navigates to quiz and handles scoring', async () => {
    render(
      <MemoryRouter initialEntries={['/quiz']}>
        <App />
      </MemoryRouter>
    );
    
    // Expect quiz to be rendered
    expect(screen.getByText(/Climate Knowledge Quiz/i)).toBeInTheDocument();

    const state = useAppStore.getState();
    expect(state.quizScore).toBe(0);
  });
});
