import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { MOCK_SYSTEM_DATA } from '../services/mockData';

describe('Dashboard', () => {
  it('renders system name and overview', () => {
    render(<Dashboard data={MOCK_SYSTEM_DATA} onReset={() => {}} />);
    expect(screen.getByText(MOCK_SYSTEM_DATA.system_name)).toBeInTheDocument();
    expect(screen.getByText(MOCK_SYSTEM_DATA.overview)).toBeInTheDocument();
  });

  it('calls onReset when rebuild button is clicked', () => {
    const onReset = vi.fn();
    render(<Dashboard data={MOCK_SYSTEM_DATA} onReset={onReset} />);
    fireEvent.click(screen.getByText(/rebuild system/i));
    expect(onReset).toHaveBeenCalled();
  });

  it('renders all workflows', () => {
    render(<Dashboard data={MOCK_SYSTEM_DATA} onReset={() => {}} />);
    MOCK_SYSTEM_DATA.core_workflows.forEach(w => {
      expect(screen.getByText(w.name)).toBeInTheDocument();
    });
  });
});
