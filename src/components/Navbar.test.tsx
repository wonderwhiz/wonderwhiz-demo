import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar'; // Adjust path as necessary
// import { Home, Users } from 'lucide-react'; // Assuming these are the icons used

// Mock lucide-react icons to simplify testing
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    Home: (props) => <svg data-testid="home-icon" {...props} />,
    Users: (props) => <svg data-testid="users-icon" {...props} />,
    // Add any other icons used in Navbar if necessary
  };
});

// Mock the WonderWhizLogo component specifically by its path
vi.mock('@/components/WonderWhizLogo', () => ({
  default: (props) => <div data-testid="wonderwhiz-logo" {...props} />,
}));

describe('Navbar', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  });

  it('renders "My Stuff" link with Home icon', () => {
    const myStuffLink = screen.getByRole('link', { name: /my stuff/i });
    expect(myStuffLink).toBeInTheDocument();
    // Check for Home icon within this link's context
    // querySelector is used here as getByTestId might be too strict if icon is nested deeply
    const homeIcon = myStuffLink.querySelector('[data-testid="home-icon"]');
    expect(homeIcon).toBeInTheDocument();
  });

  it('renders "My Heroes" link with Users icon', () => {
    const myHeroesLink = screen.getByRole('link', { name: /my heroes/i });
    expect(myHeroesLink).toBeInTheDocument();
    // Check for Users icon within this link's context
    const usersIcon = myHeroesLink.querySelector('[data-testid="users-icon"]');
    expect(usersIcon).toBeInTheDocument();
  });

  it('renders the WonderWhiz logo and brand name', () => {
    expect(screen.getByText('WonderWhiz')).toBeInTheDocument();
    // Check for the mocked WonderWhizLogo
    expect(screen.getByTestId('wonderwhiz-logo')).toBeInTheDocument();
  });

  it('renders the Login link', () => {
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
  });
});
