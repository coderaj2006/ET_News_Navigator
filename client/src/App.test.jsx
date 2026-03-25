import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import App from './App';

describe('News Navigator Mock Tests', () => {

  it('Renders the Left Pane and Right Pane layouts properly', () => {
    render(<App />);
    
    // Check Header
    expect(screen.getByText('Daily Intelligence Brief')).toBeDefined();
    
    // Check Agent interaction initial state
    expect(screen.getByText(/Hello! I am your AI analyst/i)).toBeDefined();
    
    // Check input is present
    expect(screen.getByPlaceholderText('Ask the Analyst a question...')).toBeDefined();
    
    // Check initial citations render
    expect(screen.getByText('Source 1')).toBeDefined();
  });

  it('Handles user sending a message and shows the skeleton loader', async () => {
    const { container } = render(<App />);
    
    const input = screen.getByPlaceholderText('Ask the Analyst a question...');
    const sendButton = screen.getByText('Send');
    
    // Skeleton should not be visible initially (no animate-pulse container)
    // We can just verify the text is present
    expect(screen.getByText(/The global tech markets/i)).toBeDefined();

    // Type a message
    fireEvent.change(input, { target: { value: 'How did renewable energy perform?' } });
    fireEvent.click(sendButton);
    
    // After sending, user message should be in the chat
    expect(screen.getByText('How did renewable energy perform?')).toBeDefined();
    
    // Skeleton Screen should appear, which means the Briefing content is swapped for the loading state.
    // We can check if `animate-pulse` exists in the DOM.
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
    
    // Text should disappear
    expect(screen.queryByText(/The global tech markets/i)).toBeNull();
  });
});
