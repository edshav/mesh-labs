import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EducationalContent } from '../EducationalContent';

describe('EducationalContent', () => {
  it('should render educational content sections', () => {
    render(<EducationalContent />);

    expect(screen.getByText('Learn About Cryptography')).toBeInTheDocument();
    expect(screen.getByText('What is Ed25519?')).toBeInTheDocument();
    expect(screen.getByText('What is the Web Crypto API?')).toBeInTheDocument();
    expect(screen.getByText('Security Best Practices')).toBeInTheDocument();
    expect(screen.getByText('How to Use This Application')).toBeInTheDocument();
  });

  it('should expand and collapse sections when clicked', () => {
    render(<EducationalContent />);

    const ed25519Button = screen.getByText('What is Ed25519?');

    // Initially collapsed
    expect(screen.queryByText('High Security:')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(ed25519Button);
    expect(screen.getByText('High Security:')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(ed25519Button);
    expect(screen.queryByText('High Security:')).not.toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<EducationalContent />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded');
    });
  });

  it('should display educational content when sections are expanded', () => {
    render(<EducationalContent />);

    // Expand Web Crypto API section
    fireEvent.click(screen.getByText('What is the Web Crypto API?'));
    expect(screen.getByText('Native Performance:')).toBeInTheDocument();
    expect(screen.getByText('Secure Context:')).toBeInTheDocument();

    // Expand Security section
    fireEvent.click(screen.getByText('Security Best Practices'));
    expect(screen.getByText('🔐 Private Key Protection')).toBeInTheDocument();
    expect(screen.getByText('🌐 Browser Security')).toBeInTheDocument();
  });
});
