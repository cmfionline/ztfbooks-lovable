import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationBasicInfo } from '../NotificationBasicInfo';

describe('NotificationBasicInfo', () => {
  const defaultProps = {
    title: '',
    message: '',
    imageUrl: '',
    onTitleChange: vi.fn(),
    onMessageChange: vi.fn(),
    onImageUrlChange: vi.fn(),
  };

  it('renders all input fields', () => {
    render(<NotificationBasicInfo {...defaultProps} />);
    
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByLabelText('Image URL (optional)')).toBeInTheDocument();
  });

  it('calls onChange handlers when inputs change', () => {
    const props = {
      ...defaultProps,
      onTitleChange: vi.fn(),
      onMessageChange: vi.fn(),
      onImageUrlChange: vi.fn(),
    };

    render(<NotificationBasicInfo {...props} />);
    
    const titleInput = screen.getByLabelText('Title');
    const messageInput = screen.getByLabelText('Message');
    const imageUrlInput = screen.getByLabelText('Image URL (optional)');

    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.change(messageInput, { target: { value: 'New Message' } });
    fireEvent.change(imageUrlInput, { target: { value: 'https://example.com/image.jpg' } });

    expect(props.onTitleChange).toHaveBeenCalledWith('New Title');
    expect(props.onMessageChange).toHaveBeenCalledWith('New Message');
    expect(props.onImageUrlChange).toHaveBeenCalledWith('https://example.com/image.jpg');
  });

  it('validates title length', () => {
    const props = {
      ...defaultProps,
      onTitleChange: vi.fn(),
    };

    render(<NotificationBasicInfo {...props} />);
    
    const titleInput = screen.getByLabelText('Title');
    const longTitle = 'a'.repeat(101);

    fireEvent.change(titleInput, { target: { value: longTitle } });
    
    expect(props.onTitleChange).not.toHaveBeenCalledWith(longTitle);
  });

  it('validates message length', () => {
    const props = {
      ...defaultProps,
      onMessageChange: vi.fn(),
    };

    render(<NotificationBasicInfo {...props} />);
    
    const messageInput = screen.getByLabelText('Message');
    const longMessage = 'a'.repeat(501);

    fireEvent.change(messageInput, { target: { value: longMessage } });
    
    expect(props.onMessageChange).not.toHaveBeenCalledWith(longMessage);
  });
});