import test from 'node:test';
import assert from 'node:assert/strict';
import {
  findMissingTagNames,
  parseItemImportCsv,
  resolveTagIds,
} from './csvImport';
import type { ItemOut, TagOut } from '@/services/types';

const existingItem = (overrides: Partial<ItemOut> = {}): ItemOut => ({
  id: '1',
  name: 'Rice',
  unit: 'kg',
  quantity: 1,
  location: 'Pantry',
  familyId: 1,
  ownerId: 1,
  ...overrides,
});

test('parses spreadsheet CSV, decimal quantities, and semicolon tags', () => {
  const csv = [
    'Notes,Tags,Location,Quantity,Unit,ItemName',
    '"Keep, dry","Food; Pantry;food",Cupboard,1.5,kg,"Brown rice"',
  ].join('\n');

  const result = parseItemImportCsv(csv, []);

  assert.deepEqual(result.errors, []);
  assert.equal(result.items[0].name, 'Brown rice');
  assert.equal(result.items[0].quantity, 1.5);
  assert.equal(result.items[0].notes, 'Keep, dry');
  assert.deepEqual(result.items[0].tagNames, ['Food', 'Pantry']);
});

test('rejects invalid rows and returns no importable items', () => {
  const csv = [
    'ItemName,Unit,Quantity,Location,Tags,Notes',
    ',pcs,-1,Garage,,',
  ].join('\n');

  const result = parseItemImportCsv(csv, []);

  assert.equal(result.items.length, 0);
  assert.deepEqual(result.errors.map((error) => error.code), ['required', 'quantity']);
  assert.ok(result.errors.every((error) => error.rowNumber === 2));
});

test('rejects duplicates against inventory, draft, and earlier CSV rows', () => {
  const csv = [
    'ItemName,Unit,Quantity,Location,Tags,Notes',
    'Rice,kg,2,Pantry,,',
    'Soap,pcs,1,Bathroom,,',
    'Soap,pcs,3,Bathroom,,',
  ].join('\n');

  const result = parseItemImportCsv(csv, [existingItem()]);

  assert.equal(result.items.length, 0);
  assert.deepEqual(
    result.errors.filter((error) => error.code === 'duplicate').map((error) => error.rowNumber),
    [2, 4],
  );
});

test('requires the exact template headers and at least one data row', () => {
  const wrongHeaders = parseItemImportCsv('Name,Unit,Quantity,Location,Tags,Notes\nRice,kg,1,A,,', []);
  const emptyTemplate = parseItemImportCsv('ItemName,Unit,Quantity,Location,Tags,Notes\n', []);

  assert.ok(wrongHeaders.errors.some((error) => error.code === 'headers'));
  assert.deepEqual(emptyTemplate.errors, [{ code: 'emptyFile' }]);
});

test('finds missing tags case-insensitively and resolves persisted IDs', () => {
  const parsed = parseItemImportCsv(
    'ItemName,Unit,Quantity,Location,Tags,Notes\nRice,kg,1,A,"Food; Pantry;food",',
    [],
  );
  const tags: TagOut[] = [{ id: '10', name: 'food', familyId: 1 }];

  assert.deepEqual(findMissingTagNames(parsed.items, tags), ['Pantry']);
  assert.deepEqual(
    resolveTagIds(['FOOD', 'pantry'], [...tags, { id: '11', name: 'Pantry', familyId: 1 }]),
    ['10', '11'],
  );
});
