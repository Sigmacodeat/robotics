const { tryRepairJSON } = require('../scripts/repair-json');

describe('JSON Repair Functions', () => {
  test('repairs trailing commas in objects', () => {
    const input = '{ "a": 1, }';
    const result = tryRepairJSON(input);
    expect(result).toEqual({ a: 1 });
  });

  test('repairs trailing commas in arrays', () => {
    const input = '[1, 2, 3,]';
    const result = tryRepairJSON(input);
    expect(result).toEqual([1, 2, 3]);
  });

  test('throws error on irreparable JSON', () => {
    const input = '{ invalid: json }';
    expect(() => tryRepairJSON(input)).toThrow('JSON repair failed');
  });
});
