// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    multiGet: jest.fn(() => Promise.resolve([])),
    multiSet: jest.fn(() => Promise.resolve()),
    multiRemove: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
  },
}));

// Mock Firebase config to prevent validation errors
jest.mock('@/config/firebase', () => ({
  auth: {},
  app: {},
}));

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  initializeAuth: jest.fn(),
  getAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    dismiss: jest.fn(),
    push: jest.fn(),
    navigate: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: jest.fn(() => ({
    dismiss: jest.fn(),
    push: jest.fn(),
    navigate: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  Redirect: 'Redirect',
}));

// Mock expo-camera
jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  useCameraPermissions: jest.fn(() => [
    { granted: true, canAskAgain: true, status: 'granted' },
    jest.fn(),
  ]),
}));

