import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeviceDistribution } from '../DeviceDistribution';

describe('DeviceDistribution', () => {
  const mockData = [
    { device_type: 'mobile', count: 150 },
    { device_type: 'desktop', count: 300 },
    { device_type: 'tablet', count: 50 }
  ];

  it('renders chart with correct data', () => {
    render(<DeviceDistribution data={mockData} />);
    
    expect(screen.getByText('Device Distribution')).toBeInTheDocument();
    expect(screen.getByText('mobile (30%)')).toBeInTheDocument();
    expect(screen.getByText('desktop (60%)')).toBeInTheDocument();
    expect(screen.getByText('tablet (10%)')).toBeInTheDocument();
  });

  it('renders empty chart when no data provided', () => {
    render(<DeviceDistribution data={[]} />);
    
    expect(screen.getByText('Device Distribution')).toBeInTheDocument();
  });
});