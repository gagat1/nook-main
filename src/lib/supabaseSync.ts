import { deleteRow, isSupabaseConfigured, selectAllRows, selectRows, upsertRows } from './supabase';

export type JsonRow<T> = {
  id: string;
  data: T;
};

const UPSERT_BATCH_SIZE = 100;

function chunkRows<T>(rows: T[], size: number) {
  return Array.from({ length: Math.ceil(rows.length / size) }, (_, index) =>
    rows.slice(index * size, index * size + size)
  );
}

export async function loadJsonRows<T>(table: string): Promise<T[]> {
  if (!isSupabaseConfigured) return [];
  const rows = await selectAllRows<JsonRow<T>>(table, { order: 'id.asc' });
  return rows.map((row) => row.data);
}

export async function loadJsonRow<T>(table: string, id: string): Promise<T | null> {
  if (!isSupabaseConfigured) return null;
  const rows = await selectRows<JsonRow<T>>(table, { filters: { id: `eq.${id}` } });
  return rows[0]?.data || null;
}

export async function upsertJsonRow<T extends { id: string }>(table: string, record: T) {
  if (!isSupabaseConfigured) return;
  await upsertRows<JsonRow<T>>(table, [{ id: record.id, data: record }]);
}

export async function upsertJsonRows<T extends { id: string }>(table: string, records: T[]) {
  if (!isSupabaseConfigured || !records.length) return;
  const rows = records.map((record) => ({ id: record.id, data: record }));

  for (const batch of chunkRows(rows, UPSERT_BATCH_SIZE)) {
    await upsertRows<JsonRow<T>>(table, batch);
  }
}

export async function replaceJsonRows<T extends { id: string }>(table: string, records: T[]) {
  if (!isSupabaseConfigured) return;

  const existing = await selectAllRows<JsonRow<T>>(table);
  const nextIds = new Set(records.map((record) => record.id));
  await upsertJsonRows(table, records);

  await Promise.all(
    existing
      .filter((row) => !nextIds.has(row.id))
      .map((row) => deleteRow(table, row.id))
  );
}

export async function deleteJsonRow(table: string, id: string) {
  if (!isSupabaseConfigured) return;
  await deleteRow(table, id);
}

export async function saveSingleton<T extends object>(table: string, id: string, data: T) {
  if (!isSupabaseConfigured) return;
  await upsertRows<JsonRow<T & { id: string }>>(table, [{ id, data: { ...data, id } }]);
}
