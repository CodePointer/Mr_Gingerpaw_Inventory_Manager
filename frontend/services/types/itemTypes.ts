import { TagOut } from './tagTypes';


// 物品创建请求
// export interface ItemCreate {
//   name: string;
//   unit: string;
//   quantity: number;
//   location: string;
//   familyId: number;
//   ownerId: number;
//   notes?: string;
//   rawInput?: string;
//   checkIntervalDays?: number;
//   restockThreshold?: number;
//   tags?: number[];
// }

// 物品信息
export interface ItemOut {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  location: string;
  familyId: number;
  ownerId: number;
  tags?: TagOut[];
  notes?: string;
  rawInput?: string;
  checkIntervalDays?: number;
  lastCheckedDate?: string;
  restockThreshold?: number;
  tagIds?: string[];
}

// 物品更新请求
export interface ItemUpdate {
  id: string;
  name?: string;
  unit?: string;
  location?: string;
  familyId: number;
  ownerId: number;
  notes?: string;
  checkIntervalDays?: number;
  restockThreshold?: number;
  tagIds?: string[];
}

export interface ItemDelete {
  id: string;
  deletedBy: number;
  note?: string;
}

// Form modal values
export interface ItemFormModalValues {
  name: string;
  location: string;
  unit: string;
  quantity: string;
  notes: string;
  checkIntervalDays: string;
  restockThreshold: string;
  tagIds: Set<string>;
  tags?: TagOut[];
  rawInput?: string;
}


export interface ItemResponseStatus {
  status: string;
  code: number;
  itemId: string;
  message?: string;
}


export function ItemOut2FormValues(item: ItemOut): ItemFormModalValues {
  return {
    name: item.name,
    location: item.location,
    unit: item.unit,
    quantity: item.quantity.toString(),
    notes: item.notes ?? '',
    checkIntervalDays: item.checkIntervalDays?.toString() ?? '',
    restockThreshold: item.restockThreshold?.toString() ?? '',
    tagIds: new Set(item.tagIds ?? []),
    rawInput: item.rawInput,
    tags: item.tags ?? [],
  };
}

export function ItemFormValues2Out(values: ItemFormModalValues, itemId: string, familyId: number, ownerId: number): ItemOut {
  return {
    id: itemId,
    name: values.name,
    unit: values.unit,
    quantity: parseInt(values.quantity, 10),
    location: values.location,
    familyId: familyId,
    ownerId: ownerId,
    notes: values.notes,
    checkIntervalDays: values.checkIntervalDays === '' ? undefined : parseFloat(values.checkIntervalDays),
    lastCheckedDate: undefined,
    restockThreshold: values.restockThreshold === '' ? undefined : parseFloat(values.restockThreshold),
    tagIds: Array.from(values.tagIds ?? []),
    tags: values.tags ?? [],
    rawInput: values.rawInput,
  };
}


export function diffItemOuts(
  newItem: ItemOut,
  oldItem: ItemOut
): ItemUpdate {
  const update: ItemUpdate = {
    id: newItem.id,
    familyId: newItem.familyId,
    ownerId: newItem.ownerId,
  };

  if (newItem.name !== oldItem.name) {
    update.name = newItem.name;
  }
  if (newItem.unit !== oldItem.unit) {
    update.unit = newItem.unit;
  }
  if (newItem.location !== oldItem.location) {
    update.location = newItem.location;
  }
  if (newItem.notes !== oldItem.notes) {
    update.notes = newItem.notes;
  }
  if (newItem.checkIntervalDays !== oldItem.checkIntervalDays) {
    update.checkIntervalDays = newItem.checkIntervalDays;
  }
  if (newItem.restockThreshold !== oldItem.restockThreshold) {
    update.restockThreshold = newItem.restockThreshold;
  }
  if (newItem.tagIds && !setsEqual(newItem.tagIds, oldItem.tagIds)) {
    try {
      update.tagIds = newItem.tagIds;
    } catch (e) {
      update.tagIds = [];
    }
  }
  return update;
}


function setsEqual(a: string[] = [], b: string[] = []): boolean {
  if (a.length !== b.length) return false
  for (const v of a) {
    if (!b.includes(v)) return false
  }
  return true
}