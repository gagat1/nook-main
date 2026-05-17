export type FinancePaymentMethod = 'cash' | 'qris';

export function inferExpensePaymentMethod(record: {
  paymentMethod?: FinancePaymentMethod;
  cash?: number;
  qris?: number;
  note?: string;
}): FinancePaymentMethod {
  if (record.paymentMethod === 'cash' || record.paymentMethod === 'qris') return record.paymentMethod;
  if ((record.qris ?? 0) > (record.cash ?? 0)) return 'qris';
  if ((record.cash ?? 0) > 0) return 'cash';

  const note = (record.note || '').toLowerCase();
  if (/(qris|transfer|bank|debit|card|kartu|edc|online)/.test(note)) return 'qris';
  return 'cash';
}

export function expensePaymentFields(net: number, paymentMethod: FinancePaymentMethod) {
  const amount = Math.round(net || 0);
  return {
    paymentMethod,
    cash: paymentMethod === 'cash' ? amount : 0,
    qris: paymentMethod === 'qris' ? amount : 0,
  };
}

export function expensePaymentBreakdown(record: {
  net: number;
  paymentMethod?: FinancePaymentMethod;
  cash?: number;
  qris?: number;
  note?: string;
}) {
  return expensePaymentFields(record.net, inferExpensePaymentMethod(record));
}

export function normalizeExpensePayment<T extends {
  net: number;
  paymentMethod?: FinancePaymentMethod;
  cash?: number;
  qris?: number;
  note?: string;
}>(record: T): T & ReturnType<typeof expensePaymentFields> {
  return {
    ...record,
    ...expensePaymentBreakdown(record),
  };
}
