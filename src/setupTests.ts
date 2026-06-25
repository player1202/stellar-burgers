import '@testing-library/jest-dom';

jest.mock('nanoid', () => ({
  nanoid: () => 'test-id'
}));
