export type CashMovementDirection = 'cash-to-qris' | 'qris-to-cash';

export type CashMovement = {
  id: string;
  date: string;
  direction: CashMovementDirection;
  amount: number;
  note: string;
};

export const CASH_MOVEMENT_SETTINGS_ID = 'cash_movements';
export const LOCAL_CASH_MOVEMENTS_KEY = 'nook-cash-movements';

export function normalizeCashMovements(movements: CashMovement[], isValidDate: (date: string) => boolean) {
  return movements
    .filter((movement) => isValidDate(movement.date) && movement.amount > 0)
    .map((movement) => ({
      ...movement,
      direction: movement.direction === 'qris-to-cash' ? 'qris-to-cash' : 'cash-to-qris',
      amount: Math.round(movement.amount || 0),
      note: movement.note || '',
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function loadLocalCashMovements(isValidDate: (date: string) => boolean): CashMovement[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = window.localStorage.getItem(LOCAL_CASH_MOVEMENTS_KEY);
    if (!saved) return [];
    return normalizeCashMovements(JSON.parse(saved) as CashMovement[], isValidDate);
  } catch {
    return [];
  }
}

export function movementDelta(movements: CashMovement[]) {
  return movements.reduce((total, movement) => {
    const amount = Math.round(movement.amount || 0);
    if (movement.direction === 'cash-to-qris') {
      return { cash: total.cash - amount, qris: total.qris + amount };
    }
    return { cash: total.cash + amount, qris: total.qris - amount };
  }, { cash: 0, qris: 0 });
}
