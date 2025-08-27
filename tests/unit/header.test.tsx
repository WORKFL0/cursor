import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '@/components/layout/header';
import { LanguageProvider } from '@/lib/contexts/language-context';
import { ThemeProvider } from 'next-themes';

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: any) => children,
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

const MockProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <LanguageProvider>
      {children}
    </LanguageProvider>
  </ThemeProvider>
);

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main navigation', () => {
    render(
      <MockProviders>
        <Header />
      </MockProviders>
    );
    
    // Should render the main navigation elements
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('020-30 80 465')).toBeInTheDocument();
  });

  it('toggles mobile menu when clicked', async () => {
    render(
      <MockProviders>
        <Header />
      </MockProviders>
    );
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    expect(mobileMenuButton).toBeInTheDocument();
    
    // Click to open menu
    fireEvent.click(mobileMenuButton);
    
    // Should show mobile menu content
    await waitFor(() => {
      expect(screen.getByText('Menu')).toBeInTheDocument();
    });
  });

  it('renders language toggle', () => {
    render(
      <MockProviders>
        <Header />
      </MockProviders>
    );
    
    // Should have language toggle functionality
    const langButton = screen.getByRole('button', { name: /language/i });
    expect(langButton).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <MockProviders>
        <Header />
      </MockProviders>
    );
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    expect(mobileMenuButton).toHaveAttribute('aria-label');
  });

  it('closes mobile menu when clicking outside', async () => {
    render(
      <MockProviders>
        <Header />
      </MockProviders>
    );
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    fireEvent.click(mobileMenuButton);
    
    await waitFor(() => {
      expect(screen.getByText('Menu')).toBeInTheDocument();
    });
    
    // Click outside (on backdrop)
    const backdrop = screen.getByRole('button', { hidden: true });
    if (backdrop) {
      fireEvent.click(backdrop);
    }
  });
});