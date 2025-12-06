import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';

// Mock Firebase auth
jest.mock('firebase/auth');
jest.mock('@/config/firebase', () => ({
  auth: {},
}));

describe('AuthContext', () => {
  const mockUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    getIdToken: jest.fn().mockResolvedValue('mock-token'),
  } as unknown as User;

  const mockUserCredential = {
    user: mockUser,
  } as UserCredential;

  let mockOnAuthStateChangedCallback: (user: User | null) => void;

  const originalConsoleLog = console.log;

  beforeAll(() => {
    // Silence console logs during tests
    console.log = jest.fn();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock onAuthStateChanged
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      mockOnAuthStateChangedCallback = callback;
      // Immediately call with null to simulate initial state
      callback(null);
      // Return unsubscribe function
      return jest.fn();
    });

    // Mock auth functions
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
    (signOut as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Provider initialization', () => {
    it('provides auth context to children', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('throws error when useAuth is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    it('sets up auth state listener on mount', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      renderHook(() => useAuth(), { wrapper });

      expect(onAuthStateChanged).toHaveBeenCalledTimes(1);
    });

    it('starts with loading true and sets to false after auth check', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Initially loading should be false (since onAuthStateChanged callback fires immediately)
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Auth state changes', () => {
    it('updates user when auth state changes to logged in', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Simulate user login
      act(() => {
        mockOnAuthStateChangedCallback(mockUser);
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.loading).toBe(false);
      });
    });

    it('updates user when auth state changes to logged out', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // First simulate login
      act(() => {
        mockOnAuthStateChangedCallback(mockUser);
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Then simulate logout
      act(() => {
        mockOnAuthStateChangedCallback(null);
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe('signUp', () => {
    it('calls createUserWithEmailAndPassword with correct credentials', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signUp('test@example.com', 'password123');
      });

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        'test@example.com',
        'password123'
      );
    });

    it('returns UserCredential on successful signup', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      let credential: UserCredential | undefined;
      await act(async () => {
        credential = await result.current.signUp('test@example.com', 'password123');
      });

      expect(credential).toEqual(mockUserCredential);
    });

    it('propagates errors from Firebase', async () => {
      const mockError = new Error('Email already in use');
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.signUp('test@example.com', 'password123');
        })
      ).rejects.toThrow('Email already in use');
    });
  });

  describe('signIn', () => {
    it('calls signInWithEmailAndPassword with correct credentials', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signIn('test@example.com', 'password123');
      });

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        'test@example.com',
        'password123'
      );
    });

    it('returns UserCredential on successful signin', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      let credential: UserCredential | undefined;
      await act(async () => {
        credential = await result.current.signIn('test@example.com', 'password123');
      });

      expect(credential).toEqual(mockUserCredential);
    });

    it('propagates errors from Firebase', async () => {
      const mockError = new Error('Invalid credentials');
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.signIn('test@example.com', 'wrongpassword');
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logOut', () => {
    it('calls signOut', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.logOut();
      });

      expect(signOut).toHaveBeenCalledWith({});
    });

    it('propagates errors from Firebase', async () => {
      const mockError = new Error('Logout failed');
      (signOut as jest.Mock).mockRejectedValue(mockError);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.logOut();
        })
      ).rejects.toThrow('Logout failed');
    });
  });

  describe('getIdToken', () => {
    it('returns null when no user is logged in', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      let token: string | null = 'initial';
      await act(async () => {
        token = await result.current.getIdToken();
      });

      expect(token).toBeNull();
    });

    it('returns token when user is logged in', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Simulate user login
      act(() => {
        mockOnAuthStateChangedCallback(mockUser);
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      let token: string | null = null;
      await act(async () => {
        token = await result.current.getIdToken();
      });

      expect(token).toBe('mock-token');
      expect(mockUser.getIdToken).toHaveBeenCalledTimes(1);
    });

    it('handles token retrieval errors gracefully', async () => {
      const mockErrorUser = {
        ...mockUser,
        getIdToken: jest.fn().mockRejectedValue(new Error('Token expired')),
      } as unknown as User;

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Simulate user login
      act(() => {
        mockOnAuthStateChangedCallback(mockErrorUser);
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockErrorUser);
      });

      await expect(
        act(async () => {
          await result.current.getIdToken();
        })
      ).rejects.toThrow('Token expired');
    });
  });

  describe('Integration scenarios', () => {
    it('handles full signup flow', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Initial state
      expect(result.current.user).toBeNull();

      // Sign up
      await act(async () => {
        await result.current.signUp('newuser@example.com', 'password123');
      });

      // Simulate auth state change
      act(() => {
        mockOnAuthStateChangedCallback(mockUser);
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });
    });

    it('handles full login flow', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Sign in
      await act(async () => {
        await result.current.signIn('test@example.com', 'password123');
      });

      // Simulate auth state change
      act(() => {
        mockOnAuthStateChangedCallback(mockUser);
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Get token
      let token: string | null = null;
      await act(async () => {
        token = await result.current.getIdToken();
      });

      expect(token).toBe('mock-token');
    });

    it('handles full logout flow', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Simulate logged in state
      act(() => {
        mockOnAuthStateChangedCallback(mockUser);
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Log out
      await act(async () => {
        await result.current.logOut();
      });

      // Simulate auth state change
      act(() => {
        mockOnAuthStateChangedCallback(null);
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });
    });
  });
});
