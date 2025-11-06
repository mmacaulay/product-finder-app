// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    dismiss: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: jest.fn(() => ({
    dismiss: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
}));

// Mock expo-camera
jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  useCameraPermissions: jest.fn(() => [
    { granted: true, canAskAgain: true, status: 'granted' },
    jest.fn(),
  ]),
}));

// Mock BarcodeContext
jest.mock('@/contexts/BarcodeContext', () => ({
  useBarcode: jest.fn(() => ({
    barcodeData: null,
    setBarcodeData: jest.fn(),
  })),
}));

