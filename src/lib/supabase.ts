const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabaseUrl = rawSupabaseUrl
  ?.trim()
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/$/, '');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

type QueryOptions = {
  order?: string;
  filters?: Record<string, string>;
  limit?: number;
  offset?: number;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function queryString(options?: QueryOptions) {
  const params = new URLSearchParams();
  if (options?.order) params.set('order', options.order);
  if (options?.limit != null) params.set('limit', String(options.limit));
  if (options?.offset != null) params.set('offset', String(options.offset));
  Object.entries(options?.filters || {}).forEach(([key, value]) => {
    params.set(key, value);
  });
  return params.toString();
}

export async function selectRows<T>(table: string, options?: QueryOptions): Promise<T[]> {
  const query = queryString(options);
  return request<T[]>(`${table}?select=*${query ? `&${query}` : ''}`);
}

export async function selectAllRows<T>(table: string, options?: Omit<QueryOptions, 'limit' | 'offset'>): Promise<T[]> {
  const pageSize = 500;
  const rows: T[] = [];

  for (let offset = 0; ; offset += pageSize) {
    const page = await selectRows<T>(table, { ...options, limit: pageSize, offset });
    rows.push(...page);

    if (page.length < pageSize) return rows;
  }
}

export async function upsertRows<T extends { id: string }>(table: string, rows: T[]): Promise<T[]> {
  if (!rows.length) return [];
  return request<T[]>(table, {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(rows),
  });
}

export async function updateRow<T extends { id: string }>(table: string, id: string, updates: Partial<T>): Promise<T[]> {
  return request<T[]>(`${table}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteRow(table: string, id: string): Promise<void> {
  await request(`${table}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Prefer: 'return=minimal',
    },
  });
}
