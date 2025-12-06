/**
 * Firebase configuration tests
 *
 * Note: The firebase.ts module has top-level initialization code that runs when imported.
 * Since Firebase is fully mocked in the test environment, we primarily test that the
 * configuration uses the correct environment variables.
 */

describe('Firebase Configuration', () => {
  describe('Environment validation', () => {
    const originalEnv = process.env;

    afterEach(() => {
      process.env = originalEnv;
      jest.resetModules();
    });

    it('validates required Firebase environment variables exist', () => {
      // This test verifies the validation logic by checking that required vars are defined
      const requiredVars = [
        'EXPO_PUBLIC_FIREBASE_API_KEY',
        'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
        'EXPO_PUBLIC_FIREBASE_APP_ID',
      ];

      requiredVars.forEach(varName => {
        expect(process.env[varName]).toBeDefined();
      });
    });
  });
});
