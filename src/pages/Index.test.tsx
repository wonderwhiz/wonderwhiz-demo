import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Index uses components that might have Links
import Index from './Index'; // Adjust path

// Mock hooks and components
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(),
}));

vi.mock('@/components/Navbar', () => ({ default: () => <div data-testid="navbar-mock" /> }));
vi.mock('@/components/HeroSection', () => ({ default: () => <div data-testid="hero-mock" /> }));
vi.mock('@/components/FeaturesSection', () => ({ default: () => <div data-testid="features-mock" /> }));
vi.mock('@/components/HowItWorksSection', () => ({ default: () => <div data-testid="howitworks-mock" /> }));
vi.mock('@/components/TestimonialsSection', () => ({ default: () => <div data-testid="testimonials-mock" /> }));
vi.mock('@/components/CTASection', () => ({ default: () => <div data-testid="cta-mock" /> }));
vi.mock('@/components/Footer', () => ({ default: () => <div data-testid="footer-mock" /> }));

vi.mock('@/components/ParticleEffect', () => ({ default: (props) => <div data-testid="particle-effect-mock" {...props} /> }));
vi.mock('@/components/AnimatedTooltip', () => ({
  default: ({ children }) => <div data-testid="animated-tooltip-mock">{children}</div>,
}));
vi.mock('@/components/ConfettiTrigger', () => ({
  default: ({ children }) => <div data-testid="confetti-trigger-mock">{children}</div>,
}));

// Mock lucide-react icons used directly in Index.tsx
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    Award: (props) => <div data-testid="award-icon-mock" {...props} />,
    Sparkles: (props) => <div data-testid="sparkles-icon-mock" {...props} />,
  };
});


describe('Index Page', () => {
  // It's better to import from the mocked module directly in tests if needed
  // const { useIsMobile } = await import('@/hooks/use-mobile');

  beforeEach(async () => { // Make beforeEach async if top-level await was used for useIsMobile
    // Reset mocks before each test
    vi.clearAllMocks();
    // Clean up DOM from previous renders' side effects (like added cursor elements)
    document.body.innerHTML = '';
    document.documentElement.className = '';
    // Ensure useIsMobile is available if accessed like this
    // However, it's generally better to access mocked functions directly from the import
  });

  describe('Desktop View (animationsEnabled=false by default)', () => {
    beforeEach(async () => {
      const { useIsMobile } = await import('@/hooks/use-mobile');
      (useIsMobile as vi.Mock).mockReturnValue(false);
      // Import HelmetProvider
      const { HelmetProvider } = await import('react-helmet-async');
      render(
        <HelmetProvider>
          <BrowserRouter>
            <Index />
          </BrowserRouter>
        </HelmetProvider>
      );
    });

    it('does not render ParticleEffect when animations are off by default', () => {
      expect(screen.queryByTestId('particle-effect-mock')).not.toBeInTheDocument();
    });

    it('does not render mouse-following Sparkles when animations are off by default', () => {
      // This test checks for the specific wrapper div of the sparkles icon.
      // The icon itself might be present if used elsewhere, but not this specific instance.
      const sparkleWrapper = document.querySelector('div.fixed.pointer-events-none.z-50');
      if (sparkleWrapper) {
        // Check if our mocked sparkle icon is inside this specific wrapper
        const sparkleIconInsideWrapper = sparkleWrapper.querySelector('[data-testid="sparkles-icon-mock"]');
        expect(sparkleIconInsideWrapper).toBeNull();
      } else {
        // If the wrapper itself is not found, the test passes
        expect(sparkleWrapper).toBeNull();
      }
    });

    it('does not render AnimatedTooltip for Award when animations are off by default', () => {
      expect(screen.queryByTestId('animated-tooltip-mock')).not.toBeInTheDocument();
    });

    it('does not add magic-cursor-active class to documentElement when animations are off', () => {
      expect(document.documentElement.classList.contains('magic-cursor-active')).toBe(false);
    });

    it('does not add custom cursor elements to body when animations are off', () => {
      expect(document.querySelector('.magic-cursor-dot')).toBeNull();
      expect(document.querySelector('.magic-cursor-outline')).toBeNull();
    });
  });

  describe('Mobile View (animations should be off regardless of animationsEnabled state)', () => {
    beforeEach(async () => {
      const { useIsMobile } = await import('@/hooks/use-mobile');
      (useIsMobile as vi.Mock).mockReturnValue(true);
      // Import HelmetProvider
      const { HelmetProvider } = await import('react-helmet-async');
      render(
        <HelmetProvider>
          <BrowserRouter>
            <Index />
          </BrowserRouter>
        </HelmetProvider>
      );
    });

    it('does not render ParticleEffect on mobile', () => {
      expect(screen.queryByTestId('particle-effect-mock')).not.toBeInTheDocument();
    });

    it('does not render mouse-following Sparkles on mobile', () => {
       const sparkleWrapper = document.querySelector('div.fixed.pointer-events-none.z-50');
       if (sparkleWrapper) {
         const sparkleIconInsideWrapper = sparkleWrapper.querySelector('[data-testid="sparkles-icon-mock"]');
         expect(sparkleIconInsideWrapper).toBeNull();
       } else {
         expect(sparkleWrapper).toBeNull();
       }
    });

    it('does not render AnimatedTooltip for Award on mobile', () => {
      expect(screen.queryByTestId('animated-tooltip-mock')).not.toBeInTheDocument();
    });

    it('does not add magic-cursor-active class to documentElement on mobile', () => {
      expect(document.documentElement.classList.contains('magic-cursor-active')).toBe(false);
    });

    it('does not add custom cursor elements to body on mobile', () => {
      expect(document.querySelector('.magic-cursor-dot')).toBeNull();
      expect(document.querySelector('.magic-cursor-outline')).toBeNull();
    });
  });
});
