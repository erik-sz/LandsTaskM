// Mock the supabase client
// services/__tests__/authService.test.js

jest.mock('~/utils/supabase', () => ({
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
  },
}));

import { signInWithEmail, signUpWithEmail } from '../authService';
import { supabase } from '~/utils/supabase';

describe('authService', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    supabase.auth?.signInWithPassword?.mockClear();
    supabase.auth?.signUp?.mockClear();
  });

  describe('signInWithEmail', () => {
    it('should sign in user successfully', async () => {
      const mockUser = { user: { id: '123', email: 'test@example.com' }, error: null };
      supabase.auth.signInWithPassword.mockResolvedValue(mockUser);

      const response = await signInWithEmail('test@example.com', 'password');

      expect(response).toEqual(mockUser.user);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });

    it('should handle sign in error', async () => {
      const mockError = { error: 'Sign in failed' };
      supabase.auth.signInWithPassword.mockResolvedValue(mockError);

      await expect(signInWithEmail('test@example.com', 'password')).rejects.toThrow('Sign in failed');
    });
  });

  describe('signUpWithEmail', () => {
  });
});