import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CameraModal from '../camera-modal';
import { useBarcode } from '@/contexts/BarcodeContext';
import { useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

// Get the mocked functions
const mockSetBarcodeData = jest.fn();
const mockRequestPermission = jest.fn();
const mockRouterDismiss = jest.fn();

// Setup mocks before tests
jest.mock('@/contexts/BarcodeContext');
jest.mock('expo-camera');
jest.mock('expo-router');

describe('CameraModal', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (useBarcode as jest.Mock).mockReturnValue({
      barcodeData: null,
      setBarcodeData: mockSetBarcodeData,
    });
    
    (router.dismiss as jest.Mock) = mockRouterDismiss;
  });

  describe('Permission States', () => {
    it('renders loading view when permissions are undefined', () => {
      (useCameraPermissions as jest.Mock).mockReturnValue([
        undefined,
        mockRequestPermission,
      ]);

      const { root } = render(<CameraModal />);
      expect(root).toBeTruthy();
    });

    it('renders permission request view when permissions are not granted', () => {
      (useCameraPermissions as jest.Mock).mockReturnValue([
        { granted: false, canAskAgain: true, status: 'undetermined' },
        mockRequestPermission,
      ]);

      const { getByText } = render(<CameraModal />);
      
      expect(getByText('We need your permission to show the camera')).toBeTruthy();
      expect(getByText('Grant Permission')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
    });

    it('calls requestPermission when Grant Permission button is pressed', () => {
      (useCameraPermissions as jest.Mock).mockReturnValue([
        { granted: false, canAskAgain: true, status: 'undetermined' },
        mockRequestPermission,
      ]);

      const { getByText } = render(<CameraModal />);
      const grantButton = getByText('Grant Permission');
      
      fireEvent.press(grantButton);
      
      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
    });

    it('dismisses modal when Cancel button is pressed in permission view', () => {
      (useCameraPermissions as jest.Mock).mockReturnValue([
        { granted: false, canAskAgain: true, status: 'undetermined' },
        mockRequestPermission,
      ]);

      const { getAllByText } = render(<CameraModal />);
      const cancelButtons = getAllByText('Cancel');
      
      fireEvent.press(cancelButtons[0]);
      
      expect(mockRouterDismiss).toHaveBeenCalledTimes(1);
    });

    it('renders camera view when permissions are granted', () => {
      (useCameraPermissions as jest.Mock).mockReturnValue([
        { granted: true, canAskAgain: true, status: 'granted' },
        mockRequestPermission,
      ]);

      const { UNSAFE_getByType } = render(<CameraModal />);
      
      // CameraView should be rendered
      expect(UNSAFE_getByType('CameraView')).toBeTruthy();
    });
  });

  describe('Barcode Scanning', () => {
    beforeEach(() => {
      (useCameraPermissions as jest.Mock).mockReturnValue([
        { granted: true, canAskAgain: true, status: 'granted' },
        mockRequestPermission,
      ]);
    });

    it('handles barcode scanned event correctly', () => {
      const { UNSAFE_getByType } = render(<CameraModal />);
      const cameraView = UNSAFE_getByType('CameraView');
      
      const mockBarcodeData = {
        data: '1234567890123',
        type: 'ean13',
      };

      // Simulate barcode scan
      fireEvent(cameraView, 'onBarcodeScanned', mockBarcodeData);

      expect(mockSetBarcodeData).toHaveBeenCalledWith(mockBarcodeData);
      expect(mockRouterDismiss).toHaveBeenCalledTimes(1);
    });

    it('prevents multiple barcode scans from being processed', () => {
      const { UNSAFE_getByType } = render(<CameraModal />);
      const cameraView = UNSAFE_getByType('CameraView');
      
      const mockBarcodeData1 = {
        data: '1234567890123',
        type: 'ean13',
      };
      
      const mockBarcodeData2 = {
        data: '9876543210987',
        type: 'upc_a',
      };

      // Simulate multiple rapid barcode scans
      fireEvent(cameraView, 'onBarcodeScanned', mockBarcodeData1);
      fireEvent(cameraView, 'onBarcodeScanned', mockBarcodeData2);
      fireEvent(cameraView, 'onBarcodeScanned', mockBarcodeData1);

      // Only the first scan should be processed
      expect(mockSetBarcodeData).toHaveBeenCalledTimes(1);
      expect(mockSetBarcodeData).toHaveBeenCalledWith(mockBarcodeData1);
      expect(mockRouterDismiss).toHaveBeenCalledTimes(1);
    });

    it('sets barcode data with correct structure', () => {
      const { UNSAFE_getByType } = render(<CameraModal />);
      const cameraView = UNSAFE_getByType('CameraView');
      
      const mockBarcodeData = {
        data: '7896543210987',
        type: 'code128',
      };

      fireEvent(cameraView, 'onBarcodeScanned', mockBarcodeData);

      expect(mockSetBarcodeData).toHaveBeenCalledWith({
        data: '7896543210987',
        type: 'code128',
      });
    });

    it('handles different barcode types correctly', () => {
      const barcodeTypes = [
        { data: '1234567890123', type: 'ean13' },
        { data: '12345678', type: 'ean8' },
        { data: '123456789012', type: 'upc_a' },
        { data: 'ABC123', type: 'code39' },
      ];

      barcodeTypes.forEach((barcodeData) => {
        // Reset mocks for each iteration
        jest.clearAllMocks();
        
        const { UNSAFE_getByType } = render(<CameraModal />);
        const cameraView = UNSAFE_getByType('CameraView');

        fireEvent(cameraView, 'onBarcodeScanned', barcodeData);

        expect(mockSetBarcodeData).toHaveBeenCalledWith(barcodeData);
        expect(mockRouterDismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Camera View Configuration', () => {
    beforeEach(() => {
      (useCameraPermissions as jest.Mock).mockReturnValue([
        { granted: true, canAskAgain: true, status: 'granted' },
        mockRequestPermission,
      ]);
    });

    it('configures camera with correct barcode types', () => {
      const { UNSAFE_getByType } = render(<CameraModal />);
      const cameraView = UNSAFE_getByType('CameraView');

      expect(cameraView.props.barcodeScannerSettings).toEqual({
        barcodeTypes: [
          'qr',
          'ean13',
          'ean8',
          'upc_a',
          'upc_e',
          'code128',
          'code39',
          'code93',
          'codabar',
        ],
      });
    });

    it('sets camera to back facing mode', () => {
      const { UNSAFE_getByType } = render(<CameraModal />);
      const cameraView = UNSAFE_getByType('CameraView');

      expect(cameraView.props.facing).toBe('back');
    });

    it('dismisses modal when Cancel button in camera view is pressed', () => {
      const { getAllByText } = render(<CameraModal />);
      const cancelButtons = getAllByText('Cancel');
      
      // Get the cancel button within the camera view
      fireEvent.press(cancelButtons[cancelButtons.length - 1]);
      
      expect(mockRouterDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration Tests', () => {
    it('completes full scan workflow without errors', async () => {
      (useCameraPermissions as jest.Mock).mockReturnValue([
        { granted: true, canAskAgain: true, status: 'granted' },
        mockRequestPermission,
      ]);

      const { UNSAFE_getByType } = render(<CameraModal />);
      const cameraView = UNSAFE_getByType('CameraView');
      
      const mockBarcodeData = {
        data: '1234567890123',
        type: 'ean13',
      };

      // Simulate the full workflow
      fireEvent(cameraView, 'onBarcodeScanned', mockBarcodeData);

      await waitFor(() => {
        expect(mockSetBarcodeData).toHaveBeenCalledWith(mockBarcodeData);
        expect(mockRouterDismiss).toHaveBeenCalled();
      });
    });

    it('completes permission grant workflow', async () => {
      const mockUpdatedPermission = jest.fn();
      
      (useCameraPermissions as jest.Mock).mockReturnValue([
        { granted: false, canAskAgain: true, status: 'undetermined' },
        mockUpdatedPermission,
      ]);

      const { getByText } = render(<CameraModal />);
      const grantButton = getByText('Grant Permission');
      
      fireEvent.press(grantButton);

      await waitFor(() => {
        expect(mockUpdatedPermission).toHaveBeenCalled();
      });
    });
  });
});

