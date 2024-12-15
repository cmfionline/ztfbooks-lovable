import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReportSettings } from '../ReportSettings';

describe('ReportSettings', () => {
  it('renders report settings sections', () => {
    render(<ReportSettings />);
    
    expect(screen.getByText('Report Templates')).toBeInTheDocument();
    expect(screen.getByText('Scheduled Reports')).toBeInTheDocument();
  });

  it('displays template form', () => {
    render(<ReportSettings />);
    
    expect(screen.getByText('Create and manage report templates')).toBeInTheDocument();
  });

  it('displays scheduled reports form', () => {
    render(<ReportSettings />);
    
    expect(screen.getByText('Configure automated report generation')).toBeInTheDocument();
  });
});