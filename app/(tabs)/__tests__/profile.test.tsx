import { useAuth } from '@/contexts/AuthContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileScreen from '../profile';

// Mock functions
const mockLogOut = jest.fn();
const mockRouterReplace = jest.fn();

// Setup mocks
jest.mock('@/contexts/AuthContext');
jest.mock('expo-router');

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })),
}));

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      logOut: mockLogOut,
    });

    (router.replace as jest.Mock) = mockRouterReplace;

    // Mock Alert.alert
    jest.spyOn(Alert, 'alert');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders profile screen with title', () => {
      const { getByText } = render(<ProfileScreen />);

      expect(getByText('Profile')).toBeTruthy();
    });

    it('renders subtitle with account management text', () => {
      const { getByText } = render(<ProfileScreen />);

      expect(getByText('Manage your account settings')).toBeTruthy();
    });

    it('renders Account section title', () => {
      const { getByText } = render(<ProfileScreen />);

      expect(getByText('Account')).toBeTruthy();
    });

    it('renders user email when user is logged in', () => {
      const { getByText } = render(<ProfileScreen />);

      expect(getByText('test@example.com')).toBeTruthy();
    });

    it('renders sign out button', () => {
      const { getByText } = render(<ProfileScreen />);

      expect(getByText('Sign Out')).toBeTruthy();
    });

    it('does not render user info when user is null', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        logOut: mockLogOut,
      });

      const { queryByText } = render(<ProfileScreen />);

      expect(queryByText('Account')).toBeFalsy();
      expect(queryByText('test@example.com')).toBeFalsy();
    });
  });

  describe('Sign Out Functionality', () => {
    it('shows confirmation alert when sign out button is pressed', () => {
      const { getByText } = render(<ProfileScreen />);
      const signOutButton = getByText('Sign Out');

      fireEvent.press(signOutButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Sign Out',
        'Are you sure you want to sign out?',
        expect.any(Array)
      );
    });

    it('does not sign out when user cancels confirmation', () => {
      const { getByText } = render(<ProfileScreen />);
      const signOutButton = getByText('Sign Out');

      fireEvent.press(signOutButton);

      // Get the alert options
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const alertOptions = alertCall[2];

      // Find and trigger cancel button
      const cancelOption = alertOptions.find((opt: any) => opt.text === 'Cancel');
      expect(cancelOption).toBeTruthy();
      expect(cancelOption.style).toBe('cancel');

      // logOut should not be called when canceling
      expect(mockLogOut).not.toHaveBeenCalled();
    });

    it('calls logOut and redirects to login when user confirms sign out', async () => {
      mockLogOut.mockResolvedValue(undefined);

      const { getByText } = render(<ProfileScreen />);
      const signOutButton = getByText('Sign Out');

      fireEvent.press(signOutButton);

      // Get the alert options
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const alertOptions = alertCall[2];

      // Find and trigger sign out button
      const signOutOption = alertOptions.find((opt: any) => opt.text === 'Sign Out');
      expect(signOutOption).toBeTruthy();
      expect(signOutOption.style).toBe('destructive');

      // Execute the onPress handler
      await signOutOption.onPress();

      await waitFor(() => {
        expect(mockLogOut).toHaveBeenCalledTimes(1);
        expect(mockRouterReplace).toHaveBeenCalledWith('/(auth)/login');
      });
    });

    it('shows error alert when sign out fails', async () => {
      mockLogOut.mockRejectedValue(new Error('Sign out failed'));

      const { getByText } = render(<ProfileScreen />);
      const signOutButton = getByText('Sign Out');

      fireEvent.press(signOutButton);

      // Get the alert options and trigger sign out
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const alertOptions = alertCall[2];
      const signOutOption = alertOptions.find((opt: any) => opt.text === 'Sign Out');

      await signOutOption.onPress();

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Failed to sign out. Please try again.'
        );
      });
    });
  });

  describe('User Display', () => {
    it('displays correct user email from auth context', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: { email: 'different@example.com' },
        logOut: mockLogOut,
      });

      const { getByText } = render(<ProfileScreen />);

      expect(getByText('different@example.com')).toBeTruthy();
    });

    it('renders user profile with avatar icon', () => {
      const { getByText } = render(<ProfileScreen />);

      // Check that user info section is rendered which contains the icon
      expect(getByText('test@example.com')).toBeTruthy();
      expect(getByText('Account')).toBeTruthy();
    });
  });

  describe('Layout and Styling', () => {
    it('applies safe area insets to container', () => {
      const mockInsets = {
        top: 44,
        right: 0,
        bottom: 34,
        left: 0,
      };

      (useSafeAreaInsets as jest.Mock).mockReturnValue(mockInsets);

      const { root } = render(<ProfileScreen />);

      expect(root).toBeTruthy();
      // The component should render without errors with different insets
    });
  });

  describe('Integration Tests', () => {
    it('completes full sign out workflow', async () => {
      mockLogOut.mockResolvedValue(undefined);

      const { getByText } = render(<ProfileScreen />);

      // User sees their email
      expect(getByText('test@example.com')).toBeTruthy();

      // User clicks sign out
      const signOutButton = getByText('Sign Out');
      fireEvent.press(signOutButton);

      // Confirmation appears
      expect(Alert.alert).toHaveBeenCalled();

      // User confirms
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const signOutOption = alertCall[2].find((opt: any) => opt.text === 'Sign Out');
      await signOutOption.onPress();

      // Sign out is executed and redirect happens
      await waitFor(() => {
        expect(mockLogOut).toHaveBeenCalled();
        expect(mockRouterReplace).toHaveBeenCalledWith('/(auth)/login');
      });
    });
  });
});
