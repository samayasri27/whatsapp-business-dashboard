import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({ user: { firstName: 'Test' } }),
  UserButton: () => <div>UserButton</div>,
}));

describe('Header Component', () => {
  it('renders the title', () => {
    render(<Header title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the subtitle when provided', () => {
    render(<Header title="Dashboard" subtitle="Welcome back" />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<Header title="Dashboard" />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });
});
