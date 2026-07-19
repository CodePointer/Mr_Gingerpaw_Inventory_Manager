import Papa from 'papaparse';
import type { ItemOut, TagOut } from '@/services/types';

export const ITEM_IMPORT_COLUMNS = [
  'ItemName',
  'Unit',
  'Quantity',
  'Location',
  'Tags',
  'Notes',
] as const;

export const ITEM_IMPORT_TEMPLATE = `\uFEFF${ITEM_IMPORT_COLUMNS.join(',')}\r\n`;

type ItemImportColumn = (typeof ITEM_IMPORT_COLUMNS)[number];
type CsvRow = Record<ItemImportColumn, string>;

export interface ParsedImportItem {
  rowNumber: number;
  name: string;
  unit: string;
  quantity: number;
  location: string;
  tagNames: string[];
  notes: string;
}

export interface CsvImportError {
  rowNumber?: number;
  code: 'emptyFile' | 'headers' | 'malformed' | 'required' | 'quantity' | 'duplicate';
  field?: ItemImportColumn;
  value?: string;
}

export interface CsvImportResult {
  items: ParsedImportItem[];
  errors: CsvImportError[];
}

const normalizeTagName = (name: string) => name.trim().toLocaleLowerCase();

export const itemIdentityKey = (item: { name: string; unit: string; location: string }) =>
  [item.name.trim(), item.unit.trim(), (item.location ?? '').trim()].join('\u0000');

export function parseItemImportCsv(csv: string, existingItems: ItemOut[]): CsvImportResult {
  const source = csv.replace(/^\uFEFF/, '');
  if (!source.trim()) {
    return { items: [], errors: [{ code: 'emptyFile' }] };
  }

  const parsed = Papa.parse<CsvRow>(source, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
  });

  const errors: CsvImportError[] = parsed.errors.map((error) => ({
    code: 'malformed',
    rowNumber: typeof error.row === 'number' ? error.row + 2 : undefined,
    value: error.message,
  }));

  const headers = parsed.meta.fields ?? [];
  const hasExactHeaders = headers.length === ITEM_IMPORT_COLUMNS.length
    && ITEM_IMPORT_COLUMNS.every((column) => headers.includes(column));
  if (!hasExactHeaders) {
    errors.push({ code: 'headers' });
  }

  if (errors.length > 0) {
    return { items: [], errors };
  }

  const occupiedKeys = new Set(existingItems.map(itemIdentityKey));
  const importedKeys = new Set<string>();
  const items: ParsedImportItem[] = [];

  parsed.data.forEach((row, index) => {
    const rowNumber = index + 2;
    const name = row.ItemName?.trim() ?? '';
    const unit = row.Unit?.trim() ?? '';
    const quantityText = row.Quantity?.trim() ?? '';
    const location = row.Location?.trim() ?? '';
    const notes = row.Notes?.trim() ?? '';

    if (!name) errors.push({ code: 'required', rowNumber, field: 'ItemName' });
    if (!unit) errors.push({ code: 'required', rowNumber, field: 'Unit' });

    const quantity = Number(quantityText);
    if (!quantityText || !Number.isFinite(quantity) || quantity < 0) {
      errors.push({ code: 'quantity', rowNumber, field: 'Quantity', value: quantityText });
    }

    const tagNames: string[] = [];
    const seenTags = new Set<string>();
    (row.Tags ?? '').split(';').forEach((rawTag) => {
      const tagName = rawTag.trim();
      const normalized = normalizeTagName(tagName);
      if (normalized && !seenTags.has(normalized)) {
        seenTags.add(normalized);
        tagNames.push(tagName);
      }
    });

    const key = itemIdentityKey({ name, unit, location });
    if (name && unit && (occupiedKeys.has(key) || importedKeys.has(key))) {
      errors.push({ code: 'duplicate', rowNumber, value: name });
    }
    importedKeys.add(key);

    items.push({ rowNumber, name, unit, quantity, location, tagNames, notes });
  });

  if (items.length === 0 && errors.length === 0) {
    errors.push({ code: 'emptyFile' });
  }

  return errors.length > 0 ? { items: [], errors } : { items, errors: [] };
}

export function findMissingTagNames(items: ParsedImportItem[], existingTags: TagOut[]): string[] {
  const known = new Set(existingTags.map((tag) => normalizeTagName(tag.name)));
  const missing = new Map<string, string>();

  items.forEach((item) => item.tagNames.forEach((tagName) => {
    const normalized = normalizeTagName(tagName);
    if (!known.has(normalized) && !missing.has(normalized)) {
      missing.set(normalized, tagName);
    }
  }));

  return [...missing.values()];
}

export function resolveTagIds(tagNames: string[], tags: TagOut[]): string[] {
  const byName = new Map(tags.map((tag) => [normalizeTagName(tag.name), tag.id]));
  return tagNames.flatMap((name) => {
    const id = byName.get(normalizeTagName(name));
    return id ? [id] : [];
  });
}
