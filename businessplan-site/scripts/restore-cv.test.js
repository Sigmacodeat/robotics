/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { main } = require('./restore-cv');

// Mocking functions
jest.mock('fs');
jest.mock('date-fns', () => ({
  format: jest.fn(() => '20250906_183502')
}));

describe('restore-cv.js', () => {
  const LOCALES_DIR = path.join(__dirname, '../src/i18n/messages');
  const mockBackup = { cv: { key1: 'Lebenslauf', key2: 'Berufserfahrung' } };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock implementations
    fs.existsSync.mockImplementation((file) => {
      if (file.includes('de.json.bak')) return true;
      return true; // All other files exist by default
    });
    
    fs.readFileSync.mockImplementation((file) => {
      if (file.includes('de.json.bak')) return JSON.stringify(mockBackup);
      return JSON.stringify({}); // Target files are empty
    });
  });

  test('should restore cv section when missing', () => {
    // Execute
    main();

    // Verify backup read
    expect(fs.readFileSync).toHaveBeenCalledWith(
      path.join(LOCALES_DIR, 'de.json.bak'),
      'utf8'
    );

    // Verify recovery point created
    expect(fs.copyFileSync).toHaveBeenCalledWith(
      path.join(LOCALES_DIR, 'de.json'),
      path.join(LOCALES_DIR, 'de.json.bak.20250906_183502')
    );

    // Verify cv restoration
    const expectedData = { cv: mockBackup.cv };
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(LOCALES_DIR, 'de.json'),
      JSON.stringify(expectedData, null, 2) + '\n',
      'utf8'
    );
  });

  test('should skip when cv exists', () => {
    // Simulate existing cv
    fs.readFileSync.mockImplementation((file) => {
      if (file.includes('de.json')) return JSON.stringify({ cv: {} });
      return JSON.stringify(mockBackup);
    });

    // Execute
    main();

    // Should not attempt restoration
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(fs.copyFileSync).not.toHaveBeenCalled();
  });

  test('should handle backup errors', () => {
    // Force backup read error
    fs.readFileSync.mockImplementation(() => {
      throw new Error('Backup corrupted');
    });

    // Execute & verify exit
    expect(() => main()).toThrow('Failed to load/validate backup');
  });
});
