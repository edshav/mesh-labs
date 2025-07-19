import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { KeyViewer } from '../KeyViewer';

describe('KeyViewer', () => {
  const mockProps = {
    publicKey: null,
    onGenerate: vi.fn(),
    onCopy: vi.fn(),
    onClear: vi.fn(),
    loading: false,
    error: null,
    copySuccess: null,
  };

  it('should render without public key', () => {
    render(<KeyViewer {...mockProps} />);

    // Use a function matcher to handle text split by tooltips
    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === 'No Keypair Available';
      })
    ).toBeInTheDocument();
    expect(screen.getByText('Generate Keypair')).toBeInTheDocument();
  });

  it('should render with public key', () => {
    const propsWithKey = {
      ...mockProps,
      publicKey: 'test-public-key-base64',
    };

    render(<KeyViewer {...propsWithKey} />);

    // Use a function matcher to handle text split by tooltips
    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === 'Your Public Key';
      })
    ).toBeInTheDocument();
    expect(screen.getByText('test-public-key-base64')).toBeInTheDocument();
    expect(screen.getByText('Copy to Clipboard')).toBeInTheDocument();
    expect(screen.getByText('Clear Stored Keypair')).toBeInTheDocument();
  });

  it('should display error message', () => {
    const propsWithError = {
      ...mockProps,
      error: 'Test error message',
    };

    render(<KeyViewer {...propsWithError} />);

    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should display success message', () => {
    const propsWithSuccess = {
      ...mockProps,
      copySuccess: 'Public key copied to clipboard!',
    };

    render(<KeyViewer {...propsWithSuccess} />);

    expect(screen.getByText('Public key copied to clipboard!')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    const propsWithKey = {
      ...mockProps,
      publicKey: 'test-public-key-base64',
    };

    render(<KeyViewer {...propsWithKey} />);

    // Check ARIA labels
    expect(screen.getByLabelText('Generate a new Ed25519 keypair')).toBeInTheDocument();
    expect(screen.getByLabelText('Copy your public key to clipboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Clear stored keypair from browser')).toBeInTheDocument();

    // Check aria-describedby attributes
    expect(screen.getByLabelText('Generate a new Ed25519 keypair')).toHaveAttribute(
      'aria-describedby',
      'generate-help-text'
    );
    expect(screen.getByLabelText('Copy your public key to clipboard')).toHaveAttribute(
      'aria-describedby',
      'copy-help-text'
    );
    expect(screen.getByLabelText('Clear stored keypair from browser')).toHaveAttribute(
      'aria-describedby',
      'clear-help-text'
    );

    // Check help text exists
    expect(document.getElementById('generate-help-text')).toBeInTheDocument();
    expect(document.getElementById('copy-help-text')).toBeInTheDocument();
    expect(document.getElementById('clear-help-text')).toBeInTheDocument();
  });

  it('should handle keyboard navigation', () => {
    const propsWithKey = {
      ...mockProps,
      publicKey: 'test-public-key-base64',
    };

    render(<KeyViewer {...propsWithKey} />);

    const copyButton = screen.getByLabelText('Copy your public key to clipboard');

    // Test Enter key
    fireEvent.keyDown(copyButton, { key: 'Enter' });
    expect(mockProps.onCopy).toHaveBeenCalled();

    // Test Space key
    fireEvent.keyDown(copyButton, { key: ' ' });
    expect(mockProps.onCopy).toHaveBeenCalledTimes(2);
  });

  it('should disable buttons when loading', () => {
    const propsWithLoading = {
      ...mockProps,
      loading: true,
      publicKey: 'test-public-key-base64',
    };

    render(<KeyViewer {...propsWithLoading} />);

    expect(screen.getByLabelText('Generate a new Ed25519 keypair')).toBeDisabled();
    expect(screen.getByLabelText('Copy your public key to clipboard')).toBeDisabled();
    expect(screen.getByLabelText('Clear stored keypair from browser')).toBeDisabled();
  });

  it('should show loading spinner when loading', () => {
    const propsWithLoading = {
      ...mockProps,
      loading: true,
    };

    render(<KeyViewer {...propsWithLoading} />);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should have proper focus management', () => {
    const propsWithKey = {
      ...mockProps,
      publicKey: 'test-public-key-base64',
    };

    render(<KeyViewer {...propsWithKey} />);

    // Check that public key display is focusable
    const publicKeyDisplay = screen.getByLabelText('Your public key in Base64 format');
    expect(publicKeyDisplay).toHaveAttribute('tabIndex', '0');
  });
});
