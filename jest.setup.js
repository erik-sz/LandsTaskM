// jest.setup.js

console.log(require.resolve('./utils/supabase'));
jest.mock('expo-constants', () => ({
  manifest: {
    extra: {
      supabaseUrl: "supabaseUrl",
      supabaseAnonKey: "supabaseAnonKey", 
    }
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const storage = {};  // Define storage inside the mock factory
  return {
    setItem: jest.fn((key, value) => {
      return new Promise((resolve, reject) => {
        return (typeof key !== 'string' || typeof value !== 'string')
          ? reject(new Error('key and value must be string'))
          : resolve(storage[key] = value);
      });
    }),
    getItem: jest.fn((key) => {
      return new Promise((resolve) => {
        return storage.hasOwnProperty(key) ? resolve(storage[key]) : resolve(null);
      });
    }),
    removeItem: jest.fn((key) => {
      return new Promise((resolve, reject) => {
        return storage.hasOwnProperty(key) ? resolve(delete storage[key]) : reject('No such key!');
      });
    }),
    clear: jest.fn(() => {
      return new Promise((resolve, reject) => resolve(storage = {}));
    }),
    getAllKeys: jest.fn(() => {
      return new Promise((resolve, reject) => resolve(Object.keys(storage)));
    }),
  };
});