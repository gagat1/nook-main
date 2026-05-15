export type FinanceExtraFields = {
  received?: number;
  cogs?: number;
  productProfit?: number;
  fixedCostDaily?: number;
  profitLoss?: number;
  cash?: number;
  qris?: number;
  deliveryTax?: number;
  transactionCount?: number;
  source?: string;
};

export type IncomeRecord = FinanceExtraFields & { date: string; product: string; category: string; gross: number; discount: number; fee: number; net: number; note: string };
export type ExpenseRecord = FinanceExtraFields & { date: string; item: string; category: string; gross: number; tax: number; fee: number; net: number; note: string };

export const nookIncome: IncomeRecord[] = [
  {
    "date": "2024-11-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 600000,
    "discount": 286000,
    "fee": 0,
    "net": 314000,
    "note": ""
  },
  {
    "date": "2024-11-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 260000,
    "discount": 23000,
    "fee": 0,
    "net": 237000,
    "note": ""
  },
  {
    "date": "2024-11-05",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 418000,
    "discount": 46000,
    "fee": 0,
    "net": 372000,
    "note": ""
  },
  {
    "date": "2024-11-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 235000,
    "discount": 25000,
    "fee": 0,
    "net": 210000,
    "note": ""
  },
  {
    "date": "2024-11-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 73000,
    "discount": 0,
    "fee": 0,
    "net": 73000,
    "note": ""
  },
  {
    "date": "2024-11-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 401000,
    "discount": 23000,
    "fee": 0,
    "net": 378000,
    "note": ""
  },
  {
    "date": "2024-11-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 119000,
    "discount": 0,
    "fee": 0,
    "net": 119000,
    "note": ""
  },
  {
    "date": "2024-11-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 119000,
    "discount": 23000,
    "fee": 0,
    "net": 96000,
    "note": ""
  },
  {
    "date": "2024-11-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 188000,
    "discount": 23000,
    "fee": 0,
    "net": 165000,
    "note": ""
  },
  {
    "date": "2024-11-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 117000,
    "discount": 23000,
    "fee": 0,
    "net": 94000,
    "note": ""
  },
  {
    "date": "2024-11-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 69000,
    "discount": 0,
    "fee": 0,
    "net": 69000,
    "note": ""
  },
  {
    "date": "2024-11-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 117000,
    "discount": 23000,
    "fee": 0,
    "net": 94000,
    "note": ""
  },
  {
    "date": "2024-11-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 92000,
    "discount": 23000,
    "fee": 0,
    "net": 69000,
    "note": ""
  },
  {
    "date": "2024-11-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 94000,
    "discount": 23000,
    "fee": 0,
    "net": 71000,
    "note": ""
  },
  {
    "date": "2024-11-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 190000,
    "discount": 25000,
    "fee": 0,
    "net": 165000,
    "note": ""
  },
  {
    "date": "2024-11-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 140000,
    "discount": 23000,
    "fee": 0,
    "net": 117000,
    "note": ""
  },
  {
    "date": "2024-11-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 112000,
    "discount": 23000,
    "fee": 0,
    "net": 89000,
    "note": ""
  },
  {
    "date": "2024-11-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 152000,
    "discount": 23000,
    "fee": 0,
    "net": 129000,
    "note": ""
  },
  {
    "date": "2024-11-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 209000,
    "discount": 0,
    "fee": 0,
    "net": 209000,
    "note": ""
  },
  {
    "date": "2024-11-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 179000,
    "discount": 0,
    "fee": 0,
    "net": 179000,
    "note": ""
  },
  {
    "date": "2024-11-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 85000,
    "discount": 0,
    "fee": 0,
    "net": 85000,
    "note": ""
  },
  {
    "date": "2024-11-26",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 203000,
    "discount": 25000,
    "fee": 0,
    "net": 178000,
    "note": ""
  },
  {
    "date": "2024-11-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 232000,
    "discount": 25000,
    "fee": 0,
    "net": 207000,
    "note": ""
  },
  {
    "date": "2024-11-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 249000,
    "discount": 23000,
    "fee": 0,
    "net": 226000,
    "note": ""
  },
  {
    "date": "2024-11-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 130000,
    "discount": 20000,
    "fee": 0,
    "net": 110000,
    "note": ""
  },
  {
    "date": "2024-12-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 145000,
    "discount": 25000,
    "fee": 0,
    "net": 120000,
    "note": ""
  },
  {
    "date": "2024-12-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 181000,
    "discount": 25000,
    "fee": 0,
    "net": 156000,
    "note": ""
  },
  {
    "date": "2024-12-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 120000,
    "discount": 25000,
    "fee": 0,
    "net": 95000,
    "note": ""
  },
  {
    "date": "2024-12-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 155000,
    "discount": 25000,
    "fee": 0,
    "net": 130000,
    "note": ""
  },
  {
    "date": "2024-12-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 118000,
    "discount": 25000,
    "fee": 0,
    "net": 93000,
    "note": ""
  },
  {
    "date": "2024-12-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 136000,
    "discount": 23000,
    "fee": 0,
    "net": 113000,
    "note": ""
  },
  {
    "date": "2024-12-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 253000,
    "discount": 25000,
    "fee": 0,
    "net": 228000,
    "note": ""
  },
  {
    "date": "2024-12-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 234000,
    "discount": 23000,
    "fee": 0,
    "net": 211000,
    "note": ""
  },
  {
    "date": "2024-12-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 259000,
    "discount": 0,
    "fee": 0,
    "net": 259000,
    "note": ""
  },
  {
    "date": "2024-12-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 257000,
    "discount": 50000,
    "fee": 0,
    "net": 207000,
    "note": ""
  },
  {
    "date": "2024-12-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 258000,
    "discount": 0,
    "fee": 0,
    "net": 258000,
    "note": ""
  },
  {
    "date": "2024-12-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 138000,
    "discount": 0,
    "fee": 0,
    "net": 138000,
    "note": ""
  },
  {
    "date": "2024-12-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 88000,
    "discount": 0,
    "fee": 0,
    "net": 88000,
    "note": ""
  },
  {
    "date": "2024-12-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 100000,
    "discount": 0,
    "fee": 0,
    "net": 100000,
    "note": ""
  },
  {
    "date": "2024-12-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 188000,
    "discount": 25000,
    "fee": 0,
    "net": 163000,
    "note": ""
  },
  {
    "date": "2024-12-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 115000,
    "discount": 25000,
    "fee": 0,
    "net": 90000,
    "note": ""
  },
  {
    "date": "2024-12-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 65000,
    "discount": 20000,
    "fee": 0,
    "net": 45000,
    "note": ""
  },
  {
    "date": "2024-12-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 155000,
    "discount": 0,
    "fee": 0,
    "net": 155000,
    "note": ""
  },
  {
    "date": "2024-12-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 118000,
    "discount": 20000,
    "fee": 0,
    "net": 98000,
    "note": ""
  },
  {
    "date": "2024-12-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 149000,
    "discount": 20000,
    "fee": 0,
    "net": 129000,
    "note": ""
  },
  {
    "date": "2024-12-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 286000,
    "discount": 10000,
    "fee": 0,
    "net": 276000,
    "note": ""
  },
  {
    "date": "2024-12-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 277000,
    "discount": 0,
    "fee": 0,
    "net": 277000,
    "note": ""
  },
  {
    "date": "2024-12-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 257000,
    "discount": 23000,
    "fee": 0,
    "net": 234000,
    "note": ""
  },
  {
    "date": "2024-12-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 185000,
    "discount": 20000,
    "fee": 0,
    "net": 165000,
    "note": ""
  },
  {
    "date": "2024-12-31",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 118000,
    "discount": 0,
    "fee": 0,
    "net": 118000,
    "note": ""
  },
  {
    "date": "2025-01-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 182000,
    "discount": 5000,
    "fee": 0,
    "net": 177000,
    "note": ""
  },
  {
    "date": "2025-01-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 158000,
    "discount": 5000,
    "fee": 0,
    "net": 153000,
    "note": ""
  },
  {
    "date": "2025-01-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 371000,
    "discount": 25000,
    "fee": 0,
    "net": 346000,
    "note": ""
  },
  {
    "date": "2025-01-05",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 213000,
    "discount": 25000,
    "fee": 0,
    "net": 188000,
    "note": ""
  },
  {
    "date": "2025-01-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 211000,
    "discount": 0,
    "fee": 0,
    "net": 211000,
    "note": ""
  },
  {
    "date": "2025-01-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 205000,
    "discount": 40000,
    "fee": 0,
    "net": 165000,
    "note": ""
  },
  {
    "date": "2025-01-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 138000,
    "discount": 20000,
    "fee": 0,
    "net": 118000,
    "note": ""
  },
  {
    "date": "2025-01-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 219000,
    "discount": 0,
    "fee": 0,
    "net": 219000,
    "note": ""
  },
  {
    "date": "2025-01-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 430000,
    "discount": 25000,
    "fee": 0,
    "net": 405000,
    "note": ""
  },
  {
    "date": "2025-01-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 113000,
    "discount": 30000,
    "fee": 0,
    "net": 83000,
    "note": ""
  },
  {
    "date": "2025-01-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 170000,
    "discount": 20000,
    "fee": 0,
    "net": 150000,
    "note": ""
  },
  {
    "date": "2025-01-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 118000,
    "discount": 20000,
    "fee": 0,
    "net": 98000,
    "note": ""
  },
  {
    "date": "2025-01-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 358000,
    "discount": 50000,
    "fee": 0,
    "net": 308000,
    "note": ""
  },
  {
    "date": "2025-01-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 125000,
    "discount": 0,
    "fee": 0,
    "net": 125000,
    "note": ""
  },
  {
    "date": "2025-01-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 251000,
    "discount": 5000,
    "fee": 0,
    "net": 246000,
    "note": ""
  },
  {
    "date": "2025-01-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 114000,
    "discount": 25000,
    "fee": 0,
    "net": 89000,
    "note": ""
  },
  {
    "date": "2025-01-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 211000,
    "discount": 25000,
    "fee": 0,
    "net": 186000,
    "note": ""
  },
  {
    "date": "2025-01-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 209000,
    "discount": 20000,
    "fee": 0,
    "net": 189000,
    "note": ""
  },
  {
    "date": "2025-01-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 115000,
    "discount": 0,
    "fee": 0,
    "net": 115000,
    "note": ""
  },
  {
    "date": "2025-01-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 125000,
    "discount": 50000,
    "fee": 0,
    "net": 75000,
    "note": ""
  },
  {
    "date": "2025-01-26",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 160000,
    "discount": 0,
    "fee": 0,
    "net": 160000,
    "note": ""
  },
  {
    "date": "2025-01-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 314000,
    "discount": 0,
    "fee": 0,
    "net": 314000,
    "note": ""
  },
  {
    "date": "2025-01-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 225000,
    "discount": 0,
    "fee": 0,
    "net": 225000,
    "note": ""
  },
  {
    "date": "2025-01-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 152000,
    "discount": 20000,
    "fee": 0,
    "net": 132000,
    "note": ""
  },
  {
    "date": "2025-01-31",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 120000,
    "discount": 20000,
    "fee": 0,
    "net": 100000,
    "note": ""
  },
  {
    "date": "2025-02-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 95000,
    "discount": 20000,
    "fee": 0,
    "net": 75000,
    "note": ""
  },
  {
    "date": "2025-02-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 100000,
    "discount": 0,
    "fee": 0,
    "net": 100000,
    "note": ""
  },
  {
    "date": "2025-02-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 95000,
    "discount": 25000,
    "fee": 0,
    "net": 70000,
    "note": ""
  },
  {
    "date": "2025-02-05",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 85000,
    "discount": 0,
    "fee": 0,
    "net": 85000,
    "note": ""
  },
  {
    "date": "2025-02-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 98000,
    "discount": 0,
    "fee": 0,
    "net": 98000,
    "note": ""
  },
  {
    "date": "2025-02-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 145000,
    "discount": 5000,
    "fee": 0,
    "net": 140000,
    "note": ""
  },
  {
    "date": "2025-02-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 266000,
    "discount": 25000,
    "fee": 0,
    "net": 241000,
    "note": ""
  },
  {
    "date": "2025-02-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 145000,
    "discount": 25000,
    "fee": 0,
    "net": 120000,
    "note": ""
  },
  {
    "date": "2025-02-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 295000,
    "discount": 0,
    "fee": 0,
    "net": 295000,
    "note": ""
  },
  {
    "date": "2025-02-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 143000,
    "discount": 50000,
    "fee": 0,
    "net": 93000,
    "note": ""
  },
  {
    "date": "2025-02-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 180000,
    "discount": 85000,
    "fee": 0,
    "net": 95000,
    "note": ""
  },
  {
    "date": "2025-02-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 173000,
    "discount": 20000,
    "fee": 0,
    "net": 153000,
    "note": ""
  },
  {
    "date": "2025-02-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 120000,
    "discount": 0,
    "fee": 0,
    "net": 120000,
    "note": ""
  },
  {
    "date": "2025-02-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 118000,
    "discount": 20000,
    "fee": 0,
    "net": 98000,
    "note": ""
  },
  {
    "date": "2025-02-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 118000,
    "discount": 0,
    "fee": 0,
    "net": 118000,
    "note": ""
  },
  {
    "date": "2025-02-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 155000,
    "discount": 45000,
    "fee": 0,
    "net": 110000,
    "note": ""
  },
  {
    "date": "2025-02-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 75000,
    "discount": 25000,
    "fee": 0,
    "net": 50000,
    "note": ""
  },
  {
    "date": "2025-02-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 174000,
    "discount": 25000,
    "fee": 0,
    "net": 149000,
    "note": ""
  },
  {
    "date": "2025-02-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 223000,
    "discount": 0,
    "fee": 0,
    "net": 223000,
    "note": ""
  },
  {
    "date": "2025-02-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 162000,
    "discount": 25000,
    "fee": 0,
    "net": 137000,
    "note": ""
  },
  {
    "date": "2025-03-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 155000,
    "discount": 35000,
    "fee": 0,
    "net": 120000,
    "note": ""
  },
  {
    "date": "2025-03-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 95000,
    "discount": 0,
    "fee": 0,
    "net": 95000,
    "note": ""
  },
  {
    "date": "2025-03-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 97000,
    "discount": 30000,
    "fee": 0,
    "net": 67000,
    "note": ""
  },
  {
    "date": "2025-03-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 100000,
    "discount": 25000,
    "fee": 0,
    "net": 75000,
    "note": ""
  },
  {
    "date": "2025-03-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 135000,
    "discount": 0,
    "fee": 0,
    "net": 135000,
    "note": ""
  },
  {
    "date": "2025-03-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 100000,
    "discount": 25000,
    "fee": 0,
    "net": 75000,
    "note": ""
  },
  {
    "date": "2025-03-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 50000,
    "discount": 25000,
    "fee": 0,
    "net": 25000,
    "note": ""
  },
  {
    "date": "2025-03-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 85000,
    "discount": 35000,
    "fee": 0,
    "net": 50000,
    "note": ""
  },
  {
    "date": "2025-03-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 85000,
    "discount": 25000,
    "fee": 0,
    "net": 60000,
    "note": ""
  },
  {
    "date": "2025-03-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 122000,
    "discount": 30000,
    "fee": 0,
    "net": 92000,
    "note": ""
  },
  {
    "date": "2025-03-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 180000,
    "discount": 0,
    "fee": 0,
    "net": 180000,
    "note": ""
  },
  {
    "date": "2025-03-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 50000,
    "discount": 0,
    "fee": 0,
    "net": 50000,
    "note": ""
  },
  {
    "date": "2025-03-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 50000,
    "discount": 25000,
    "fee": 0,
    "net": 25000,
    "note": ""
  },
  {
    "date": "2025-03-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 98000,
    "discount": 0,
    "fee": 0,
    "net": 98000,
    "note": ""
  },
  {
    "date": "2025-03-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 513000,
    "discount": 25000,
    "fee": 0,
    "net": 488000,
    "note": ""
  },
  {
    "date": "2025-03-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 299000,
    "discount": 0,
    "fee": 0,
    "net": 299000,
    "note": ""
  },
  {
    "date": "2025-04-05",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 538000,
    "discount": 20000,
    "fee": 0,
    "net": 518000,
    "note": ""
  },
  {
    "date": "2025-04-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 180000,
    "discount": 25000,
    "fee": 0,
    "net": 155000,
    "note": ""
  },
  {
    "date": "2025-04-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 274000,
    "discount": 0,
    "fee": 0,
    "net": 274000,
    "note": ""
  },
  {
    "date": "2025-04-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 100000,
    "discount": 25000,
    "fee": 0,
    "net": 75000,
    "note": ""
  },
  {
    "date": "2025-04-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 286000,
    "discount": 25000,
    "fee": 0,
    "net": 261000,
    "note": ""
  },
  {
    "date": "2025-04-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 310000,
    "discount": 25000,
    "fee": 0,
    "net": 285000,
    "note": ""
  },
  {
    "date": "2025-04-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 218000,
    "discount": 0,
    "fee": 0,
    "net": 218000,
    "note": ""
  },
  {
    "date": "2025-04-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 143000,
    "discount": 20000,
    "fee": 0,
    "net": 123000,
    "note": ""
  },
  {
    "date": "2025-04-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 73000,
    "discount": 25000,
    "fee": 0,
    "net": 48000,
    "note": ""
  },
  {
    "date": "2025-04-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 188000,
    "discount": 25000,
    "fee": 0,
    "net": 163000,
    "note": ""
  },
  {
    "date": "2025-04-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 48000,
    "discount": 25000,
    "fee": 0,
    "net": 23000,
    "note": ""
  },
  {
    "date": "2025-04-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 218000,
    "discount": 20000,
    "fee": 0,
    "net": 198000,
    "note": ""
  },
  {
    "date": "2025-04-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 213000,
    "discount": 25000,
    "fee": 0,
    "net": 188000,
    "note": ""
  },
  {
    "date": "2025-04-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 75000,
    "discount": 25000,
    "fee": 0,
    "net": 50000,
    "note": ""
  },
  {
    "date": "2025-04-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 114000,
    "discount": 25000,
    "fee": 0,
    "net": 89000,
    "note": ""
  },
  {
    "date": "2025-04-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 156000,
    "discount": 20000,
    "fee": 0,
    "net": 136000,
    "note": ""
  },
  {
    "date": "2025-04-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 140000,
    "discount": 0,
    "fee": 0,
    "net": 140000,
    "note": ""
  },
  {
    "date": "2025-04-26",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 191000,
    "discount": 0,
    "fee": 0,
    "net": 191000,
    "note": ""
  },
  {
    "date": "2025-04-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 250000,
    "discount": 20000,
    "fee": 0,
    "net": 230000,
    "note": ""
  },
  {
    "date": "2025-04-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 179000,
    "discount": 20000,
    "fee": 0,
    "net": 159000,
    "note": ""
  },
  {
    "date": "2025-04-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 243000,
    "discount": 25000,
    "fee": 0,
    "net": 218000,
    "note": ""
  },
  {
    "date": "2025-04-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 150000,
    "discount": 0,
    "fee": 0,
    "net": 150000,
    "note": ""
  },
  {
    "date": "2025-05-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 175000,
    "discount": 25000,
    "fee": 0,
    "net": 150000,
    "note": ""
  },
  {
    "date": "2025-05-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 100000,
    "discount": 25000,
    "fee": 0,
    "net": 75000,
    "note": ""
  },
  {
    "date": "2025-05-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 388000,
    "discount": 0,
    "fee": 0,
    "net": 388000,
    "note": ""
  },
  {
    "date": "2025-05-05",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 345000,
    "discount": 20000,
    "fee": 0,
    "net": 325000,
    "note": ""
  },
  {
    "date": "2025-05-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 283000,
    "discount": 0,
    "fee": 0,
    "net": 283000,
    "note": ""
  },
  {
    "date": "2025-05-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 268000,
    "discount": 25000,
    "fee": 0,
    "net": 243000,
    "note": ""
  },
  {
    "date": "2025-05-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 378000,
    "discount": 0,
    "fee": 0,
    "net": 378000,
    "note": ""
  },
  {
    "date": "2025-05-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 434000,
    "discount": 0,
    "fee": 0,
    "net": 434000,
    "note": ""
  },
  {
    "date": "2025-05-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 88000,
    "discount": 0,
    "fee": 0,
    "net": 88000,
    "note": ""
  },
  {
    "date": "2025-05-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 476000,
    "discount": 25000,
    "fee": 0,
    "net": 451000,
    "note": ""
  },
  {
    "date": "2025-05-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 250000,
    "discount": 0,
    "fee": 0,
    "net": 250000,
    "note": ""
  },
  {
    "date": "2025-05-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 423000,
    "discount": 0,
    "fee": 0,
    "net": 423000,
    "note": ""
  },
  {
    "date": "2025-05-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 258000,
    "discount": 0,
    "fee": 0,
    "net": 258000,
    "note": ""
  },
  {
    "date": "2025-05-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 304000,
    "discount": 25000,
    "fee": 0,
    "net": 279000,
    "note": ""
  },
  {
    "date": "2025-05-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 348000,
    "discount": 25000,
    "fee": 0,
    "net": 323000,
    "note": ""
  },
  {
    "date": "2025-05-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 320000,
    "discount": 25000,
    "fee": 0,
    "net": 295000,
    "note": ""
  },
  {
    "date": "2025-05-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 187000,
    "discount": 25000,
    "fee": 0,
    "net": 162000,
    "note": ""
  },
  {
    "date": "2025-05-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 253000,
    "discount": 20000,
    "fee": 0,
    "net": 233000,
    "note": ""
  },
  {
    "date": "2025-05-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 220000,
    "discount": 25000,
    "fee": 0,
    "net": 195000,
    "note": ""
  },
  {
    "date": "2025-05-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 280000,
    "discount": 0,
    "fee": 0,
    "net": 280000,
    "note": ""
  },
  {
    "date": "2025-05-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 237000,
    "discount": 25000,
    "fee": 0,
    "net": 212000,
    "note": ""
  },
  {
    "date": "2025-05-26",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 353000,
    "discount": 25000,
    "fee": 0,
    "net": 328000,
    "note": ""
  },
  {
    "date": "2025-05-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 293000,
    "discount": 25000,
    "fee": 0,
    "net": 268000,
    "note": ""
  },
  {
    "date": "2025-05-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 433000,
    "discount": 25000,
    "fee": 0,
    "net": 408000,
    "note": ""
  },
  {
    "date": "2025-05-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 313000,
    "discount": 25000,
    "fee": 0,
    "net": 288000,
    "note": ""
  },
  {
    "date": "2025-05-31",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 191000,
    "discount": 25000,
    "fee": 0,
    "net": 166000,
    "note": ""
  },
  {
    "date": "2025-06-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 377000,
    "discount": 50000,
    "fee": 0,
    "net": 327000,
    "note": ""
  },
  {
    "date": "2025-06-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 195000,
    "discount": 0,
    "fee": 0,
    "net": 195000,
    "note": ""
  },
  {
    "date": "2025-06-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 230000,
    "discount": 20000,
    "fee": 0,
    "net": 210000,
    "note": ""
  },
  {
    "date": "2025-06-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 125000,
    "discount": 25000,
    "fee": 0,
    "net": 100000,
    "note": ""
  },
  {
    "date": "2025-06-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 718000,
    "discount": 20000,
    "fee": 0,
    "net": 698000,
    "note": ""
  },
  {
    "date": "2025-06-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 417000,
    "discount": 25000,
    "fee": 0,
    "net": 392000,
    "note": ""
  },
  {
    "date": "2025-06-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 474000,
    "discount": 50000,
    "fee": 0,
    "net": 424000,
    "note": ""
  },
  {
    "date": "2025-06-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 337000,
    "discount": 25000,
    "fee": 0,
    "net": 312000,
    "note": ""
  },
  {
    "date": "2025-06-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 291000,
    "discount": 20000,
    "fee": 0,
    "net": 271000,
    "note": ""
  },
  {
    "date": "2025-06-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 155000,
    "discount": 25000,
    "fee": 0,
    "net": 130000,
    "note": ""
  },
  {
    "date": "2025-06-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 244000,
    "discount": 0,
    "fee": 0,
    "net": 244000,
    "note": ""
  },
  {
    "date": "2025-06-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 512000,
    "discount": 25000,
    "fee": 0,
    "net": 487000,
    "note": ""
  },
  {
    "date": "2025-06-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 309000,
    "discount": 0,
    "fee": 0,
    "net": 309000,
    "note": ""
  },
  {
    "date": "2025-06-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 185000,
    "discount": 25000,
    "fee": 0,
    "net": 160000,
    "note": ""
  },
  {
    "date": "2025-06-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 631000,
    "discount": 25000,
    "fee": 0,
    "net": 606000,
    "note": ""
  },
  {
    "date": "2025-06-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 109000,
    "discount": 0,
    "fee": 0,
    "net": 109000,
    "note": ""
  },
  {
    "date": "2025-06-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 25000,
    "discount": 0,
    "fee": 0,
    "net": 25000,
    "note": ""
  },
  {
    "date": "2025-06-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 407000,
    "discount": 25000,
    "fee": 0,
    "net": 382000,
    "note": ""
  },
  {
    "date": "2025-06-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 205000,
    "discount": 25000,
    "fee": 0,
    "net": 180000,
    "note": ""
  },
  {
    "date": "2025-06-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 220000,
    "discount": 25000,
    "fee": 0,
    "net": 195000,
    "note": ""
  },
  {
    "date": "2025-06-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 362000,
    "discount": 25000,
    "fee": 0,
    "net": 337000,
    "note": ""
  },
  {
    "date": "2025-06-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 155000,
    "discount": 0,
    "fee": 0,
    "net": 155000,
    "note": ""
  },
  {
    "date": "2025-06-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 613000,
    "discount": 0,
    "fee": 0,
    "net": 613000,
    "note": ""
  },
  {
    "date": "2025-06-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 317000,
    "discount": 0,
    "fee": 0,
    "net": 317000,
    "note": ""
  },
  {
    "date": "2025-06-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 638000,
    "discount": 35000,
    "fee": 0,
    "net": 603000,
    "note": ""
  },
  {
    "date": "2025-07-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 448000,
    "discount": 0,
    "fee": 0,
    "net": 448000,
    "note": ""
  },
  {
    "date": "2025-07-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 493000,
    "discount": 0,
    "fee": 0,
    "net": 493000,
    "note": ""
  },
  {
    "date": "2025-07-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 365000,
    "discount": 25000,
    "fee": 0,
    "net": 340000,
    "note": ""
  },
  {
    "date": "2025-07-05",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 142000,
    "discount": 0,
    "fee": 0,
    "net": 142000,
    "note": ""
  },
  {
    "date": "2025-07-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 270000,
    "discount": 25000,
    "fee": 0,
    "net": 245000,
    "note": ""
  },
  {
    "date": "2025-07-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 630000,
    "discount": 0,
    "fee": 0,
    "net": 630000,
    "note": ""
  },
  {
    "date": "2025-07-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 598000,
    "discount": 0,
    "fee": 0,
    "net": 598000,
    "note": ""
  },
  {
    "date": "2025-07-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 263000,
    "discount": 50000,
    "fee": 0,
    "net": 213000,
    "note": ""
  },
  {
    "date": "2025-07-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 234000,
    "discount": 0,
    "fee": 0,
    "net": 234000,
    "note": ""
  },
  {
    "date": "2025-07-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 424000,
    "discount": 0,
    "fee": 0,
    "net": 424000,
    "note": ""
  },
  {
    "date": "2025-07-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 413000,
    "discount": 25000,
    "fee": 0,
    "net": 388000,
    "note": ""
  },
  {
    "date": "2025-07-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 346000,
    "discount": 25000,
    "fee": 0,
    "net": 321000,
    "note": ""
  },
  {
    "date": "2025-07-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 506000,
    "discount": 0,
    "fee": 0,
    "net": 506000,
    "note": ""
  },
  {
    "date": "2025-07-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 477000,
    "discount": 50000,
    "fee": 0,
    "net": 427000,
    "note": ""
  },
  {
    "date": "2025-07-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 125000,
    "discount": 25000,
    "fee": 0,
    "net": 100000,
    "note": ""
  },
  {
    "date": "2025-07-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 345000,
    "discount": 25000,
    "fee": 0,
    "net": 320000,
    "note": ""
  },
  {
    "date": "2025-07-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 501000,
    "discount": 0,
    "fee": 0,
    "net": 501000,
    "note": ""
  },
  {
    "date": "2025-07-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 289000,
    "discount": 25000,
    "fee": 0,
    "net": 264000,
    "note": ""
  },
  {
    "date": "2025-07-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 391000,
    "discount": 0,
    "fee": 0,
    "net": 391000,
    "note": ""
  },
  {
    "date": "2025-07-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 547000,
    "discount": 0,
    "fee": 0,
    "net": 547000,
    "note": ""
  },
  {
    "date": "2025-07-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 270000,
    "discount": 25000,
    "fee": 0,
    "net": 245000,
    "note": ""
  },
  {
    "date": "2025-07-26",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 516000,
    "discount": 35000,
    "fee": 0,
    "net": 481000,
    "note": ""
  },
  {
    "date": "2025-07-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 300000,
    "discount": 0,
    "fee": 0,
    "net": 300000,
    "note": ""
  },
  {
    "date": "2025-07-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 529000,
    "discount": 25000,
    "fee": 0,
    "net": 504000,
    "note": ""
  },
  {
    "date": "2025-07-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 472000,
    "discount": 25000,
    "fee": 0,
    "net": 447000,
    "note": ""
  },
  {
    "date": "2025-07-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 388000,
    "discount": 0,
    "fee": 0,
    "net": 388000,
    "note": ""
  },
  {
    "date": "2025-08-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 331000,
    "discount": 0,
    "fee": 0,
    "net": 331000,
    "note": ""
  },
  {
    "date": "2025-08-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 221000,
    "discount": 0,
    "fee": 0,
    "net": 221000,
    "note": ""
  },
  {
    "date": "2025-08-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 638000,
    "discount": 0,
    "fee": 0,
    "net": 638000,
    "note": ""
  },
  {
    "date": "2025-08-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 408000,
    "discount": 0,
    "fee": 0,
    "net": 408000,
    "note": ""
  },
  {
    "date": "2025-08-05",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 654000,
    "discount": 0,
    "fee": 0,
    "net": 654000,
    "note": ""
  },
  {
    "date": "2025-08-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 698000,
    "discount": 0,
    "fee": 0,
    "net": 698000,
    "note": ""
  },
  {
    "date": "2025-08-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 183000,
    "discount": 25000,
    "fee": 0,
    "net": 158000,
    "note": ""
  },
  {
    "date": "2025-08-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 451000,
    "discount": 35000,
    "fee": 0,
    "net": 416000,
    "note": ""
  },
  {
    "date": "2025-08-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 568000,
    "discount": 35000,
    "fee": 0,
    "net": 533000,
    "note": ""
  },
  {
    "date": "2025-08-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 271000,
    "discount": 35000,
    "fee": 0,
    "net": 236000,
    "note": ""
  },
  {
    "date": "2025-08-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 374000,
    "discount": 25000,
    "fee": 0,
    "net": 349000,
    "note": ""
  },
  {
    "date": "2025-08-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 432000,
    "discount": 0,
    "fee": 0,
    "net": 432000,
    "note": ""
  },
  {
    "date": "2025-08-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 383000,
    "discount": 0,
    "fee": 0,
    "net": 383000,
    "note": ""
  },
  {
    "date": "2025-08-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 290000,
    "discount": 35000,
    "fee": 0,
    "net": 255000,
    "note": ""
  },
  {
    "date": "2025-08-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 63000,
    "discount": 0,
    "fee": 0,
    "net": 63000,
    "note": ""
  },
  {
    "date": "2025-08-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 238000,
    "discount": 0,
    "fee": 0,
    "net": 238000,
    "note": ""
  },
  {
    "date": "2025-08-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 266000,
    "discount": 25000,
    "fee": 0,
    "net": 241000,
    "note": ""
  },
  {
    "date": "2025-08-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 337000,
    "discount": 25000,
    "fee": 0,
    "net": 312000,
    "note": ""
  },
  {
    "date": "2025-08-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 454000,
    "discount": 35000,
    "fee": 0,
    "net": 419000,
    "note": ""
  },
  {
    "date": "2025-08-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 448000,
    "discount": 25000,
    "fee": 0,
    "net": 423000,
    "note": ""
  },
  {
    "date": "2025-08-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 311000,
    "discount": 25000,
    "fee": 0,
    "net": 286000,
    "note": ""
  },
  {
    "date": "2025-08-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 391000,
    "discount": 25000,
    "fee": 0,
    "net": 366000,
    "note": ""
  },
  {
    "date": "2025-08-26",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 391000,
    "discount": 25000,
    "fee": 0,
    "net": 366000,
    "note": ""
  },
  {
    "date": "2025-08-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 68000,
    "discount": 48000,
    "fee": 0,
    "net": 20000,
    "note": ""
  },
  {
    "date": "2025-08-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 148000,
    "discount": 25000,
    "fee": 0,
    "net": 123000,
    "note": ""
  },
  {
    "date": "2025-08-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 494000,
    "discount": 50000,
    "fee": 0,
    "net": 444000,
    "note": ""
  },
  {
    "date": "2025-08-31",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 373000,
    "discount": 0,
    "fee": 0,
    "net": 373000,
    "note": ""
  },
  {
    "date": "2025-09-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 299000,
    "discount": 0,
    "fee": 0,
    "net": 299000,
    "note": ""
  },
  {
    "date": "2025-09-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 264000,
    "discount": 25000,
    "fee": 0,
    "net": 239000,
    "note": ""
  },
  {
    "date": "2025-09-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 100000,
    "discount": 50000,
    "fee": 0,
    "net": 50000,
    "note": ""
  },
  {
    "date": "2025-09-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 903000,
    "discount": 0,
    "fee": 0,
    "net": 903000,
    "note": ""
  },
  {
    "date": "2025-09-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 775000,
    "discount": 0,
    "fee": 0,
    "net": 775000,
    "note": ""
  },
  {
    "date": "2025-09-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1028000,
    "discount": 20000,
    "fee": 0,
    "net": 1008000,
    "note": ""
  },
  {
    "date": "2025-09-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1102000,
    "discount": 25000,
    "fee": 0,
    "net": 1077000,
    "note": ""
  },
  {
    "date": "2025-09-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 824000,
    "discount": 25000,
    "fee": 0,
    "net": 799000,
    "note": ""
  },
  {
    "date": "2025-09-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 867000,
    "discount": 25000,
    "fee": 0,
    "net": 842000,
    "note": ""
  },
  {
    "date": "2025-09-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1374000,
    "discount": 25000,
    "fee": 0,
    "net": 1349000,
    "note": ""
  },
  {
    "date": "2025-09-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1163000,
    "discount": 0,
    "fee": 0,
    "net": 1163000,
    "note": ""
  },
  {
    "date": "2025-09-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 906000,
    "discount": 25000,
    "fee": 0,
    "net": 881000,
    "note": ""
  },
  {
    "date": "2025-09-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1186000,
    "discount": 0,
    "fee": 0,
    "net": 1186000,
    "note": ""
  },
  {
    "date": "2025-09-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 897000,
    "discount": 25000,
    "fee": 0,
    "net": 872000,
    "note": ""
  },
  {
    "date": "2025-09-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1348000,
    "discount": 0,
    "fee": 0,
    "net": 1348000,
    "note": ""
  },
  {
    "date": "2025-09-26",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1163000,
    "discount": 0,
    "fee": 0,
    "net": 1163000,
    "note": ""
  },
  {
    "date": "2025-09-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1595000,
    "discount": 0,
    "fee": 0,
    "net": 1595000,
    "note": ""
  },
  {
    "date": "2025-09-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1414000,
    "discount": 0,
    "fee": 0,
    "net": 1414000,
    "note": ""
  },
  {
    "date": "2025-09-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1209000,
    "discount": 0,
    "fee": 0,
    "net": 1209000,
    "note": ""
  },
  {
    "date": "2025-09-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1229000,
    "discount": 0,
    "fee": 0,
    "net": 1229000,
    "note": ""
  },
  {
    "date": "2025-10-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1125000,
    "discount": 25000,
    "fee": 0,
    "net": 1100000,
    "note": ""
  },
  {
    "date": "2025-10-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1200000,
    "discount": 0,
    "fee": 0,
    "net": 1200000,
    "note": ""
  },
  {
    "date": "2025-10-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1357000,
    "discount": 0,
    "fee": 0,
    "net": 1357000,
    "note": ""
  },
  {
    "date": "2025-10-05",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1266000,
    "discount": 0,
    "fee": 0,
    "net": 1266000,
    "note": ""
  },
  {
    "date": "2025-10-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1684000,
    "discount": 25000,
    "fee": 0,
    "net": 1659000,
    "note": ""
  },
  {
    "date": "2025-10-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1307000,
    "discount": 0,
    "fee": 0,
    "net": 1307000,
    "note": ""
  },
  {
    "date": "2025-10-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1296000,
    "discount": 0,
    "fee": 0,
    "net": 1296000,
    "note": ""
  },
  {
    "date": "2025-10-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1423000,
    "discount": 50000,
    "fee": 0,
    "net": 1373000,
    "note": ""
  },
  {
    "date": "2025-10-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1169000,
    "discount": 0,
    "fee": 0,
    "net": 1169000,
    "note": ""
  },
  {
    "date": "2025-10-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1227000,
    "discount": 30000,
    "fee": 0,
    "net": 1197000,
    "note": ""
  },
  {
    "date": "2025-10-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1291000,
    "discount": 25000,
    "fee": 0,
    "net": 1266000,
    "note": ""
  },
  {
    "date": "2025-10-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1106000,
    "discount": 0,
    "fee": 0,
    "net": 1106000,
    "note": ""
  },
  {
    "date": "2025-10-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1202000,
    "discount": 0,
    "fee": 0,
    "net": 1202000,
    "note": ""
  },
  {
    "date": "2025-10-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1306000,
    "discount": 0,
    "fee": 0,
    "net": 1306000,
    "note": ""
  },
  {
    "date": "2025-10-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1163000,
    "discount": 0,
    "fee": 0,
    "net": 1163000,
    "note": ""
  },
  {
    "date": "2025-10-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1556000,
    "discount": 0,
    "fee": 0,
    "net": 1556000,
    "note": ""
  },
  {
    "date": "2025-10-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 824000,
    "discount": 35000,
    "fee": 0,
    "net": 789000,
    "note": ""
  },
  {
    "date": "2025-10-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 426000,
    "discount": 0,
    "fee": 0,
    "net": 426000,
    "note": ""
  },
  {
    "date": "2025-10-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1594000,
    "discount": 0,
    "fee": 0,
    "net": 1594000,
    "note": ""
  },
  {
    "date": "2025-10-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 508000,
    "discount": 25000,
    "fee": 0,
    "net": 483000,
    "note": ""
  },
  {
    "date": "2025-10-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1419000,
    "discount": 25000,
    "fee": 0,
    "net": 1394000,
    "note": ""
  },
  {
    "date": "2025-10-26",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1318000,
    "discount": 0,
    "fee": 0,
    "net": 1318000,
    "note": ""
  },
  {
    "date": "2025-10-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 679000,
    "discount": 0,
    "fee": 0,
    "net": 679000,
    "note": ""
  },
  {
    "date": "2025-10-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 908000,
    "discount": 50000,
    "fee": 0,
    "net": 858000,
    "note": ""
  },
  {
    "date": "2025-10-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1219000,
    "discount": 25000,
    "fee": 0,
    "net": 1194000,
    "note": ""
  },
  {
    "date": "2025-10-31",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1278000,
    "discount": 25000,
    "fee": 0,
    "net": 1253000,
    "note": ""
  },
  {
    "date": "2025-11-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1778000,
    "discount": 60000,
    "fee": 0,
    "net": 1718000,
    "note": ""
  },
  {
    "date": "2025-11-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1379000,
    "discount": 55000,
    "fee": 0,
    "net": 1324000,
    "note": ""
  },
  {
    "date": "2025-11-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 794000,
    "discount": 30000,
    "fee": 0,
    "net": 764000,
    "note": ""
  },
  {
    "date": "2025-11-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1607000,
    "discount": 0,
    "fee": 0,
    "net": 1607000,
    "note": ""
  },
  {
    "date": "2025-11-05",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1109000,
    "discount": 50000,
    "fee": 0,
    "net": 1059000,
    "note": ""
  },
  {
    "date": "2025-11-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1370000,
    "discount": 25000,
    "fee": 0,
    "net": 1345000,
    "note": ""
  },
  {
    "date": "2025-11-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1148000,
    "discount": 0,
    "fee": 0,
    "net": 1148000,
    "note": ""
  },
  {
    "date": "2025-11-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1121000,
    "discount": 0,
    "fee": 0,
    "net": 1121000,
    "note": ""
  },
  {
    "date": "2025-11-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 805000,
    "discount": 0,
    "fee": 0,
    "net": 805000,
    "note": ""
  },
  {
    "date": "2025-11-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1277000,
    "discount": 25000,
    "fee": 0,
    "net": 1252000,
    "note": ""
  },
  {
    "date": "2025-11-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1138000,
    "discount": 85000,
    "fee": 0,
    "net": 1053000,
    "note": ""
  },
  {
    "date": "2025-11-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1277000,
    "discount": 0,
    "fee": 0,
    "net": 1277000,
    "note": ""
  },
  {
    "date": "2025-11-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1566000,
    "discount": 60000,
    "fee": 0,
    "net": 1506000,
    "note": ""
  },
  {
    "date": "2025-11-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1690000,
    "discount": 25000,
    "fee": 0,
    "net": 1665000,
    "note": ""
  },
  {
    "date": "2025-11-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1309000,
    "discount": 25000,
    "fee": 0,
    "net": 1284000,
    "note": ""
  },
  {
    "date": "2025-11-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1161000,
    "discount": 35000,
    "fee": 0,
    "net": 1126000,
    "note": ""
  },
  {
    "date": "2025-11-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1223000,
    "discount": 35000,
    "fee": 0,
    "net": 1188000,
    "note": ""
  },
  {
    "date": "2025-11-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1281000,
    "discount": 60000,
    "fee": 0,
    "net": 1221000,
    "note": ""
  },
  {
    "date": "2025-11-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1601000,
    "discount": 0,
    "fee": 0,
    "net": 1601000,
    "note": ""
  },
  {
    "date": "2025-11-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1659000,
    "discount": 0,
    "fee": 0,
    "net": 1659000,
    "note": ""
  },
  {
    "date": "2025-11-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1862000,
    "discount": 0,
    "fee": 0,
    "net": 1862000,
    "note": ""
  },
  {
    "date": "2025-11-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1423000,
    "discount": 50000,
    "fee": 0,
    "net": 1373000,
    "note": ""
  },
  {
    "date": "2025-11-26",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1289000,
    "discount": 35000,
    "fee": 0,
    "net": 1254000,
    "note": ""
  },
  {
    "date": "2025-11-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1243000,
    "discount": 45000,
    "fee": 0,
    "net": 1198000,
    "note": ""
  },
  {
    "date": "2025-11-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1565000,
    "discount": 65000,
    "fee": 0,
    "net": 1500000,
    "note": ""
  },
  {
    "date": "2025-11-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1101000,
    "discount": 0,
    "fee": 0,
    "net": 1101000,
    "note": ""
  },
  {
    "date": "2025-12-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 876000,
    "discount": 25000,
    "fee": 0,
    "net": 851000,
    "note": ""
  },
  {
    "date": "2025-12-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 987000,
    "discount": 25000,
    "fee": 0,
    "net": 962000,
    "note": ""
  },
  {
    "date": "2025-12-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1051000,
    "discount": 25000,
    "fee": 0,
    "net": 1026000,
    "note": ""
  },
  {
    "date": "2025-12-05",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1256000,
    "discount": 45000,
    "fee": 0,
    "net": 1211000,
    "note": ""
  },
  {
    "date": "2025-12-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1361000,
    "discount": 0,
    "fee": 0,
    "net": 1361000,
    "note": ""
  },
  {
    "date": "2025-12-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1402000,
    "discount": 23000,
    "fee": 0,
    "net": 1379000,
    "note": ""
  },
  {
    "date": "2025-12-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1627000,
    "discount": 65000,
    "fee": 0,
    "net": 1562000,
    "note": ""
  },
  {
    "date": "2025-12-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1346000,
    "discount": 50000,
    "fee": 0,
    "net": 1296000,
    "note": ""
  },
  {
    "date": "2025-12-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 631000,
    "discount": 0,
    "fee": 0,
    "net": 631000,
    "note": ""
  },
  {
    "date": "2025-12-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1198000,
    "discount": 50000,
    "fee": 0,
    "net": 1148000,
    "note": ""
  },
  {
    "date": "2025-12-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2322000,
    "discount": 0,
    "fee": 0,
    "net": 2322000,
    "note": ""
  },
  {
    "date": "2025-12-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1730000,
    "discount": 25000,
    "fee": 0,
    "net": 1705000,
    "note": ""
  },
  {
    "date": "2025-12-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1659000,
    "discount": 0,
    "fee": 0,
    "net": 1659000,
    "note": ""
  },
  {
    "date": "2025-12-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1295000,
    "discount": 55000,
    "fee": 0,
    "net": 1240000,
    "note": ""
  },
  {
    "date": "2025-12-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1407000,
    "discount": 25000,
    "fee": 0,
    "net": 1382000,
    "note": ""
  },
  {
    "date": "2025-12-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1346000,
    "discount": 0,
    "fee": 0,
    "net": 1346000,
    "note": ""
  },
  {
    "date": "2025-12-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1502000,
    "discount": 0,
    "fee": 0,
    "net": 1502000,
    "note": ""
  },
  {
    "date": "2025-12-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1847000,
    "discount": 35000,
    "fee": 0,
    "net": 1812000,
    "note": ""
  },
  {
    "date": "2025-12-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1174000,
    "discount": 50000,
    "fee": 0,
    "net": 1124000,
    "note": ""
  },
  {
    "date": "2025-12-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1869000,
    "discount": 0,
    "fee": 0,
    "net": 1869000,
    "note": ""
  },
  {
    "date": "2025-12-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1904000,
    "discount": 48000,
    "fee": 0,
    "net": 1856000,
    "note": ""
  },
  {
    "date": "2025-12-26",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2075000,
    "discount": 0,
    "fee": 0,
    "net": 2075000,
    "note": ""
  },
  {
    "date": "2025-12-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2366000,
    "discount": 0,
    "fee": 0,
    "net": 2366000,
    "note": ""
  },
  {
    "date": "2025-12-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2500000,
    "discount": 0,
    "fee": 0,
    "net": 2500000,
    "note": ""
  },
  {
    "date": "2025-12-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1836000,
    "discount": 0,
    "fee": 0,
    "net": 1836000,
    "note": ""
  },
  {
    "date": "2025-12-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1405000,
    "discount": 25000,
    "fee": 0,
    "net": 1380000,
    "note": ""
  },
  {
    "date": "2025-12-31",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1896000,
    "discount": 0,
    "fee": 0,
    "net": 1896000,
    "note": ""
  },
  {
    "date": "2026-01-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2276000,
    "discount": 0,
    "fee": 0,
    "net": 2276000,
    "note": ""
  },
  {
    "date": "2026-01-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2218000,
    "discount": 0,
    "fee": 0,
    "net": 2218000,
    "note": ""
  },
  {
    "date": "2026-01-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2268000,
    "discount": 20000,
    "fee": 0,
    "net": 2248000,
    "note": ""
  },
  {
    "date": "2026-01-05",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1801000,
    "discount": 0,
    "fee": 0,
    "net": 1801000,
    "note": ""
  },
  {
    "date": "2026-01-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1962000,
    "discount": 23000,
    "fee": 0,
    "net": 1939000,
    "note": ""
  },
  {
    "date": "2026-01-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1979000,
    "discount": 0,
    "fee": 0,
    "net": 1979000,
    "note": ""
  },
  {
    "date": "2026-01-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1650000,
    "discount": 0,
    "fee": 0,
    "net": 1650000,
    "note": ""
  },
  {
    "date": "2026-01-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2134000,
    "discount": 0,
    "fee": 0,
    "net": 2134000,
    "note": ""
  },
  {
    "date": "2026-01-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1734000,
    "discount": 0,
    "fee": 0,
    "net": 1734000,
    "note": ""
  },
  {
    "date": "2026-01-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1320000,
    "discount": 23000,
    "fee": 0,
    "net": 1297000,
    "note": ""
  },
  {
    "date": "2026-01-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1055000,
    "discount": 0,
    "fee": 0,
    "net": 1055000,
    "note": ""
  },
  {
    "date": "2026-01-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1316000,
    "discount": 0,
    "fee": 0,
    "net": 1316000,
    "note": ""
  },
  {
    "date": "2026-01-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2251000,
    "discount": 0,
    "fee": 0,
    "net": 2251000,
    "note": ""
  },
  {
    "date": "2026-01-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1939000,
    "discount": 0,
    "fee": 0,
    "net": 1939000,
    "note": ""
  },
  {
    "date": "2026-01-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2739000,
    "discount": 0,
    "fee": 0,
    "net": 2739000,
    "note": ""
  },
  {
    "date": "2026-01-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1501000,
    "discount": 25000,
    "fee": 0,
    "net": 1476000,
    "note": ""
  },
  {
    "date": "2026-01-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1587000,
    "discount": 25000,
    "fee": 0,
    "net": 1562000,
    "note": ""
  },
  {
    "date": "2026-01-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1026000,
    "discount": 25000,
    "fee": 0,
    "net": 1001000,
    "note": ""
  },
  {
    "date": "2026-01-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1739000,
    "discount": 0,
    "fee": 0,
    "net": 1739000,
    "note": ""
  },
  {
    "date": "2026-01-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2032000,
    "discount": 50000,
    "fee": 0,
    "net": 1982000,
    "note": ""
  },
  {
    "date": "2026-01-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2092000,
    "discount": 0,
    "fee": 0,
    "net": 2092000,
    "note": ""
  },
  {
    "date": "2026-01-26",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1870000,
    "discount": 0,
    "fee": 0,
    "net": 1870000,
    "note": ""
  },
  {
    "date": "2026-01-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1421000,
    "discount": 25000,
    "fee": 0,
    "net": 1396000,
    "note": ""
  },
  {
    "date": "2026-01-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1288000,
    "discount": 0,
    "fee": 0,
    "net": 1288000,
    "note": ""
  },
  {
    "date": "2026-01-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2084000,
    "discount": 0,
    "fee": 0,
    "net": 2084000,
    "note": ""
  },
  {
    "date": "2026-01-31",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2369000,
    "discount": 0,
    "fee": 0,
    "net": 2369000,
    "note": ""
  },
  {
    "date": "2026-02-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1961000,
    "discount": 0,
    "fee": 0,
    "net": 1961000,
    "note": ""
  },
  {
    "date": "2026-02-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1547000,
    "discount": 0,
    "fee": 0,
    "net": 1547000,
    "note": ""
  },
  {
    "date": "2026-02-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1690000,
    "discount": 25000,
    "fee": 0,
    "net": 1665000,
    "note": ""
  },
  {
    "date": "2026-02-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1507000,
    "discount": 0,
    "fee": 0,
    "net": 1507000,
    "note": ""
  },
  {
    "date": "2026-02-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1063000,
    "discount": 0,
    "fee": 0,
    "net": 1063000,
    "note": ""
  },
  {
    "date": "2026-02-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2178000,
    "discount": 48000,
    "fee": 0,
    "net": 2130000,
    "note": ""
  },
  {
    "date": "2026-02-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1211000,
    "discount": 25000,
    "fee": 0,
    "net": 1186000,
    "note": ""
  },
  {
    "date": "2026-02-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1272000,
    "discount": 25000,
    "fee": 0,
    "net": 1247000,
    "note": ""
  },
  {
    "date": "2026-02-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 914000,
    "discount": 0,
    "fee": 0,
    "net": 914000,
    "note": ""
  },
  {
    "date": "2026-02-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1588000,
    "discount": 23000,
    "fee": 0,
    "net": 1565000,
    "note": ""
  },
  {
    "date": "2026-02-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1943000,
    "discount": 0,
    "fee": 0,
    "net": 1943000,
    "note": ""
  },
  {
    "date": "2026-02-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2094000,
    "discount": 0,
    "fee": 0,
    "net": 2094000,
    "note": ""
  },
  {
    "date": "2026-02-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2821000,
    "discount": 25000,
    "fee": 0,
    "net": 2796000,
    "note": ""
  },
  {
    "date": "2026-02-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1688000,
    "discount": 0,
    "fee": 0,
    "net": 1688000,
    "note": ""
  },
  {
    "date": "2026-02-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2027000,
    "discount": 0,
    "fee": 0,
    "net": 2027000,
    "note": ""
  },
  {
    "date": "2026-02-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1030000,
    "discount": 0,
    "fee": 0,
    "net": 1030000,
    "note": ""
  },
  {
    "date": "2026-02-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 853000,
    "discount": 0,
    "fee": 0,
    "net": 853000,
    "note": ""
  },
  {
    "date": "2026-02-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 261000,
    "discount": 0,
    "fee": 0,
    "net": 261000,
    "note": ""
  },
  {
    "date": "2026-02-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 733000,
    "discount": 0,
    "fee": 0,
    "net": 733000,
    "note": ""
  },
  {
    "date": "2026-02-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 891000,
    "discount": 0,
    "fee": 0,
    "net": 891000,
    "note": ""
  },
  {
    "date": "2026-02-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1231000,
    "discount": 0,
    "fee": 0,
    "net": 1231000,
    "note": ""
  },
  {
    "date": "2026-02-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1279000,
    "discount": 0,
    "fee": 0,
    "net": 1279000,
    "note": ""
  },
  {
    "date": "2026-02-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 455000,
    "discount": 0,
    "fee": 0,
    "net": 455000,
    "note": ""
  },
  {
    "date": "2026-03-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1300000,
    "discount": 0,
    "fee": 0,
    "net": 1300000,
    "note": ""
  },
  {
    "date": "2026-03-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 664000,
    "discount": 0,
    "fee": 0,
    "net": 664000,
    "note": ""
  },
  {
    "date": "2026-03-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1164000,
    "discount": 0,
    "fee": 0,
    "net": 1164000,
    "note": ""
  },
  {
    "date": "2026-03-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 728000,
    "discount": 0,
    "fee": 0,
    "net": 728000,
    "note": ""
  },
  {
    "date": "2026-03-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 938000,
    "discount": 0,
    "fee": 0,
    "net": 938000,
    "note": ""
  },
  {
    "date": "2026-03-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 982000,
    "discount": 0,
    "fee": 0,
    "net": 982000,
    "note": ""
  },
  {
    "date": "2026-03-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1308000,
    "discount": 0,
    "fee": 0,
    "net": 1308000,
    "note": ""
  },
  {
    "date": "2026-03-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 436000,
    "discount": 0,
    "fee": 0,
    "net": 436000,
    "note": ""
  },
  {
    "date": "2026-03-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 955000,
    "discount": 0,
    "fee": 0,
    "net": 955000,
    "note": ""
  },
  {
    "date": "2026-03-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 619000,
    "discount": 0,
    "fee": 0,
    "net": 619000,
    "note": ""
  },
  {
    "date": "2026-03-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 968000,
    "discount": 0,
    "fee": 0,
    "net": 968000,
    "note": ""
  },
  {
    "date": "2026-03-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1164000,
    "discount": 0,
    "fee": 0,
    "net": 1164000,
    "note": ""
  },
  {
    "date": "2026-03-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1215000,
    "discount": 0,
    "fee": 0,
    "net": 1215000,
    "note": ""
  },
  {
    "date": "2026-03-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1339000,
    "discount": 0,
    "fee": 0,
    "net": 1339000,
    "note": ""
  },
  {
    "date": "2026-03-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1575000,
    "discount": 0,
    "fee": 0,
    "net": 1575000,
    "note": ""
  },
  {
    "date": "2026-03-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2294000,
    "discount": 0,
    "fee": 0,
    "net": 2294000,
    "note": ""
  },
  {
    "date": "2026-03-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2918000,
    "discount": 0,
    "fee": 0,
    "net": 2918000,
    "note": ""
  },
  {
    "date": "2026-03-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 3285000,
    "discount": 0,
    "fee": 0,
    "net": 3285000,
    "note": ""
  },
  {
    "date": "2026-03-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 3953000,
    "discount": 0,
    "fee": 0,
    "net": 3953000,
    "note": ""
  },
  {
    "date": "2026-03-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 3326000,
    "discount": 0,
    "fee": 0,
    "net": 3326000,
    "note": ""
  },
  {
    "date": "2026-03-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 4205000,
    "discount": 0,
    "fee": 0,
    "net": 4205000,
    "note": ""
  },
  {
    "date": "2026-03-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 3926000,
    "discount": 0,
    "fee": 0,
    "net": 3926000,
    "note": ""
  },
  {
    "date": "2026-03-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 3343000,
    "discount": 0,
    "fee": 0,
    "net": 3343000,
    "note": ""
  },
  {
    "date": "2026-03-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2466000,
    "discount": 0,
    "fee": 0,
    "net": 2466000,
    "note": ""
  },
  {
    "date": "2026-03-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2099000,
    "discount": 0,
    "fee": 0,
    "net": 2099000,
    "note": ""
  },
  {
    "date": "2026-03-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1865000,
    "discount": 0,
    "fee": 0,
    "net": 1865000,
    "note": ""
  },
  {
    "date": "2026-04-01",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1857000,
    "discount": 0,
    "fee": 0,
    "net": 1857000,
    "note": ""
  },
  {
    "date": "2026-04-02",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2444000,
    "discount": 0,
    "fee": 0,
    "net": 2444000,
    "note": ""
  },
  {
    "date": "2026-04-03",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2251000,
    "discount": 0,
    "fee": 0,
    "net": 2251000,
    "note": ""
  },
  {
    "date": "2026-04-04",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2208000,
    "discount": 0,
    "fee": 0,
    "net": 2208000,
    "note": ""
  },
  {
    "date": "2026-04-05",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1992000,
    "discount": 0,
    "fee": 0,
    "net": 1992000,
    "note": ""
  },
  {
    "date": "2026-04-06",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1568000,
    "discount": 0,
    "fee": 0,
    "net": 1568000,
    "note": ""
  },
  {
    "date": "2026-04-07",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1708000,
    "discount": 0,
    "fee": 0,
    "net": 1708000,
    "note": ""
  },
  {
    "date": "2026-04-08",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2038000,
    "discount": 0,
    "fee": 0,
    "net": 2038000,
    "note": ""
  },
  {
    "date": "2026-04-09",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1949000,
    "discount": 0,
    "fee": 0,
    "net": 1949000,
    "note": ""
  },
  {
    "date": "2026-04-10",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1703000,
    "discount": 0,
    "fee": 0,
    "net": 1703000,
    "note": ""
  },
  {
    "date": "2026-04-11",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2647000,
    "discount": 0,
    "fee": 0,
    "net": 2647000,
    "note": ""
  },
  {
    "date": "2026-04-12",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2288000,
    "discount": 0,
    "fee": 0,
    "net": 2288000,
    "note": ""
  },
  {
    "date": "2026-04-13",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2571000,
    "discount": 0,
    "fee": 0,
    "net": 2571000,
    "note": ""
  },
  {
    "date": "2026-04-14",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2211000,
    "discount": 0,
    "fee": 0,
    "net": 2211000,
    "note": ""
  },
  {
    "date": "2026-04-15",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1422000,
    "discount": 0,
    "fee": 0,
    "net": 1422000,
    "note": ""
  },
  {
    "date": "2026-04-16",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1886000,
    "discount": 0,
    "fee": 0,
    "net": 1886000,
    "note": ""
  },
  {
    "date": "2026-04-17",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2135000,
    "discount": 0,
    "fee": 0,
    "net": 2135000,
    "note": ""
  },
  {
    "date": "2026-04-18",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1839000,
    "discount": 0,
    "fee": 0,
    "net": 1839000,
    "note": ""
  },
  {
    "date": "2026-04-19",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2486000,
    "discount": 0,
    "fee": 0,
    "net": 2486000,
    "note": ""
  },
  {
    "date": "2026-04-20",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2207000,
    "discount": 0,
    "fee": 0,
    "net": 2207000,
    "note": ""
  },
  {
    "date": "2026-04-21",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1634000,
    "discount": 0,
    "fee": 0,
    "net": 1634000,
    "note": ""
  },
  {
    "date": "2026-04-22",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1557000,
    "discount": 0,
    "fee": 0,
    "net": 1557000,
    "note": ""
  },
  {
    "date": "2026-04-23",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2457000,
    "discount": 0,
    "fee": 0,
    "net": 2457000,
    "note": ""
  },
  {
    "date": "2026-04-24",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2286000,
    "discount": 0,
    "fee": 0,
    "net": 2286000,
    "note": ""
  },
  {
    "date": "2026-04-25",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 2253000,
    "discount": 0,
    "fee": 0,
    "net": 2253000,
    "note": ""
  },
  {
    "date": "2026-04-26",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1772000,
    "discount": 0,
    "fee": 0,
    "net": 1772000,
    "note": ""
  },
  {
    "date": "2026-04-27",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1275000,
    "discount": 0,
    "fee": 0,
    "net": 1275000,
    "note": ""
  },
  {
    "date": "2026-04-28",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1881000,
    "discount": 0,
    "fee": 0,
    "net": 1881000,
    "note": ""
  },
  {
    "date": "2026-04-29",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1496000,
    "discount": 0,
    "fee": 0,
    "net": 1496000,
    "note": ""
  },
  {
    "date": "2026-04-30",
    "product": "Sales",
    "category": "Nook Main",
    "gross": 1447000,
    "discount": 0,
    "fee": 0,
    "net": 1447000,
    "note": ""
  }
];

export const nookExpenses: ExpenseRecord[] = [
  {
    "date": "2024-11-11",
    "item": "Kabel",
    "category": "Lain-lain",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Cash"
  },
  {
    "date": "2024-11-11",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2024-11-11",
    "item": "Coklat",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Cash"
  },
  {
    "date": "2024-11-15",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2024-11-22",
    "item": "A Roast Espresso Beans (1kg)",
    "category": "Bahan Baku",
    "gross": 341000,
    "tax": 0,
    "fee": 0,
    "net": 341000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-11-22",
    "item": "Hippo Blend Espresso (1kg)",
    "category": "Bahan Baku",
    "gross": 222500,
    "tax": 0,
    "fee": 0,
    "net": 222500,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-11-22",
    "item": "Colombia Manantiales Filter (100gr)",
    "category": "Bahan Baku",
    "gross": 70000,
    "tax": 0,
    "fee": 0,
    "net": 70000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-11-22",
    "item": "Panama Boquere Eagle (50gr)",
    "category": "Bahan Baku",
    "gross": 76500,
    "tax": 0,
    "fee": 0,
    "net": 76500,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-11-22",
    "item": "Bean Banter Guatemala (100gr)",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-11-22",
    "item": "Filter Toko Kopi 58 (100gr)",
    "category": "Bahan Baku",
    "gross": 265000,
    "tax": 0,
    "fee": 0,
    "net": 265000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-11-29",
    "item": "Kebersihan",
    "category": "Lain-lain",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2024-11-29",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2024-11-30",
    "item": "Sabun",
    "category": "Lain-lain",
    "gross": 20000,
    "tax": 0,
    "fee": 0,
    "net": 20000,
    "note": "Cash"
  },
  {
    "date": "2024-12-06",
    "item": "Hayati Kopi",
    "category": "Bahan Baku",
    "gross": 70000,
    "tax": 0,
    "fee": 0,
    "net": 70000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-12-06",
    "item": "Greenfields Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-12-07",
    "item": "Bean Banter Tenjolaya (100gr)",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-12-10",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2024-12-10",
    "item": "Marjan Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2024-12-10",
    "item": "Gula Aren",
    "category": "Bahan Baku",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2024-12-10",
    "item": "Kresek Sampah Besar",
    "category": "Lain-lain",
    "gross": 35000,
    "tax": 0,
    "fee": 0,
    "net": 35000,
    "note": "Cash"
  },
  {
    "date": "2024-12-11",
    "item": "Tanah Dieng Filter (400gr)",
    "category": "Bahan Baku",
    "gross": 208000,
    "tax": 0,
    "fee": 0,
    "net": 208000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-12-28",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2024-12-31",
    "item": "Bean Banter Espresso",
    "category": "Bahan Baku",
    "gross": 235000,
    "tax": 0,
    "fee": 0,
    "net": 235000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-12-31",
    "item": "Djaya Espresso",
    "category": "Bahan Baku",
    "gross": 275000,
    "tax": 0,
    "fee": 0,
    "net": 275000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-12-31",
    "item": "Common Ground Filter",
    "category": "Bahan Baku",
    "gross": 195000,
    "tax": 0,
    "fee": 0,
    "net": 195000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-12-31",
    "item": "Ehiopia Bensa Filter",
    "category": "Bahan Baku",
    "gross": 62000,
    "tax": 0,
    "fee": 0,
    "net": 62000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-12-31",
    "item": "Strawberry Surprise Filter",
    "category": "Bahan Baku",
    "gross": 78000,
    "tax": 0,
    "fee": 0,
    "net": 78000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-12-31",
    "item": "Greenfields Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2024-12-31",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2024-12-31",
    "item": "Plastik Cup",
    "category": "Lain-lain",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2025-01-03",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 16000,
    "tax": 0,
    "fee": 0,
    "net": 16000,
    "note": "Cash"
  },
  {
    "date": "2025-01-05",
    "item": "Cookies",
    "category": "Bahan Baku",
    "gross": 60000,
    "tax": 0,
    "fee": 0,
    "net": 60000,
    "note": "Cash"
  },
  {
    "date": "2025-01-07",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 16000,
    "tax": 0,
    "fee": 0,
    "net": 16000,
    "note": "Cash"
  },
  {
    "date": "2025-01-11",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 16000,
    "tax": 0,
    "fee": 0,
    "net": 16000,
    "note": "Cash"
  },
  {
    "date": "2025-01-13",
    "item": "Max Krimer 500gr",
    "category": "Bahan Baku",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-01-13",
    "item": "Coklat Van Houten 165gr",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-01-13",
    "item": "Plastik Es Klip",
    "category": "Lain-lain",
    "gross": 6500,
    "tax": 0,
    "fee": 0,
    "net": 6500,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-01-13",
    "item": "Palm Sugar 500gr",
    "category": "Bahan Baku",
    "gross": 16000,
    "tax": 0,
    "fee": 0,
    "net": 16000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-01-13",
    "item": "Plastik Sampah Besar",
    "category": "Lain-lain",
    "gross": 21500,
    "tax": 0,
    "fee": 0,
    "net": 21500,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-01-17",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 16000,
    "tax": 0,
    "fee": 0,
    "net": 16000,
    "note": "Cash"
  },
  {
    "date": "2025-01-17",
    "item": "Malawi Mzuzu Filter (100gr)",
    "category": "Bahan Baku",
    "gross": 60000,
    "tax": 0,
    "fee": 0,
    "net": 60000,
    "note": "Cash"
  },
  {
    "date": "2025-01-19",
    "item": "Lampu",
    "category": "Lain-lain",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2025-01-19",
    "item": "Galon",
    "category": "Lain-lain",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2025-01-21",
    "item": "Tisu",
    "category": "Lain-lain",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2025-01-21",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2025-01-22",
    "item": "Susu Greenfield 1 Box",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-01-23",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-01-24",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2025-01-29",
    "item": "Kebersihan",
    "category": "Lain-lain",
    "gross": 20000,
    "tax": 0,
    "fee": 0,
    "net": 20000,
    "note": "Cash"
  },
  {
    "date": "2025-01-29",
    "item": "Catur Village Bali Fumidai",
    "category": "Bahan Baku",
    "gross": 92000,
    "tax": 0,
    "fee": 0,
    "net": 92000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-01-29",
    "item": "Tropical Candy Espresso",
    "category": "Bahan Baku",
    "gross": 278000,
    "tax": 0,
    "fee": 0,
    "net": 278000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-01-29",
    "item": "Costa Rica Esperanza",
    "category": "Bahan Baku",
    "gross": 146000,
    "tax": 0,
    "fee": 0,
    "net": 146000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-01-29",
    "item": "Ponorogo Mosto Natural",
    "category": "Bahan Baku",
    "gross": 82000,
    "tax": 0,
    "fee": 0,
    "net": 82000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-01-31",
    "item": "Plastik Sampah Besar",
    "category": "Lain-lain",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2025-01-31",
    "item": "Plastik Klip Es",
    "category": "Lain-lain",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2025-02-07",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2025-02-09",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 20000,
    "tax": 0,
    "fee": 0,
    "net": 20000,
    "note": "Cash"
  },
  {
    "date": "2025-02-12",
    "item": "Sapu",
    "category": "Lain-lain",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2025-02-15",
    "item": "Kabel, Set T",
    "category": "Lain-lain",
    "gross": 277000,
    "tax": 0,
    "fee": 0,
    "net": 277000,
    "note": "Cash"
  },
  {
    "date": "2025-02-28",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 20000,
    "tax": 0,
    "fee": 0,
    "net": 20000,
    "note": "Cash"
  },
  {
    "date": "2025-02-28",
    "item": "Kopi Arabica Sumbing",
    "category": "Bahan Baku",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Cash"
  },
  {
    "date": "2025-03-15",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-03-16",
    "item": "Kopi Arabica Ichamama",
    "category": "Bahan Baku",
    "gross": 85000,
    "tax": 0,
    "fee": 0,
    "net": 85000,
    "note": "Cash"
  },
  {
    "date": "2025-03-17",
    "item": "Kopi Arabica Konga",
    "category": "Bahan Baku",
    "gross": 85000,
    "tax": 0,
    "fee": 0,
    "net": 85000,
    "note": "Cash"
  },
  {
    "date": "2025-03-18",
    "item": "Kopi Arabica Tenjolaya",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Cash"
  },
  {
    "date": "2025-03-21",
    "item": "Espresso Beans Mantra",
    "category": "Bahan Baku",
    "gross": 231000,
    "tax": 0,
    "fee": 0,
    "net": 231000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-03-28",
    "item": "Kopi Arabica Dot Kejajar",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2025-03-29",
    "item": "Kopi Arabica Manglayang",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Cash"
  },
  {
    "date": "2025-03-30",
    "item": "Susu Greenfield 1 Box",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-04-07",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-04-07",
    "item": "Krimer Bubuk",
    "category": "Bahan Baku",
    "gross": 31000,
    "tax": 0,
    "fee": 0,
    "net": 31000,
    "note": "Cash"
  },
  {
    "date": "2025-04-07",
    "item": "Trash Bag",
    "category": "Lain-lain",
    "gross": 6000,
    "tax": 0,
    "fee": 0,
    "net": 6000,
    "note": "Cash"
  },
  {
    "date": "2025-04-10",
    "item": "Kopi Arabica Slukatan",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2025-04-11",
    "item": "Trash Bag",
    "category": "Lain-lain",
    "gross": 30000,
    "tax": 0,
    "fee": 0,
    "net": 30000,
    "note": "Cash"
  },
  {
    "date": "2025-04-11",
    "item": "Coklat Bubuk",
    "category": "Bahan Baku",
    "gross": 38000,
    "tax": 0,
    "fee": 0,
    "net": 38000,
    "note": "Cash"
  },
  {
    "date": "2025-04-12",
    "item": "Soklin",
    "category": "Lain-lain",
    "gross": 10000,
    "tax": 0,
    "fee": 0,
    "net": 10000,
    "note": "Cash"
  },
  {
    "date": "2025-04-22",
    "item": "Brazil Sweet Hazelnut Espresso",
    "category": "Bahan Baku",
    "gross": 264000,
    "tax": 0,
    "fee": 0,
    "net": 264000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-04-22",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 150000,
    "tax": 0,
    "fee": 0,
    "net": 150000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-04-22",
    "item": "Nusty Gum Espresso",
    "category": "Bahan Baku",
    "gross": 258000,
    "tax": 0,
    "fee": 0,
    "net": 258000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-04-22",
    "item": "Trieste Lavender Syrup",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-04-23",
    "item": "Greenfields Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-04-23",
    "item": "Kabel + Stop Kontak",
    "category": "Lain-lain",
    "gross": 88000,
    "tax": 0,
    "fee": 0,
    "net": 88000,
    "note": "Cash"
  },
  {
    "date": "2025-04-24",
    "item": "Kebersihan",
    "category": "Lain-lain",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Cash"
  },
  {
    "date": "2025-04-25",
    "item": "Tisu, Gula, Plastik Sampah",
    "category": "Lain-lain",
    "gross": 70000,
    "tax": 0,
    "fee": 0,
    "net": 70000,
    "note": "Cash"
  },
  {
    "date": "2025-05-01",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Cash"
  },
  {
    "date": "2025-05-02",
    "item": "Cookies",
    "category": "Bahan Baku",
    "gross": 60000,
    "tax": 0,
    "fee": 0,
    "net": 60000,
    "note": "Cash"
  },
  {
    "date": "2025-05-02",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Cash"
  },
  {
    "date": "2025-05-03",
    "item": "Arabica Lereng Dieng",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-04",
    "item": "Saka Prau",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-05",
    "item": "Keset + Klip",
    "category": "Lain-lain",
    "gross": 148000,
    "tax": 0,
    "fee": 0,
    "net": 148000,
    "note": "Cash"
  },
  {
    "date": "2025-05-06",
    "item": "Filter Beans",
    "category": "Bahan Baku",
    "gross": 212000,
    "tax": 0,
    "fee": 0,
    "net": 212000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-07",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 110000,
    "tax": 0,
    "fee": 0,
    "net": 110000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-08",
    "item": "Ichamama Filter Beans",
    "category": "Bahan Baku",
    "gross": 90000,
    "tax": 0,
    "fee": 0,
    "net": 90000,
    "note": "Cash"
  },
  {
    "date": "2025-05-09",
    "item": "Kreo Filter Beans",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-10",
    "item": "Greenfields Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-10",
    "item": "Es Batu",
    "category": "Bahan Baku",
    "gross": 10000,
    "tax": 0,
    "fee": 0,
    "net": 10000,
    "note": "Cash"
  },
  {
    "date": "2025-05-11",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Cash"
  },
  {
    "date": "2025-05-11",
    "item": "Espresso Beans 2kg",
    "category": "Bahan Baku",
    "gross": 530000,
    "tax": 0,
    "fee": 0,
    "net": 530000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-11",
    "item": "Spons",
    "category": "Lain-lain",
    "gross": 11000,
    "tax": 0,
    "fee": 0,
    "net": 11000,
    "note": "Cash"
  },
  {
    "date": "2025-05-12",
    "item": "Bowongso Filter Beans",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2025-05-12",
    "item": "Poster",
    "category": "Lain-lain",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Cash"
  },
  {
    "date": "2025-05-13",
    "item": "Espresso Beans 2kg",
    "category": "Bahan Baku",
    "gross": 507000,
    "tax": 0,
    "fee": 0,
    "net": 507000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-13",
    "item": "Greenfields Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-13",
    "item": "Kabel",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-25",
    "item": "Tenjolaya Filter Beans",
    "category": "Bahan Baku",
    "gross": 28000,
    "tax": 0,
    "fee": 0,
    "net": 28000,
    "note": "Cash"
  },
  {
    "date": "2025-05-25",
    "item": "Flor de cafe",
    "category": "Bahan Baku",
    "gross": 90000,
    "tax": 0,
    "fee": 0,
    "net": 90000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-25",
    "item": "Gelas",
    "category": "Lain-lain",
    "gross": 230000,
    "tax": 0,
    "fee": 0,
    "net": 230000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-25",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-26",
    "item": "Papper Filter",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-26",
    "item": "Distributor",
    "category": "Lain-lain",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-05-27",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Cash"
  },
  {
    "date": "2025-05-28",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2025-05-28",
    "item": "Coklat",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2025-06-01",
    "item": "Sapu",
    "category": "Lain-lain",
    "gross": 14000,
    "tax": 0,
    "fee": 0,
    "net": 14000,
    "note": "Cash"
  },
  {
    "date": "2025-06-02",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-03",
    "item": "Kebersihan",
    "category": "Lain-lain",
    "gross": 30000,
    "tax": 0,
    "fee": 0,
    "net": 30000,
    "note": "Cash"
  },
  {
    "date": "2025-06-04",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 165000,
    "tax": 0,
    "fee": 0,
    "net": 165000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-06",
    "item": "Elipse Geisha",
    "category": "Bahan Baku",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-06",
    "item": "Greenfields Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-06",
    "item": "Kedung Lesung",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-07",
    "item": "Mekarawangi Filter Beans",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-07",
    "item": "Sidamo Bensa Filter Beans",
    "category": "Bahan Baku",
    "gross": 85000,
    "tax": 0,
    "fee": 0,
    "net": 85000,
    "note": "Cash"
  },
  {
    "date": "2025-06-08",
    "item": "Air PDAM",
    "category": "Lain-lain",
    "gross": 43000,
    "tax": 0,
    "fee": 0,
    "net": 43000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-08",
    "item": "Filter Beans",
    "category": "Bahan Baku",
    "gross": 165000,
    "tax": 0,
    "fee": 0,
    "net": 165000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-08",
    "item": "Flor de cafe Filter Beans",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Cash"
  },
  {
    "date": "2025-06-09",
    "item": "Sirup",
    "category": "Bahan Baku",
    "gross": 110000,
    "tax": 0,
    "fee": 0,
    "net": 110000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-09",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-09",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 70000,
    "tax": 0,
    "fee": 0,
    "net": 70000,
    "note": "Cash"
  },
  {
    "date": "2025-06-10",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Cash"
  },
  {
    "date": "2025-06-17",
    "item": "Susu Greenfield 2 Kotak",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2025-06-18",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-20",
    "item": "Greenfields Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-21",
    "item": "Monochrome Espresso Jhons",
    "category": "Bahan Baku",
    "gross": 330000,
    "tax": 0,
    "fee": 0,
    "net": 330000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-21",
    "item": "Ribang Gayo, Kenya",
    "category": "Bahan Baku",
    "gross": 295000,
    "tax": 0,
    "fee": 0,
    "net": 295000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-22",
    "item": "Tisu",
    "category": "Lain-lain",
    "gross": 10000,
    "tax": 0,
    "fee": 0,
    "net": 10000,
    "note": "Cash"
  },
  {
    "date": "2025-06-22",
    "item": "Ethiopia Lalesa",
    "category": "Bahan Baku",
    "gross": 90000,
    "tax": 0,
    "fee": 0,
    "net": 90000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-22",
    "item": "Angin angin cranberry Hayati",
    "category": "Bahan Baku",
    "gross": 70000,
    "tax": 0,
    "fee": 0,
    "net": 70000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-23",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 42000,
    "tax": 0,
    "fee": 0,
    "net": 42000,
    "note": "Cash"
  },
  {
    "date": "2025-06-24",
    "item": "Espresso Cloud Catcher",
    "category": "Bahan Baku",
    "gross": 225000,
    "tax": 0,
    "fee": 0,
    "net": 225000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-25",
    "item": "Hayati Espresso",
    "category": "Bahan Baku",
    "gross": 215000,
    "tax": 0,
    "fee": 0,
    "net": 215000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-25",
    "item": "Flor de cafe",
    "category": "Bahan Baku",
    "gross": 90000,
    "tax": 0,
    "fee": 0,
    "net": 90000,
    "note": "Cash"
  },
  {
    "date": "2025-06-25",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-25",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 140000,
    "tax": 0,
    "fee": 0,
    "net": 140000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-29",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-30",
    "item": "Two Hand Full Beans",
    "category": "Bahan Baku",
    "gross": 582000,
    "tax": 0,
    "fee": 0,
    "net": 582000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-06-30",
    "item": "Greenfields Susu 2L",
    "category": "Bahan Baku",
    "gross": 65000,
    "tax": 0,
    "fee": 0,
    "net": 65000,
    "note": "Cash"
  },
  {
    "date": "2025-06-30",
    "item": "Greenfield Box",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-04",
    "item": "Ijen Filter Beans",
    "category": "Bahan Baku",
    "gross": 65000,
    "tax": 0,
    "fee": 0,
    "net": 65000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-06",
    "item": "Coklat",
    "category": "Bahan Baku",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-06",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-08",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-07-11",
    "item": "Pewangi",
    "category": "Lain-lain",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2025-07-11",
    "item": "Kebersihan",
    "category": "Lain-lain",
    "gross": 30000,
    "tax": 0,
    "fee": 0,
    "net": 30000,
    "note": "Cash"
  },
  {
    "date": "2025-07-12",
    "item": "Odysey Espresso",
    "category": "Bahan Baku",
    "gross": 304000,
    "tax": 0,
    "fee": 0,
    "net": 304000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-12",
    "item": "Plastik Es, Sampah",
    "category": "Lain-lain",
    "gross": 55000,
    "tax": 0,
    "fee": 0,
    "net": 55000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-12",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-14",
    "item": "Tanah Dieng Kopi",
    "category": "Bahan Baku",
    "gross": 260000,
    "tax": 0,
    "fee": 0,
    "net": 260000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-14",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-15",
    "item": "Gayo Choco Espresso",
    "category": "Bahan Baku",
    "gross": 441000,
    "tax": 0,
    "fee": 0,
    "net": 441000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-16",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-07-16",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-16",
    "item": "Susu 2 Kota",
    "category": "Bahan Baku",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Cash"
  },
  {
    "date": "2025-07-18",
    "item": "Greenfields 1 Box",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-19",
    "item": "Koeslan Cotton Candy Spro",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-19",
    "item": "Filter China Collins",
    "category": "Bahan Baku",
    "gross": 167000,
    "tax": 0,
    "fee": 0,
    "net": 167000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-19",
    "item": "Filter Kenya Gaithi",
    "category": "Bahan Baku",
    "gross": 167000,
    "tax": 0,
    "fee": 0,
    "net": 167000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-22",
    "item": "Karo Filter",
    "category": "Bahan Baku",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Cash"
  },
  {
    "date": "2025-07-22",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-22",
    "item": "Aren, Coklat, Krimer",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2025-07-23",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-07-24",
    "item": "Greenfields 1 Box",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-25",
    "item": "Papper Filter",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2025-07-26",
    "item": "Stiker",
    "category": "Lain-lain",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Cash"
  },
  {
    "date": "2025-07-27",
    "item": "Bimalukar Filter",
    "category": "Bahan Baku",
    "gross": 90000,
    "tax": 0,
    "fee": 0,
    "net": 90000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-27",
    "item": "Lavender Sirup",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-28",
    "item": "El Carizal Beans",
    "category": "Lain-lain",
    "gross": 150000,
    "tax": 0,
    "fee": 0,
    "net": 150000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-28",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-07-28",
    "item": "Kertas",
    "category": "Lain-lain",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-28",
    "item": "Tisu",
    "category": "Lain-lain",
    "gross": 32000,
    "tax": 0,
    "fee": 0,
    "net": 32000,
    "note": "Cash"
  },
  {
    "date": "2025-07-30",
    "item": "Sansat Modern Spro",
    "category": "Bahan Baku",
    "gross": 305000,
    "tax": 0,
    "fee": 0,
    "net": 305000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-30",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-30",
    "item": "Air PDAM",
    "category": "Lain-lain",
    "gross": 85000,
    "tax": 0,
    "fee": 0,
    "net": 85000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-30",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-30",
    "item": "Expat Espresso",
    "category": "Bahan Baku",
    "gross": 205000,
    "tax": 0,
    "fee": 0,
    "net": 205000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-30",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 110000,
    "tax": 0,
    "fee": 0,
    "net": 110000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-30",
    "item": "Filter Mor Mor",
    "category": "Bahan Baku",
    "gross": 135000,
    "tax": 0,
    "fee": 0,
    "net": 135000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-07-30",
    "item": "Filter Koeslan",
    "category": "Bahan Baku",
    "gross": 140000,
    "tax": 0,
    "fee": 0,
    "net": 140000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-02",
    "item": "Kebersihan",
    "category": "Lain-lain",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2025-08-03",
    "item": "Cheese Cake",
    "category": "Bahan Baku",
    "gross": 80000,
    "tax": 0,
    "fee": 0,
    "net": 80000,
    "note": "Cash"
  },
  {
    "date": "2025-08-04",
    "item": "Tanah Dieng Modern Spro",
    "category": "Bahan Baku",
    "gross": 320000,
    "tax": 0,
    "fee": 0,
    "net": 320000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-04",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-08-04",
    "item": "Stiker",
    "category": "Lain-lain",
    "gross": 35000,
    "tax": 0,
    "fee": 0,
    "net": 35000,
    "note": "Cash"
  },
  {
    "date": "2025-08-04",
    "item": "Greenfields",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-05",
    "item": "Plastik Sampah Besar",
    "category": "Lain-lain",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2025-08-06",
    "item": "Geisha Filter",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-06",
    "item": "El Carizal Beans",
    "category": "Bahan Baku",
    "gross": 135000,
    "tax": 0,
    "fee": 0,
    "net": 135000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-06",
    "item": "Dawuhan",
    "category": "Bahan Baku",
    "gross": 85000,
    "tax": 0,
    "fee": 0,
    "net": 85000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-06",
    "item": "Classic Spro (2)",
    "category": "Bahan Baku",
    "gross": 437000,
    "tax": 0,
    "fee": 0,
    "net": 437000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-06",
    "item": "Geisha Spro (2)",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-08",
    "item": "Cheese Cake",
    "category": "Bahan Baku",
    "gross": 115000,
    "tax": 0,
    "fee": 0,
    "net": 115000,
    "note": "Cash"
  },
  {
    "date": "2025-08-08",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-09",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-08-11",
    "item": "Aren",
    "category": "Bahan Baku",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2025-08-11",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Cash"
  },
  {
    "date": "2025-08-11",
    "item": "Plastik",
    "category": "Bahan Baku",
    "gross": 10000,
    "tax": 0,
    "fee": 0,
    "net": 10000,
    "note": "Cash"
  },
  {
    "date": "2025-08-11",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-08-11",
    "item": "Mad Scientist Spro 200gr",
    "category": "Bahan Baku",
    "gross": 105000,
    "tax": 0,
    "fee": 0,
    "net": 105000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-14",
    "item": "TBRK Filter",
    "category": "Bahan Baku",
    "gross": 232000,
    "tax": 0,
    "fee": 0,
    "net": 232000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-15",
    "item": "Roastbeanhood Filter",
    "category": "Bahan Baku",
    "gross": 105000,
    "tax": 0,
    "fee": 0,
    "net": 105000,
    "note": "Cash"
  },
  {
    "date": "2025-08-16",
    "item": "Papper Filter",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2025-08-17",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-17",
    "item": "Geisha",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-17",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-17",
    "item": "Instnc Espresso",
    "category": "Bahan Baku",
    "gross": 224000,
    "tax": 0,
    "fee": 0,
    "net": 224000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-17",
    "item": "Batre",
    "category": "Bahan Baku",
    "gross": 27000,
    "tax": 0,
    "fee": 0,
    "net": 27000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-17",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 105000,
    "tax": 0,
    "fee": 0,
    "net": 105000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-18",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-20",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-29",
    "item": "Krimer, Coklat",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Cash"
  },
  {
    "date": "2025-08-29",
    "item": "Roastbeanhood Filter",
    "category": "Bahan Baku",
    "gross": 105000,
    "tax": 0,
    "fee": 0,
    "net": 105000,
    "note": "Cash"
  },
  {
    "date": "2025-08-29",
    "item": "Greenfields",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-08-29",
    "item": "Espresso Modern",
    "category": "Bahan Baku",
    "gross": 320000,
    "tax": 0,
    "fee": 0,
    "net": 320000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-08-29",
    "item": "Stiker",
    "category": "Lain-lain",
    "gross": 85000,
    "tax": 0,
    "fee": 0,
    "net": 85000,
    "note": "Cash"
  },
  {
    "date": "2025-09-12",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-09-12",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-09-12",
    "item": "Tisu",
    "category": "Lain-lain",
    "gross": 22000,
    "tax": 0,
    "fee": 0,
    "net": 22000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-09-13",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-09-13",
    "item": "Roastbeanhood Filter",
    "category": "Bahan Baku",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Cash"
  },
  {
    "date": "2025-09-14",
    "item": "Plastik Bag Besar",
    "category": "Bahan Baku",
    "gross": 65000,
    "tax": 0,
    "fee": 0,
    "net": 65000,
    "note": "Cash"
  },
  {
    "date": "2025-09-14",
    "item": "Filter Dot",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2025-09-14",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-09-14",
    "item": "Greenfields Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-09-14",
    "item": "Roastbeanhood Filter",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2025-09-14",
    "item": "Roastbeanhood Espresso",
    "category": "Bahan Baku",
    "gross": 300000,
    "tax": 0,
    "fee": 0,
    "net": 300000,
    "note": "Cash"
  },
  {
    "date": "2025-09-15",
    "item": "Modern Espresso",
    "category": "Bahan Baku",
    "gross": 320000,
    "tax": 0,
    "fee": 0,
    "net": 320000,
    "note": "Cash"
  },
  {
    "date": "2025-09-15",
    "item": "Papper Filter",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2025-09-15",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-09-16",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 90000,
    "tax": 0,
    "fee": 0,
    "net": 90000,
    "note": "Cash"
  },
  {
    "date": "2025-09-16",
    "item": "Aren",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2025-09-16",
    "item": "Coklat",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2025-09-17",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-09-17",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-09-17",
    "item": "Filter Arosta",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Cash"
  },
  {
    "date": "2025-09-17",
    "item": "Roastbeanhood Filter",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Cash"
  },
  {
    "date": "2025-09-19",
    "item": "Greenfields Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-09-19",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-09-20",
    "item": "Stiker",
    "category": "Lain-lain",
    "gross": 124000,
    "tax": 0,
    "fee": 0,
    "net": 124000,
    "note": "Cash"
  },
  {
    "date": "2025-09-20",
    "item": "Galon Cleo",
    "category": "Bahan Baku",
    "gross": 18000,
    "tax": 0,
    "fee": 0,
    "net": 18000,
    "note": "Cash"
  },
  {
    "date": "2025-09-20",
    "item": "Galon Amidis",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-09-21",
    "item": "Espresso Modern",
    "category": "Bahan Baku",
    "gross": 640000,
    "tax": 0,
    "fee": 0,
    "net": 640000,
    "note": "Cash"
  },
  {
    "date": "2025-09-21",
    "item": "Es Batu",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-09-21",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 125000,
    "tax": 0,
    "fee": 0,
    "net": 125000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-09-21",
    "item": "Arosta Filter",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2025-09-21",
    "item": "Krimer + Coklat",
    "category": "Bahan Baku",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Cash"
  },
  {
    "date": "2025-09-22",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 350000,
    "tax": 0,
    "fee": 0,
    "net": 350000,
    "note": "Cash"
  },
  {
    "date": "2025-09-22",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-09-22",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-09-23",
    "item": "Plastik Sampah Besar",
    "category": "Lain-lain",
    "gross": 39000,
    "tax": 0,
    "fee": 0,
    "net": 39000,
    "note": "Cash"
  },
  {
    "date": "2025-09-23",
    "item": "Aren",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2025-09-24",
    "item": "Filter Tokped",
    "category": "Bahan Baku",
    "gross": 270000,
    "tax": 0,
    "fee": 0,
    "net": 270000,
    "note": "Cash"
  },
  {
    "date": "2025-09-24",
    "item": "Filter Dot",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2025-09-24",
    "item": "Filter Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 125000,
    "tax": 0,
    "fee": 0,
    "net": 125000,
    "note": "Cash"
  },
  {
    "date": "2025-09-24",
    "item": "Papper Filter",
    "category": "Bahan Baku",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Cash"
  },
  {
    "date": "2025-09-26",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-09-26",
    "item": "Karyawan Parttime",
    "category": "Karyawan",
    "gross": 235000,
    "tax": 0,
    "fee": 0,
    "net": 235000,
    "note": "Cash"
  },
  {
    "date": "2025-09-26",
    "item": "Filter Bean Banter",
    "category": "Bahan Baku",
    "gross": 250000,
    "tax": 0,
    "fee": 0,
    "net": 250000,
    "note": "Cash"
  },
  {
    "date": "2025-09-26",
    "item": "Pembersih",
    "category": "Lain-lain",
    "gross": 18000,
    "tax": 0,
    "fee": 0,
    "net": 18000,
    "note": "Cash"
  },
  {
    "date": "2025-09-26",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-09-27",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-09-27",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-09-27",
    "item": "Sirup",
    "category": "Bahan Baku",
    "gross": 125000,
    "tax": 0,
    "fee": 0,
    "net": 125000,
    "note": "Cash"
  },
  {
    "date": "2025-09-27",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2025-09-28",
    "item": "Filter Arosta",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Cash"
  },
  {
    "date": "2025-09-28",
    "item": "Filter Roastbeanhood",
    "category": "Bahan Baku",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Cash"
  },
  {
    "date": "2025-09-28",
    "item": "Filter Mr.x",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Cash"
  },
  {
    "date": "2025-09-28",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-09-29",
    "item": "Galon Cleo",
    "category": "Bahan Baku",
    "gross": 19000,
    "tax": 0,
    "fee": 0,
    "net": 19000,
    "note": "Cash"
  },
  {
    "date": "2025-09-29",
    "item": "Galon Amidis",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-09-29",
    "item": "Krimer + Coklat",
    "category": "Bahan Baku",
    "gross": 167000,
    "tax": 0,
    "fee": 0,
    "net": 167000,
    "note": "Cash"
  },
  {
    "date": "2025-09-29",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-09-29",
    "item": "Modern Espresso",
    "category": "Bahan Baku",
    "gross": 640000,
    "tax": 0,
    "fee": 0,
    "net": 640000,
    "note": "Cash"
  },
  {
    "date": "2025-09-29",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 210000,
    "tax": 0,
    "fee": 0,
    "net": 210000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-09-30",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-09-30",
    "item": "Payroll Bahan Baku Tokped",
    "category": "Bahan Baku",
    "gross": 1794000,
    "tax": 0,
    "fee": 0,
    "net": 1794000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-09-30",
    "item": "Hayati Beans",
    "category": "Bahan Baku",
    "gross": 666000,
    "tax": 0,
    "fee": 0,
    "net": 666000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-09-30",
    "item": "Herd Beans",
    "category": "Bahan Baku",
    "gross": 375000,
    "tax": 0,
    "fee": 0,
    "net": 375000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-01",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-03",
    "item": "Wayang Filter",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Cash"
  },
  {
    "date": "2025-10-03",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-03",
    "item": "Gayo FIilter",
    "category": "Bahan Baku",
    "gross": 110000,
    "tax": 0,
    "fee": 0,
    "net": 110000,
    "note": "Cash"
  },
  {
    "date": "2025-10-04",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-04",
    "item": "Greenfields 1 Box",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-10-04",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 144000,
    "tax": 0,
    "fee": 0,
    "net": 144000,
    "note": "Cash"
  },
  {
    "date": "2025-10-04",
    "item": "Sedotan + Arem",
    "category": "Bahan Baku",
    "gross": 35000,
    "tax": 0,
    "fee": 0,
    "net": 35000,
    "note": "Cash"
  },
  {
    "date": "2025-10-05",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-05",
    "item": "Filter Makmur Jaya",
    "category": "Bahan Baku",
    "gross": 264000,
    "tax": 0,
    "fee": 0,
    "net": 264000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-05",
    "item": "Filter Mormor",
    "category": "Bahan Baku",
    "gross": 103000,
    "tax": 0,
    "fee": 0,
    "net": 103000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-05",
    "item": "Filter Courious People",
    "category": "Bahan Baku",
    "gross": 130000,
    "tax": 0,
    "fee": 0,
    "net": 130000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-06",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-06",
    "item": "Sirup Dripp Vanilla",
    "category": "Bahan Baku",
    "gross": 125000,
    "tax": 0,
    "fee": 0,
    "net": 125000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-06",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-06",
    "item": "Krimer + Coklat",
    "category": "Bahan Baku",
    "gross": 163000,
    "tax": 0,
    "fee": 0,
    "net": 163000,
    "note": "Cash"
  },
  {
    "date": "2025-10-06",
    "item": "Filter Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Cash"
  },
  {
    "date": "2025-10-07",
    "item": "Greenfields 1 Box",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-10-07",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-07",
    "item": "Filter Dot",
    "category": "Bahan Baku",
    "gross": 65000,
    "tax": 0,
    "fee": 0,
    "net": 65000,
    "note": "Cash"
  },
  {
    "date": "2025-10-07",
    "item": "Filter Roastbeanhood",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2025-10-07",
    "item": "Tisu",
    "category": "Lain-lain",
    "gross": 13000,
    "tax": 0,
    "fee": 0,
    "net": 13000,
    "note": "Cash"
  },
  {
    "date": "2025-10-08",
    "item": "Classic Spro (3)",
    "category": "Bahan Baku",
    "gross": 706000,
    "tax": 0,
    "fee": 0,
    "net": 706000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-08",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-08",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-10-09",
    "item": "Cloudcather Spro",
    "category": "Bahan Baku",
    "gross": 348000,
    "tax": 0,
    "fee": 0,
    "net": 348000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-09",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-10",
    "item": "Greenfields 1 Box",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-10-10",
    "item": "Cup",
    "category": "Lain-lain",
    "gross": 350000,
    "tax": 0,
    "fee": 0,
    "net": 350000,
    "note": "Cash"
  },
  {
    "date": "2025-10-10",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-11",
    "item": "Arosta Filter",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Cash"
  },
  {
    "date": "2025-10-11",
    "item": "Papper Filter",
    "category": "Bahan Baku",
    "gross": 174000,
    "tax": 0,
    "fee": 0,
    "net": 174000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-11",
    "item": "Krimer + Aren",
    "category": "Bahan Baku",
    "gross": 118000,
    "tax": 0,
    "fee": 0,
    "net": 118000,
    "note": "Cash"
  },
  {
    "date": "2025-10-11",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 276000,
    "tax": 0,
    "fee": 0,
    "net": 276000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-12",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-12",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 18000,
    "tax": 0,
    "fee": 0,
    "net": 18000,
    "note": "Cash"
  },
  {
    "date": "2025-10-12",
    "item": "Gaji Parttime",
    "category": "Karyawan",
    "gross": 245000,
    "tax": 0,
    "fee": 0,
    "net": 245000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-13",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-13",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-10-13",
    "item": "Sirup Lavender",
    "category": "Bahan Baku",
    "gross": 165000,
    "tax": 0,
    "fee": 0,
    "net": 165000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-13",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 125000,
    "tax": 0,
    "fee": 0,
    "net": 125000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-13",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-10-13",
    "item": "Espresso Modern",
    "category": "Bahan Baku",
    "gross": 640000,
    "tax": 0,
    "fee": 0,
    "net": 640000,
    "note": "Cash"
  },
  {
    "date": "2025-10-14",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-14",
    "item": "Bean Banter Beans",
    "category": "Bahan Baku",
    "gross": 410000,
    "tax": 0,
    "fee": 0,
    "net": 410000,
    "note": "Cash"
  },
  {
    "date": "2025-10-15",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-15",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2025-10-16",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-16",
    "item": "Greenfields Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-17",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-17",
    "item": "Kebersihan",
    "category": "Lain-lain",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2025-10-17",
    "item": "Filter Stlerep",
    "category": "Bahan Baku",
    "gross": 90000,
    "tax": 0,
    "fee": 0,
    "net": 90000,
    "note": "Cash"
  },
  {
    "date": "2025-10-18",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-18",
    "item": "Coklat, Krimer, Aren",
    "category": "Bahan Baku",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Cash"
  },
  {
    "date": "2025-10-18",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2025-10-18",
    "item": "Geisha Filter",
    "category": "Bahan Baku",
    "gross": 175000,
    "tax": 0,
    "fee": 0,
    "net": 175000,
    "note": "Cash"
  },
  {
    "date": "2025-10-18",
    "item": "Filter Tokped",
    "category": "Bahan Baku",
    "gross": 900000,
    "tax": 0,
    "fee": 0,
    "net": 900000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-19",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-19",
    "item": "Filter Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 90000,
    "tax": 0,
    "fee": 0,
    "net": 90000,
    "note": "Cash"
  },
  {
    "date": "2025-10-19",
    "item": "Gaji Yasar",
    "category": "Karyawan",
    "gross": 1000000,
    "tax": 0,
    "fee": 0,
    "net": 1000000,
    "note": "Cash"
  },
  {
    "date": "2025-10-20",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-20",
    "item": "Spro Classic",
    "category": "Bahan Baku",
    "gross": 250000,
    "tax": 0,
    "fee": 0,
    "net": 250000,
    "note": "Cash"
  },
  {
    "date": "2025-10-20",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-10-20",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 70000,
    "tax": 0,
    "fee": 0,
    "net": 70000,
    "note": "Cash"
  },
  {
    "date": "2025-10-21",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-21",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-10-22",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-22",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 125000,
    "tax": 0,
    "fee": 0,
    "net": 125000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-23",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-23",
    "item": "Espresso Modern",
    "category": "Bahan Baku",
    "gross": 640000,
    "tax": 0,
    "fee": 0,
    "net": 640000,
    "note": "Cash"
  },
  {
    "date": "2025-10-25",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-25",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-10-25",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-10-26",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-26",
    "item": "Salary Sijo",
    "category": "Karyawan",
    "gross": 405000,
    "tax": 0,
    "fee": 0,
    "net": 405000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-26",
    "item": "Espresso Classic",
    "category": "Bahan Baku",
    "gross": 396000,
    "tax": 0,
    "fee": 0,
    "net": 396000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-26",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-26",
    "item": "Krimer + Coklat",
    "category": "Bahan Baku",
    "gross": 163000,
    "tax": 0,
    "fee": 0,
    "net": 163000,
    "note": "Cash"
  },
  {
    "date": "2025-10-26",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 235000,
    "tax": 0,
    "fee": 0,
    "net": 235000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-27",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-27",
    "item": "SKM",
    "category": "Bahan Baku",
    "gross": 20000,
    "tax": 0,
    "fee": 0,
    "net": 20000,
    "note": "Cash"
  },
  {
    "date": "2025-10-28",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-28",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 125000,
    "tax": 0,
    "fee": 0,
    "net": 125000,
    "note": "Cash"
  },
  {
    "date": "2025-10-28",
    "item": "Greenfields Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-10-28",
    "item": "Aren",
    "category": "Bahan Baku",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2025-10-29",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-29",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-10-29",
    "item": "Hayati Beans",
    "category": "Bahan Baku",
    "gross": 143000,
    "tax": 0,
    "fee": 0,
    "net": 143000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-29",
    "item": "Creator Filter",
    "category": "Bahan Baku",
    "gross": 80000,
    "tax": 0,
    "fee": 0,
    "net": 80000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-29",
    "item": "Koeslan Spro",
    "category": "Bahan Baku",
    "gross": 385000,
    "tax": 0,
    "fee": 0,
    "net": 385000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-29",
    "item": "Sirup Cinnamon",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Cash"
  },
  {
    "date": "2025-10-31",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-10-31",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2025-10-31",
    "item": "Filter Coffee",
    "category": "Bahan Baku",
    "gross": 235000,
    "tax": 0,
    "fee": 0,
    "net": 235000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-31",
    "item": "Greenfields",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-10-31",
    "item": "Espresso Hayati",
    "category": "Bahan Baku",
    "gross": 250000,
    "tax": 0,
    "fee": 0,
    "net": 250000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-10-31",
    "item": "Cup Plastik",
    "category": "Bahan Baku",
    "gross": 340000,
    "tax": 0,
    "fee": 0,
    "net": 340000,
    "note": "Cash"
  },
  {
    "date": "2025-11-02",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-02",
    "item": "Krimer+Coklat+Aren",
    "category": "Bahan Baku",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Cash"
  },
  {
    "date": "2025-11-03",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-04",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-04",
    "item": "Spro Classic",
    "category": "Bahan Baku",
    "gross": 250000,
    "tax": 0,
    "fee": 0,
    "net": 250000,
    "note": "Cash"
  },
  {
    "date": "2025-11-05",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-05",
    "item": "Spro Classic",
    "category": "Bahan Baku",
    "gross": 632000,
    "tax": 0,
    "fee": 0,
    "net": 632000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-05",
    "item": "Spro Modern",
    "category": "Bahan Baku",
    "gross": 640000,
    "tax": 0,
    "fee": 0,
    "net": 640000,
    "note": "Cash"
  },
  {
    "date": "2025-11-07",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-07",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-11-07",
    "item": "Susu + Sirup",
    "category": "Bahan Baku",
    "gross": 350000,
    "tax": 0,
    "fee": 0,
    "net": 350000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-08",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-08",
    "item": "Krimer, Coklat",
    "category": "Bahan Baku",
    "gross": 119000,
    "tax": 0,
    "fee": 0,
    "net": 119000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-09",
    "item": "Filter Beans",
    "category": "Bahan Baku",
    "gross": 536000,
    "tax": 0,
    "fee": 0,
    "net": 536000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-09",
    "item": "Parttime",
    "category": "Karyawan",
    "gross": 500000,
    "tax": 0,
    "fee": 0,
    "net": 500000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-09",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-11-09",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-10",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-10",
    "item": "Papper Filter",
    "category": "Bahan Baku",
    "gross": 167000,
    "tax": 0,
    "fee": 0,
    "net": 167000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-10",
    "item": "Filter Bean Banter",
    "category": "Bahan Baku",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Cash"
  },
  {
    "date": "2025-11-10",
    "item": "Filter Tokped",
    "category": "Bahan Baku",
    "gross": 258000,
    "tax": 0,
    "fee": 0,
    "net": 258000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-11",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-11",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 93000,
    "tax": 0,
    "fee": 0,
    "net": 93000,
    "note": "Cash"
  },
  {
    "date": "2025-11-12",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-12",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 262000,
    "tax": 0,
    "fee": 0,
    "net": 262000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-12",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-11-13",
    "item": "Spro Classic",
    "category": "Bahan Baku",
    "gross": 466000,
    "tax": 0,
    "fee": 0,
    "net": 466000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-13",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-13",
    "item": "Kebersihan",
    "category": "Lain-lain",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2025-11-13",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-15",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-15",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-11-15",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-11-16",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-16",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 44000,
    "tax": 0,
    "fee": 0,
    "net": 44000,
    "note": "Cash"
  },
  {
    "date": "2025-11-16",
    "item": "Coklat",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2025-11-16",
    "item": "Aren",
    "category": "Bahan Baku",
    "gross": 17000,
    "tax": 0,
    "fee": 0,
    "net": 17000,
    "note": "Cash"
  },
  {
    "date": "2025-11-16",
    "item": "MorMor Spro",
    "category": "Bahan Baku",
    "gross": 350000,
    "tax": 0,
    "fee": 0,
    "net": 350000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-16",
    "item": "SnB Filter",
    "category": "Bahan Baku",
    "gross": 85000,
    "tax": 0,
    "fee": 0,
    "net": 85000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-16",
    "item": "Spro Modern",
    "category": "Bahan Baku",
    "gross": 640000,
    "tax": 0,
    "fee": 0,
    "net": 640000,
    "note": "Cash"
  },
  {
    "date": "2025-11-17",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-17",
    "item": "BB Nansebo",
    "category": "Bahan Baku",
    "gross": 185000,
    "tax": 0,
    "fee": 0,
    "net": 185000,
    "note": "Cash"
  },
  {
    "date": "2025-11-18",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 340000,
    "tax": 0,
    "fee": 0,
    "net": 340000,
    "note": "Cash"
  },
  {
    "date": "2025-11-18",
    "item": "FIlter ARosta",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Cash"
  },
  {
    "date": "2025-11-18",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-18",
    "item": "Spro Classic",
    "category": "Bahan Baku",
    "gross": 502000,
    "tax": 0,
    "fee": 0,
    "net": 502000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-18",
    "item": "Frother",
    "category": "Lain-lain",
    "gross": 93000,
    "tax": 0,
    "fee": 0,
    "net": 93000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-19",
    "item": "Papper Cup",
    "category": "Bahan Baku",
    "gross": 17000,
    "tax": 0,
    "fee": 0,
    "net": 17000,
    "note": "Cash"
  },
  {
    "date": "2025-11-19",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-19",
    "item": "Greenfields",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2025-11-19",
    "item": "Krimer, Coklat, Aren",
    "category": "Bahan Baku",
    "gross": 180000,
    "tax": 0,
    "fee": 0,
    "net": 180000,
    "note": "Cash"
  },
  {
    "date": "2025-11-20",
    "item": "Gaji Parttime",
    "category": "Karyawan",
    "gross": 550000,
    "tax": 0,
    "fee": 0,
    "net": 550000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-20",
    "item": "Spotify",
    "category": "Lain-lain",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-20",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-20",
    "item": "Beans Lokal",
    "category": "Bahan Baku",
    "gross": 394000,
    "tax": 0,
    "fee": 0,
    "net": 394000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-20",
    "item": "Beans Global",
    "category": "Bahan Baku",
    "gross": 340000,
    "tax": 0,
    "fee": 0,
    "net": 340000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-20",
    "item": "Sirup Lavender",
    "category": "Bahan Baku",
    "gross": 180000,
    "tax": 0,
    "fee": 0,
    "net": 180000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-21",
    "item": "Gaji Parttime",
    "category": "Karyawan",
    "gross": 550000,
    "tax": 0,
    "fee": 0,
    "net": 550000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-21",
    "item": "Spotify",
    "category": "Lain-lain",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-21",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-21",
    "item": "Sirup Lavender",
    "category": "Bahan Baku",
    "gross": 80000,
    "tax": 0,
    "fee": 0,
    "net": 80000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-21",
    "item": "Beans Lokal",
    "category": "Bahan Baku",
    "gross": 394000,
    "tax": 0,
    "fee": 0,
    "net": 394000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-21",
    "item": "Beans Global",
    "category": "Bahan Baku",
    "gross": 340000,
    "tax": 0,
    "fee": 0,
    "net": 340000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-22",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-22",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-11-22",
    "item": "Plastik Sampah Besar",
    "category": "Lain-lain",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Cash"
  },
  {
    "date": "2025-11-23",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 263000,
    "tax": 0,
    "fee": 0,
    "net": 263000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-23",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2025-11-23",
    "item": "Filter Dot",
    "category": "Bahan Baku",
    "gross": 195000,
    "tax": 0,
    "fee": 0,
    "net": 195000,
    "note": "Cash"
  },
  {
    "date": "2025-11-23",
    "item": "Filter Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 125000,
    "tax": 0,
    "fee": 0,
    "net": 125000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-23",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-23",
    "item": "Kabel",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2025-11-23",
    "item": "Filter BB",
    "category": "Bahan Baku",
    "gross": 180000,
    "tax": 0,
    "fee": 0,
    "net": 180000,
    "note": "Cash"
  },
  {
    "date": "2025-11-23",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-11-24",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-24",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2025-11-24",
    "item": "Filter Roastbeanhood",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2025-11-24",
    "item": "Filter Toko Kopi 58",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-25",
    "item": "Coklat",
    "category": "Bahan Baku",
    "gross": 88000,
    "tax": 0,
    "fee": 0,
    "net": 88000,
    "note": "Cash"
  },
  {
    "date": "2025-11-25",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2025-11-25",
    "item": "Spro Classic (6)",
    "category": "Bahan Baku",
    "gross": 165000,
    "tax": 0,
    "fee": 0,
    "net": 165000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-25",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2025-11-25",
    "item": "Kabel",
    "category": "Lain-lain",
    "gross": 70000,
    "tax": 0,
    "fee": 0,
    "net": 70000,
    "note": "Cash"
  },
  {
    "date": "2025-11-26",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-26",
    "item": "Galon Cleo",
    "category": "Bahan Baku",
    "gross": 19000,
    "tax": 0,
    "fee": 0,
    "net": 19000,
    "note": "Cash"
  },
  {
    "date": "2025-11-26",
    "item": "Galon Amidis",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Cash"
  },
  {
    "date": "2025-11-26",
    "item": "Susu + Sirup",
    "category": "Bahan Baku",
    "gross": 350000,
    "tax": 0,
    "fee": 0,
    "net": 350000,
    "note": "Cash"
  },
  {
    "date": "2025-11-28",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-28",
    "item": "Spro BB",
    "category": "Bahan Baku",
    "gross": 180000,
    "tax": 0,
    "fee": 0,
    "net": 180000,
    "note": "Cash"
  },
  {
    "date": "2025-11-29",
    "item": "Spro Classic",
    "category": "Bahan Baku",
    "gross": 250000,
    "tax": 0,
    "fee": 0,
    "net": 250000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-29",
    "item": "Spro Modern",
    "category": "Bahan Baku",
    "gross": 320000,
    "tax": 0,
    "fee": 0,
    "net": 320000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-29",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Cash"
  },
  {
    "date": "2025-11-29",
    "item": "Aren",
    "category": "Bahan Baku",
    "gross": 18000,
    "tax": 0,
    "fee": 0,
    "net": 18000,
    "note": "Cash"
  },
  {
    "date": "2025-11-29",
    "item": "Papper Filter",
    "category": "Bahan Baku",
    "gross": 165000,
    "tax": 0,
    "fee": 0,
    "net": 165000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-30",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-11-30",
    "item": "Gaji Fulltime",
    "category": "Karyawan",
    "gross": 2500000,
    "tax": 0,
    "fee": 0,
    "net": 2500000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-30",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-30",
    "item": "Espresso Modern",
    "category": "Bahan Baku",
    "gross": 750000,
    "tax": 0,
    "fee": 0,
    "net": 750000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-11-30",
    "item": "Cup Packaging",
    "category": "Bahan Baku",
    "gross": 340000,
    "tax": 0,
    "fee": 0,
    "net": 340000,
    "note": "Cash"
  },
  {
    "date": "2025-11-30",
    "item": "FIlter Arosta",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Cash"
  },
  {
    "date": "2025-11-30",
    "item": "Filter Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-01",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-02",
    "item": "Krimer(2), Coklat(1), Aren",
    "category": "Bahan Baku",
    "gross": 198000,
    "tax": 0,
    "fee": 0,
    "net": 198000,
    "note": "Cash"
  },
  {
    "date": "2025-12-03",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-03",
    "item": "Pembersih",
    "category": "Lain-lain",
    "gross": 37000,
    "tax": 0,
    "fee": 0,
    "net": 37000,
    "note": "Cash"
  },
  {
    "date": "2025-12-03",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-12-03",
    "item": "Kombucha",
    "category": "Bahan Baku",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Cash"
  },
  {
    "date": "2025-12-03",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-12-04",
    "item": "Filter everchaos",
    "category": "Bahan Baku",
    "gross": 254000,
    "tax": 0,
    "fee": 0,
    "net": 254000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-04",
    "item": "Filter Moodmaker",
    "category": "Bahan Baku",
    "gross": 245000,
    "tax": 0,
    "fee": 0,
    "net": 245000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-05",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-05",
    "item": "Krimer(2), Coklat(1), Aren(2)",
    "category": "Bahan Baku",
    "gross": 136000,
    "tax": 0,
    "fee": 0,
    "net": 136000,
    "note": "Cash"
  },
  {
    "date": "2025-12-06",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-06",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-12-06",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Cash"
  },
  {
    "date": "2025-12-07",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-08",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-08",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Cash"
  },
  {
    "date": "2025-12-08",
    "item": "Krimer(2), Cokat(1), Aren(2)",
    "category": "Bahan Baku",
    "gross": 136000,
    "tax": 0,
    "fee": 0,
    "net": 136000,
    "note": "Cash"
  },
  {
    "date": "2025-12-09",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-09",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-12-09",
    "item": "BB Spro",
    "category": "Bahan Baku",
    "gross": 160000,
    "tax": 0,
    "fee": 0,
    "net": 160000,
    "note": "Cash"
  },
  {
    "date": "2025-12-10",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-10",
    "item": "Modern Spro (2)",
    "category": "Bahan Baku",
    "gross": 700000,
    "tax": 0,
    "fee": 0,
    "net": 700000,
    "note": "Cash"
  },
  {
    "date": "2025-12-10",
    "item": "Classic Spro (1)",
    "category": "Bahan Baku",
    "gross": 250000,
    "tax": 0,
    "fee": 0,
    "net": 250000,
    "note": "Cash"
  },
  {
    "date": "2025-12-12",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-12",
    "item": "Krimer(2), Aren(2)",
    "category": "Bahan Baku",
    "gross": 98000,
    "tax": 0,
    "fee": 0,
    "net": 98000,
    "note": "Cash"
  },
  {
    "date": "2025-12-13",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-13",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2025-12-13",
    "item": "Sirup",
    "category": "Bahan Baku",
    "gross": 110000,
    "tax": 0,
    "fee": 0,
    "net": 110000,
    "note": "Cash"
  },
  {
    "date": "2025-12-13",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-12-14",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-14",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-12-14",
    "item": "Tokped Beans",
    "category": "Bahan Baku",
    "gross": 725000,
    "tax": 0,
    "fee": 0,
    "net": 725000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-14",
    "item": "Filter Sweetpoison",
    "category": "Bahan Baku",
    "gross": 350000,
    "tax": 0,
    "fee": 0,
    "net": 350000,
    "note": "Cash"
  },
  {
    "date": "2025-12-14",
    "item": "Krimer(2), Aren(4), Coklat(2)",
    "category": "Bahan Baku",
    "gross": 203000,
    "tax": 0,
    "fee": 0,
    "net": 203000,
    "note": "Cash"
  },
  {
    "date": "2025-12-14",
    "item": "Kebersihan",
    "category": "Lain-lain",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2025-12-15",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-15",
    "item": "BB Beans",
    "category": "Bahan Baku",
    "gross": 170000,
    "tax": 0,
    "fee": 0,
    "net": 170000,
    "note": "Cash"
  },
  {
    "date": "2025-12-15",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-12-16",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-16",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 340000,
    "tax": 0,
    "fee": 0,
    "net": 340000,
    "note": "Cash"
  },
  {
    "date": "2025-12-16",
    "item": "Krimer(2)",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2025-12-17",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-17",
    "item": "Stiker",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Cash"
  },
  {
    "date": "2025-12-17",
    "item": "Spro Classic (3)",
    "category": "Bahan Baku",
    "gross": 750000,
    "tax": 0,
    "fee": 0,
    "net": 750000,
    "note": "Cash"
  },
  {
    "date": "2025-12-17",
    "item": "Susu (2)",
    "category": "Bahan Baku",
    "gross": 480000,
    "tax": 0,
    "fee": 0,
    "net": 480000,
    "note": "Cash"
  },
  {
    "date": "2025-12-18",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-18",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-12-18",
    "item": "Batre",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-12-18",
    "item": "Papper + Lavender",
    "category": "Bahan Baku",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-20",
    "item": "Sirup",
    "category": "Bahan Baku",
    "gross": 125000,
    "tax": 0,
    "fee": 0,
    "net": 125000,
    "note": "Cash"
  },
  {
    "date": "2025-12-20",
    "item": "Spro Modern",
    "category": "Bahan Baku",
    "gross": 700000,
    "tax": 0,
    "fee": 0,
    "net": 700000,
    "note": "Cash"
  },
  {
    "date": "2025-12-20",
    "item": "BB Filter",
    "category": "Bahan Baku",
    "gross": 85000,
    "tax": 0,
    "fee": 0,
    "net": 85000,
    "note": "Cash"
  },
  {
    "date": "2025-12-20",
    "item": "Krimer(2), Aren(3), Coklat(2)",
    "category": "Bahan Baku",
    "gross": 215000,
    "tax": 0,
    "fee": 0,
    "net": 215000,
    "note": "Cash"
  },
  {
    "date": "2025-12-20",
    "item": "Gaji Parttime",
    "category": "Karyawan",
    "gross": 650000,
    "tax": 0,
    "fee": 0,
    "net": 650000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-21",
    "item": "Es(3)",
    "category": "Bahan Baku",
    "gross": 36000,
    "tax": 0,
    "fee": 0,
    "net": 36000,
    "note": "Cash"
  },
  {
    "date": "2025-12-21",
    "item": "BB Beans",
    "category": "Bahan Baku",
    "gross": 85000,
    "tax": 0,
    "fee": 0,
    "net": 85000,
    "note": "Cash"
  },
  {
    "date": "2025-12-22",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-22",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-12-22",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2025-12-22",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-12-23",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-23",
    "item": "Service Stand",
    "category": "Lain-lain",
    "gross": 70000,
    "tax": 0,
    "fee": 0,
    "net": 70000,
    "note": "Cash"
  },
  {
    "date": "2025-12-23",
    "item": "Beans Tokped",
    "category": "Bahan Baku",
    "gross": 313000,
    "tax": 0,
    "fee": 0,
    "net": 313000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-24",
    "item": "Arosta Filter",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2025-12-24",
    "item": "Spro Classic",
    "category": "Bahan Baku",
    "gross": 750000,
    "tax": 0,
    "fee": 0,
    "net": 750000,
    "note": "Cash"
  },
  {
    "date": "2025-12-24",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-12-24",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2025-12-24",
    "item": "Service Kran",
    "category": "Lain-lain",
    "gross": 160000,
    "tax": 0,
    "fee": 0,
    "net": 160000,
    "note": "Cash"
  },
  {
    "date": "2025-12-24",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 125000,
    "tax": 0,
    "fee": 0,
    "net": 125000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-26",
    "item": "Krimer, Coklat, Aren",
    "category": "Bahan Baku",
    "gross": 150000,
    "tax": 0,
    "fee": 0,
    "net": 150000,
    "note": "Cash"
  },
  {
    "date": "2025-12-26",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 256000,
    "tax": 0,
    "fee": 0,
    "net": 256000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-26",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-27",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 480000,
    "tax": 0,
    "fee": 0,
    "net": 480000,
    "note": "Cash"
  },
  {
    "date": "2025-12-27",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-28",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2025-12-28",
    "item": "BB Spro",
    "category": "Bahan Baku",
    "gross": 195000,
    "tax": 0,
    "fee": 0,
    "net": 195000,
    "note": "Cash"
  },
  {
    "date": "2025-12-28",
    "item": "Krimer + Coklat",
    "category": "Bahan Baku",
    "gross": 215000,
    "tax": 0,
    "fee": 0,
    "net": 215000,
    "note": "Cash"
  },
  {
    "date": "2025-12-29",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2025-12-29",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 340000,
    "tax": 0,
    "fee": 0,
    "net": 340000,
    "note": "Cash"
  },
  {
    "date": "2025-12-29",
    "item": "Papper + Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 330000,
    "tax": 0,
    "fee": 0,
    "net": 330000,
    "note": "Cash"
  },
  {
    "date": "2025-12-29",
    "item": "Spro Classic(3), Modern(2)",
    "category": "Bahan Baku",
    "gross": 1450000,
    "tax": 0,
    "fee": 0,
    "net": 1450000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-29",
    "item": "Filter BB",
    "category": "Bahan Baku",
    "gross": 195000,
    "tax": 0,
    "fee": 0,
    "net": 195000,
    "note": "Cash"
  },
  {
    "date": "2025-12-29",
    "item": "Filter Tokped",
    "category": "Bahan Baku",
    "gross": 933000,
    "tax": 0,
    "fee": 0,
    "net": 933000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-29",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2025-12-29",
    "item": "Krimer, Coklat, Aren",
    "category": "Bahan Baku",
    "gross": 180000,
    "tax": 0,
    "fee": 0,
    "net": 180000,
    "note": "Cash"
  },
  {
    "date": "2025-12-29",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-12-30",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2025-12-30",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2025-12-30",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Cash"
  },
  {
    "date": "2025-12-31",
    "item": "Tagihan Tokped",
    "category": "Bahan Baku",
    "gross": 260000,
    "tax": 0,
    "fee": 0,
    "net": 260000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-31",
    "item": "Tagihan TikTok",
    "category": "Bahan Baku",
    "gross": 1358000,
    "tax": 0,
    "fee": 0,
    "net": 1358000,
    "note": "Transfer Bank"
  },
  {
    "date": "2025-12-31",
    "item": "Karyawan",
    "category": "Karyawan",
    "gross": 2500000,
    "tax": 0,
    "fee": 0,
    "net": 2500000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-02",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2026-01-02",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-01-02",
    "item": "Sedotan",
    "category": "Bahan Baku",
    "gross": 6000,
    "tax": 0,
    "fee": 0,
    "net": 6000,
    "note": "Cash"
  },
  {
    "date": "2026-01-03",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-03",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-01-03",
    "item": "Spro Classic",
    "category": "Bahan Baku",
    "gross": 750000,
    "tax": 0,
    "fee": 0,
    "net": 750000,
    "note": "Cash"
  },
  {
    "date": "2026-01-03",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Cash"
  },
  {
    "date": "2026-01-03",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 256000,
    "tax": 0,
    "fee": 0,
    "net": 256000,
    "note": "Cash"
  },
  {
    "date": "2026-01-04",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 245000,
    "tax": 0,
    "fee": 0,
    "net": 245000,
    "note": "Cash"
  },
  {
    "date": "2026-01-04",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-04",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-05",
    "item": "Asbak",
    "category": "Lain-lain",
    "gross": 80000,
    "tax": 0,
    "fee": 0,
    "net": 80000,
    "note": "Cash"
  },
  {
    "date": "2026-01-05",
    "item": "Beans Tokped",
    "category": "Bahan Baku",
    "gross": 500000,
    "tax": 0,
    "fee": 0,
    "net": 500000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-05",
    "item": "Beans TikTok",
    "category": "Bahan Baku",
    "gross": 581000,
    "tax": 0,
    "fee": 0,
    "net": 581000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-05",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-05",
    "item": "Sirup Lavender",
    "category": "Bahan Baku",
    "gross": 152000,
    "tax": 0,
    "fee": 0,
    "net": 152000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-05",
    "item": "Krimer, Aren",
    "category": "Bahan Baku",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Cash"
  },
  {
    "date": "2026-01-05",
    "item": "Sirup, Aren",
    "category": "Bahan Baku",
    "gross": 140000,
    "tax": 0,
    "fee": 0,
    "net": 140000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-05",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-01-06",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-01-06",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-07",
    "item": "es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-01-07",
    "item": "Spro Classic, Modern",
    "category": "Bahan Baku",
    "gross": 1450000,
    "tax": 0,
    "fee": 0,
    "net": 1450000,
    "note": "Cash"
  },
  {
    "date": "2026-01-07",
    "item": "FIlter Arosta",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2026-01-07",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-01-07",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 340000,
    "tax": 0,
    "fee": 0,
    "net": 340000,
    "note": "Cash"
  },
  {
    "date": "2026-01-09",
    "item": "Krimer, Coklat, Aren",
    "category": "Bahan Baku",
    "gross": 180000,
    "tax": 0,
    "fee": 0,
    "net": 180000,
    "note": "Cash"
  },
  {
    "date": "2026-01-09",
    "item": "Sabun Pel",
    "category": "Lain-lain",
    "gross": 16000,
    "tax": 0,
    "fee": 0,
    "net": 16000,
    "note": "Cash"
  },
  {
    "date": "2026-01-09",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-09",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 125000,
    "tax": 0,
    "fee": 0,
    "net": 125000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-10",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-10",
    "item": "Susu 2 Box",
    "category": "Bahan Baku",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Cash"
  },
  {
    "date": "2026-01-10",
    "item": "Mount Sago",
    "category": "Bahan Baku",
    "gross": 85000,
    "tax": 0,
    "fee": 0,
    "net": 85000,
    "note": "Cash"
  },
  {
    "date": "2026-01-10",
    "item": "Susu 1 Box",
    "category": "Bahan Baku",
    "gross": 245000,
    "tax": 0,
    "fee": 0,
    "net": 245000,
    "note": "Cash"
  },
  {
    "date": "2026-01-11",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-11",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-01-11",
    "item": "Tisu",
    "category": "Bahan Baku",
    "gross": 20000,
    "tax": 0,
    "fee": 0,
    "net": 20000,
    "note": "Cash"
  },
  {
    "date": "2026-01-12",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-12",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-01-12",
    "item": "Krimer, Coklat, Aren",
    "category": "Bahan Baku",
    "gross": 150000,
    "tax": 0,
    "fee": 0,
    "net": 150000,
    "note": "Cash"
  },
  {
    "date": "2026-01-13",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-13",
    "item": "Spro Classic",
    "category": "Bahan Baku",
    "gross": 750000,
    "tax": 0,
    "fee": 0,
    "net": 750000,
    "note": "Cash"
  },
  {
    "date": "2026-01-14",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-14",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-01-14",
    "item": "Kebersihan",
    "category": "Bahan Baku",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2026-01-16",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-16",
    "item": "Krimer, Plastik, Aren",
    "category": "Bahan Baku",
    "gross": 158000,
    "tax": 0,
    "fee": 0,
    "net": 158000,
    "note": "Cash"
  },
  {
    "date": "2026-01-17",
    "item": "Filter TikTok",
    "category": "Bahan Baku",
    "gross": 360000,
    "tax": 0,
    "fee": 0,
    "net": 360000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-17",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-17",
    "item": "Cup Hot",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-17",
    "item": "Spro Tanah Dieng, Filter",
    "category": "Bahan Baku",
    "gross": 1230000,
    "tax": 0,
    "fee": 0,
    "net": 1230000,
    "note": "Cash"
  },
  {
    "date": "2026-01-17",
    "item": "Filter BB",
    "category": "Bahan Baku",
    "gross": 260000,
    "tax": 0,
    "fee": 0,
    "net": 260000,
    "note": "Cash"
  },
  {
    "date": "2026-01-17",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 250000,
    "tax": 0,
    "fee": 0,
    "net": 250000,
    "note": "Cash"
  },
  {
    "date": "2026-01-18",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-18",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-01-18",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-01-18",
    "item": "Krimer, Coklat",
    "category": "Bahan Baku",
    "gross": 168000,
    "tax": 0,
    "fee": 0,
    "net": 168000,
    "note": "Cash"
  },
  {
    "date": "2026-01-18",
    "item": "Parttime",
    "category": "Karyawan",
    "gross": 650000,
    "tax": 0,
    "fee": 0,
    "net": 650000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-18",
    "item": "Filter Tokped",
    "category": "Bahan Baku",
    "gross": 832000,
    "tax": 0,
    "fee": 0,
    "net": 832000,
    "note": "Cash"
  },
  {
    "date": "2026-01-18",
    "item": "Papper Filter",
    "category": "Bahan Baku",
    "gross": 1550000,
    "tax": 0,
    "fee": 0,
    "net": 1550000,
    "note": "Cash"
  },
  {
    "date": "2026-01-19",
    "item": "Chasen Matcha",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2026-01-19",
    "item": "THF Beans",
    "category": "Bahan Baku",
    "gross": 629000,
    "tax": 0,
    "fee": 0,
    "net": 629000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-19",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 340000,
    "tax": 0,
    "fee": 0,
    "net": 340000,
    "note": "Cash"
  },
  {
    "date": "2026-01-19",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-19",
    "item": "Aren, Krimer",
    "category": "Bahan Baku",
    "gross": 152000,
    "tax": 0,
    "fee": 0,
    "net": 152000,
    "note": "Cash"
  },
  {
    "date": "2026-01-19",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 250000,
    "tax": 0,
    "fee": 0,
    "net": 250000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-20",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-20",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-21",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-21",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-01-22",
    "item": "Spro Classic, Modern",
    "category": "Bahan Baku",
    "gross": 1480000,
    "tax": 0,
    "fee": 0,
    "net": 1480000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-24",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-01-24",
    "item": "Tisu",
    "category": "Lain-lain",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-01-24",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-24",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-01-25",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-25",
    "item": "Krimer, Coklat, Aren",
    "category": "Bahan Baku",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Cash"
  },
  {
    "date": "2026-01-26",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-26",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 260000,
    "tax": 0,
    "fee": 0,
    "net": 260000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-26",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-27",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-27",
    "item": "Spro Classic n Modern",
    "category": "Bahan Baku",
    "gross": 1130000,
    "tax": 0,
    "fee": 0,
    "net": 1130000,
    "note": "Cash"
  },
  {
    "date": "2026-01-27",
    "item": "Krimer, Coklat, Aren",
    "category": "Bahan Baku",
    "gross": 185000,
    "tax": 0,
    "fee": 0,
    "net": 185000,
    "note": "Cash"
  },
  {
    "date": "2026-01-28",
    "item": "Hana Spro",
    "category": "Bahan Baku",
    "gross": 392000,
    "tax": 0,
    "fee": 0,
    "net": 392000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-28",
    "item": "Filter Tokped",
    "category": "Bahan Baku",
    "gross": 745000,
    "tax": 0,
    "fee": 0,
    "net": 745000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-28",
    "item": "Knock Box",
    "category": "Lain-lain",
    "gross": 368000,
    "tax": 0,
    "fee": 0,
    "net": 368000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-28",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Cash"
  },
  {
    "date": "2026-01-29",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-29",
    "item": "Buah Vita",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Cash"
  },
  {
    "date": "2026-01-30",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 340000,
    "tax": 0,
    "fee": 0,
    "net": 340000,
    "note": "Cash"
  },
  {
    "date": "2026-01-30",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-01-30",
    "item": "Buah Vita",
    "category": "Bahan Baku",
    "gross": 60000,
    "tax": 0,
    "fee": 0,
    "net": 60000,
    "note": "Cash"
  },
  {
    "date": "2026-01-30",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-01-30",
    "item": "Krimer, Coklat, Aren",
    "category": "Bahan Baku",
    "gross": 185000,
    "tax": 0,
    "fee": 0,
    "net": 185000,
    "note": "Cash"
  },
  {
    "date": "2026-01-30",
    "item": "Gaji Fulltime",
    "category": "Karyawan",
    "gross": 2335000,
    "tax": 0,
    "fee": 0,
    "net": 2335000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-01-30",
    "item": "Gaji Parttime",
    "category": "Karyawan",
    "gross": 850000,
    "tax": 0,
    "fee": 0,
    "net": 850000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-01",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-02",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-02",
    "item": "Krimer, Coklat, Aren",
    "category": "Bahan Baku",
    "gross": 137000,
    "tax": 0,
    "fee": 0,
    "net": 137000,
    "note": "Cash"
  },
  {
    "date": "2026-02-03",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-03",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 250000,
    "tax": 0,
    "fee": 0,
    "net": 250000,
    "note": "Cash"
  },
  {
    "date": "2026-02-03",
    "item": "Spro NIR",
    "category": "Bahan Baku",
    "gross": 375000,
    "tax": 0,
    "fee": 0,
    "net": 375000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-06",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-06",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-02-07",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-07",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-02-08",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-08",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-08",
    "item": "Filter Sundara",
    "category": "Bahan Baku",
    "gross": 90000,
    "tax": 0,
    "fee": 0,
    "net": 90000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-08",
    "item": "Classic Spro (3)",
    "category": "Bahan Baku",
    "gross": 780000,
    "tax": 0,
    "fee": 0,
    "net": 780000,
    "note": "Cash"
  },
  {
    "date": "2026-02-09",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-09",
    "item": "Krimer Coklat Aren",
    "category": "Bahan Baku",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Cash"
  },
  {
    "date": "2026-02-09",
    "item": "FIlter Arosta",
    "category": "Bahan Baku",
    "gross": 80000,
    "tax": 0,
    "fee": 0,
    "net": 80000,
    "note": "Cash"
  },
  {
    "date": "2026-02-10",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-10",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-02-10",
    "item": "FIlter Good Things",
    "category": "Bahan Baku",
    "gross": 234000,
    "tax": 0,
    "fee": 0,
    "net": 234000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-11",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-11",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 245000,
    "tax": 0,
    "fee": 0,
    "net": 245000,
    "note": "Cash"
  },
  {
    "date": "2026-02-11",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 79000,
    "tax": 0,
    "fee": 0,
    "net": 79000,
    "note": "Cash"
  },
  {
    "date": "2026-02-11",
    "item": "Tisu",
    "category": "Lain-lain",
    "gross": 18000,
    "tax": 0,
    "fee": 0,
    "net": 18000,
    "note": "Cash"
  },
  {
    "date": "2026-02-11",
    "item": "Filter NIR",
    "category": "Bahan Baku",
    "gross": 180000,
    "tax": 0,
    "fee": 0,
    "net": 180000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-12",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-12",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2026-02-12",
    "item": "Aren, Plastik",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-02-12",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 245000,
    "tax": 0,
    "fee": 0,
    "net": 245000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-13",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-13",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 340000,
    "tax": 0,
    "fee": 0,
    "net": 340000,
    "note": "Cash"
  },
  {
    "date": "2026-02-14",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-14",
    "item": "Spro Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 940000,
    "tax": 0,
    "fee": 0,
    "net": 940000,
    "note": "Cash"
  },
  {
    "date": "2026-02-14",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 18000,
    "tax": 0,
    "fee": 0,
    "net": 18000,
    "note": "Cash"
  },
  {
    "date": "2026-02-16",
    "item": "Filter NIR",
    "category": "Bahan Baku",
    "gross": 170000,
    "tax": 0,
    "fee": 0,
    "net": 170000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-16",
    "item": "Plastik",
    "category": "Lain-lain",
    "gross": 39000,
    "tax": 0,
    "fee": 0,
    "net": 39000,
    "note": "Cash"
  },
  {
    "date": "2026-02-16",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Cash"
  },
  {
    "date": "2026-02-16",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-02-16",
    "item": "Filter Sabin",
    "category": "Bahan Baku",
    "gross": 180000,
    "tax": 0,
    "fee": 0,
    "net": 180000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-16",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-02-16",
    "item": "Coklat Krimer Aren",
    "category": "Bahan Baku",
    "gross": 186000,
    "tax": 0,
    "fee": 0,
    "net": 186000,
    "note": "Cash"
  },
  {
    "date": "2026-02-16",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-02-16",
    "item": "Parttime",
    "category": "Karyawan",
    "gross": 850000,
    "tax": 0,
    "fee": 0,
    "net": 850000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-16",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 245000,
    "tax": 0,
    "fee": 0,
    "net": 245000,
    "note": "Cash"
  },
  {
    "date": "2026-02-17",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-17",
    "item": "Spro Modern",
    "category": "Bahan Baku",
    "gross": 700000,
    "tax": 0,
    "fee": 0,
    "net": 700000,
    "note": "Cash"
  },
  {
    "date": "2026-02-18",
    "item": "Filter NIR",
    "category": "Bahan Baku",
    "gross": 187000,
    "tax": 0,
    "fee": 0,
    "net": 187000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-18",
    "item": "Spro Seasonal",
    "category": "Bahan Baku",
    "gross": 420000,
    "tax": 0,
    "fee": 0,
    "net": 420000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-18",
    "item": "Filter Tokped",
    "category": "Bahan Baku",
    "gross": 385000,
    "tax": 0,
    "fee": 0,
    "net": 385000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-18",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-18",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 80000,
    "tax": 0,
    "fee": 0,
    "net": 80000,
    "note": "Cash"
  },
  {
    "date": "2026-02-19",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-19",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-02-19",
    "item": "Spro Classic",
    "category": "Bahan Baku",
    "gross": 780000,
    "tax": 0,
    "fee": 0,
    "net": 780000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-20",
    "item": "Aren, Coklat",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2026-02-21",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 206000,
    "tax": 0,
    "fee": 0,
    "net": 206000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-22",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-23",
    "item": "Spotify",
    "category": "Lain-lain",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-24",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-24",
    "item": "Krimer, Coklat, Aren",
    "category": "Bahan Baku",
    "gross": 201000,
    "tax": 0,
    "fee": 0,
    "net": 201000,
    "note": "Cash"
  },
  {
    "date": "2026-02-25",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-26",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-26",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-02-27",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-27",
    "item": "Service AC",
    "category": "Lain-lain",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2026-02-27",
    "item": "Kebersihan",
    "category": "Lain-lain",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2026-02-27",
    "item": "Sirup Lavender",
    "category": "Bahan Baku",
    "gross": 165000,
    "tax": 0,
    "fee": 0,
    "net": 165000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-27",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 240000,
    "tax": 0,
    "fee": 0,
    "net": 240000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-28",
    "item": "Gaji Yasar",
    "category": "Karyawan",
    "gross": 3890000,
    "tax": 0,
    "fee": 0,
    "net": 3890000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-28",
    "item": "Gaji Sijo",
    "category": "Karyawan",
    "gross": 1600000,
    "tax": 0,
    "fee": 0,
    "net": 1600000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-28",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-28",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-02-28",
    "item": "Tukang",
    "category": "Lain-lain",
    "gross": 500000,
    "tax": 0,
    "fee": 0,
    "net": 500000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-02-28",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-03-01",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-02",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-02",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2026-03-02",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 340000,
    "tax": 0,
    "fee": 0,
    "net": 340000,
    "note": "Cash"
  },
  {
    "date": "2026-03-02",
    "item": "Sabun, Tisu",
    "category": "Bahan Baku",
    "gross": 20000,
    "tax": 0,
    "fee": 0,
    "net": 20000,
    "note": "Cash"
  },
  {
    "date": "2026-03-03",
    "item": "Filter Tokped",
    "category": "Bahan Baku",
    "gross": 385000,
    "tax": 0,
    "fee": 0,
    "net": 385000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-03",
    "item": "Filter NIR",
    "category": "Bahan Baku",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-03",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-04",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2026-03-04",
    "item": "Tisu, Spons",
    "category": "Lain-lain",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2026-03-04",
    "item": "FIlter Arosta",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2026-03-04",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Cash"
  },
  {
    "date": "2026-03-05",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-05",
    "item": "FIlter Sundara",
    "category": "Bahan Baku",
    "gross": 85000,
    "tax": 0,
    "fee": 0,
    "net": 85000,
    "note": "Cash"
  },
  {
    "date": "2026-03-06",
    "item": "Krimer, Coklat, Aren",
    "category": "Bahan Baku",
    "gross": 140000,
    "tax": 0,
    "fee": 0,
    "net": 140000,
    "note": "Cash"
  },
  {
    "date": "2026-03-07",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-07",
    "item": "Sabun, Spons",
    "category": "Lain-lain",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2026-03-08",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-03-08",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-08",
    "item": "Susu Ecer 3",
    "category": "Bahan Baku",
    "gross": 60000,
    "tax": 0,
    "fee": 0,
    "net": 60000,
    "note": "Cash"
  },
  {
    "date": "2026-03-08",
    "item": "Cookies",
    "category": "Bahan Baku",
    "gross": 168000,
    "tax": 0,
    "fee": 0,
    "net": 168000,
    "note": "Cash"
  },
  {
    "date": "2026-03-10",
    "item": "Spro MorMor",
    "category": "Bahan Baku",
    "gross": 380000,
    "tax": 0,
    "fee": 0,
    "net": 380000,
    "note": "Cash"
  },
  {
    "date": "2026-03-10",
    "item": "Kebersihan",
    "category": "Lain-lain",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2026-03-10",
    "item": "Papper Filter",
    "category": "Wifi",
    "gross": 180000,
    "tax": 0,
    "fee": 0,
    "net": 180000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-10",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-10",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-03-11",
    "item": "Krimer, Coklat",
    "category": "Bahan Baku",
    "gross": 180000,
    "tax": 0,
    "fee": 0,
    "net": 180000,
    "note": "Cash"
  },
  {
    "date": "2026-03-13",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-13",
    "item": "Spro Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 1130000,
    "tax": 0,
    "fee": 0,
    "net": 1130000,
    "note": "Cash"
  },
  {
    "date": "2026-03-13",
    "item": "Sumbangan",
    "category": "Lain-lain",
    "gross": 425000,
    "tax": 0,
    "fee": 0,
    "net": 425000,
    "note": "Cash"
  },
  {
    "date": "2026-03-13",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 168000,
    "tax": 0,
    "fee": 0,
    "net": 168000,
    "note": "Cash"
  },
  {
    "date": "2026-03-14",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-15",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Cash"
  },
  {
    "date": "2026-03-15",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-15",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 248000,
    "tax": 0,
    "fee": 0,
    "net": 248000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-16",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-16",
    "item": "Beans Tokped",
    "category": "Bahan Baku",
    "gross": 885000,
    "tax": 0,
    "fee": 0,
    "net": 885000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-16",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 350000,
    "tax": 0,
    "fee": 0,
    "net": 350000,
    "note": "Cash"
  },
  {
    "date": "2026-03-17",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-17",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 142000,
    "tax": 0,
    "fee": 0,
    "net": 142000,
    "note": "Cash"
  },
  {
    "date": "2026-03-17",
    "item": "Kebersihan",
    "category": "Bahan Baku",
    "gross": 25000,
    "tax": 0,
    "fee": 0,
    "net": 25000,
    "note": "Cash"
  },
  {
    "date": "2026-03-17",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 55000,
    "tax": 0,
    "fee": 0,
    "net": 55000,
    "note": "Cash"
  },
  {
    "date": "2026-03-20",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-21",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-03-21",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-03-21",
    "item": "Orange Jus",
    "category": "Bahan Baku",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Cash"
  },
  {
    "date": "2026-03-21",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 248000,
    "tax": 0,
    "fee": 0,
    "net": 248000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-21",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2026-03-21",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-22",
    "item": "Beans Tokped",
    "category": "Bahan Baku",
    "gross": 1415000,
    "tax": 0,
    "fee": 0,
    "net": 1415000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-22",
    "item": "Filter NIR",
    "category": "Bahan Baku",
    "gross": 216000,
    "tax": 0,
    "fee": 0,
    "net": 216000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-22",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 128000,
    "tax": 0,
    "fee": 0,
    "net": 128000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-22",
    "item": "Spro Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 1910000,
    "tax": 0,
    "fee": 0,
    "net": 1910000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-22",
    "item": "Cookies",
    "category": "Bahan Baku",
    "gross": 168000,
    "tax": 0,
    "fee": 0,
    "net": 168000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-23",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-03-23",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-23",
    "item": "Filter",
    "category": "Bahan Baku",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-23",
    "item": "Coklat Krimer Aren",
    "category": "Bahan Baku",
    "gross": 185000,
    "tax": 0,
    "fee": 0,
    "net": 185000,
    "note": "Cash"
  },
  {
    "date": "2026-03-23",
    "item": "Lemon",
    "category": "Bahan Baku",
    "gross": 13000,
    "tax": 0,
    "fee": 0,
    "net": 13000,
    "note": "Cash"
  },
  {
    "date": "2026-03-24",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-03-24",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 262000,
    "tax": 0,
    "fee": 0,
    "net": 262000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-24",
    "item": "Filter Beans",
    "category": "Bahan Baku",
    "gross": 100000,
    "tax": 0,
    "fee": 0,
    "net": 100000,
    "note": "Cash"
  },
  {
    "date": "2026-03-24",
    "item": "Coklat Krimer Aren",
    "category": "Bahan Baku",
    "gross": 202000,
    "tax": 0,
    "fee": 0,
    "net": 202000,
    "note": "Cash"
  },
  {
    "date": "2026-03-25",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Cash"
  },
  {
    "date": "2026-03-25",
    "item": "Tisu",
    "category": "Bahan Baku",
    "gross": 18000,
    "tax": 0,
    "fee": 0,
    "net": 18000,
    "note": "Cash"
  },
  {
    "date": "2026-03-25",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 36000,
    "tax": 0,
    "fee": 0,
    "net": 36000,
    "note": "Cash"
  },
  {
    "date": "2026-03-25",
    "item": "Listrik",
    "category": "Listrik",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-25",
    "item": "Spro Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 1115000,
    "tax": 0,
    "fee": 0,
    "net": 1115000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-25",
    "item": "Krimer Coklat Aren",
    "category": "Bahan Baku",
    "gross": 443000,
    "tax": 0,
    "fee": 0,
    "net": 443000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-25",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-25",
    "item": "Rich Milk",
    "category": "Bahan Baku",
    "gross": 334000,
    "tax": 0,
    "fee": 0,
    "net": 334000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-25",
    "item": "Papper Filter",
    "category": "Bahan Baku",
    "gross": 188000,
    "tax": 0,
    "fee": 0,
    "net": 188000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-25",
    "item": "Filter Sundara",
    "category": "Bahan Baku",
    "gross": 170000,
    "tax": 0,
    "fee": 0,
    "net": 170000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-26",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-03-27",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-03-27",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 36000,
    "tax": 0,
    "fee": 0,
    "net": 36000,
    "note": "Cash"
  },
  {
    "date": "2026-03-27",
    "item": "Stiker",
    "category": "Lain-lain",
    "gross": 176000,
    "tax": 0,
    "fee": 0,
    "net": 176000,
    "note": "Cash"
  },
  {
    "date": "2026-03-27",
    "item": "Lavender",
    "category": "Bahan Baku",
    "gross": 369000,
    "tax": 0,
    "fee": 0,
    "net": 369000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-27",
    "item": "Spro Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 2610000,
    "tax": 0,
    "fee": 0,
    "net": 2610000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-27",
    "item": "Rante",
    "category": "Lain-lain",
    "gross": 90000,
    "tax": 0,
    "fee": 0,
    "net": 90000,
    "note": "Cash"
  },
  {
    "date": "2026-03-29",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 632000,
    "tax": 0,
    "fee": 0,
    "net": 632000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-29",
    "item": "Plastik dll",
    "category": "Bahan Baku",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2026-03-29",
    "item": "Gaji Parttime",
    "category": "Karyawan",
    "gross": 500000,
    "tax": 0,
    "fee": 0,
    "net": 500000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-30",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-03-30",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 495000,
    "tax": 0,
    "fee": 0,
    "net": 495000,
    "note": "Cash"
  },
  {
    "date": "2026-03-30",
    "item": "Cookies",
    "category": "Bahan Baku",
    "gross": 176000,
    "tax": 0,
    "fee": 0,
    "net": 176000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-31",
    "item": "Peralatan GC",
    "category": "Lain-lain",
    "gross": 158000,
    "tax": 0,
    "fee": 0,
    "net": 158000,
    "note": "Cash"
  },
  {
    "date": "2026-03-31",
    "item": "Makan GC",
    "category": "Lain-lain",
    "gross": 98000,
    "tax": 0,
    "fee": 0,
    "net": 98000,
    "note": "Cash"
  },
  {
    "date": "2026-03-31",
    "item": "Londri",
    "category": "Lain-lain",
    "gross": 120000,
    "tax": 0,
    "fee": 0,
    "net": 120000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-31",
    "item": "Gaji Sijo",
    "category": "Karyawan",
    "gross": 2500000,
    "tax": 0,
    "fee": 0,
    "net": 2500000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-31",
    "item": "Gaji Yasar",
    "category": "Karyawan",
    "gross": 1900000,
    "tax": 0,
    "fee": 0,
    "net": 1900000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-31",
    "item": "Creator Beans",
    "category": "Bahan Baku",
    "gross": 425000,
    "tax": 0,
    "fee": 0,
    "net": 425000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-31",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-03-31",
    "item": "Filter Tokped",
    "category": "Bahan Baku",
    "gross": 1353000,
    "tax": 0,
    "fee": 0,
    "net": 1353000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-03-31",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 730000,
    "tax": 0,
    "fee": 0,
    "net": 730000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-01",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-02",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-02",
    "item": "Lemon, Gula",
    "category": "Bahan Baku",
    "gross": 30000,
    "tax": 0,
    "fee": 0,
    "net": 30000,
    "note": "Cash"
  },
  {
    "date": "2026-04-03",
    "item": "Buah Vita",
    "category": "Bahan Baku",
    "gross": 60000,
    "tax": 0,
    "fee": 0,
    "net": 60000,
    "note": "Cash"
  },
  {
    "date": "2026-04-03",
    "item": "Cranberry",
    "category": "Bahan Baku",
    "gross": 75000,
    "tax": 0,
    "fee": 0,
    "net": 75000,
    "note": "Cash"
  },
  {
    "date": "2026-04-03",
    "item": "Sambungan T",
    "category": "Lain-lain",
    "gross": 20000,
    "tax": 0,
    "fee": 0,
    "net": 20000,
    "note": "Cash"
  },
  {
    "date": "2026-04-03",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-04",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-04",
    "item": "Spro Hobbs",
    "category": "Bahan Baku",
    "gross": 335000,
    "tax": 0,
    "fee": 0,
    "net": 335000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-04",
    "item": "Papper Filter",
    "category": "Bahan Baku",
    "gross": 180000,
    "tax": 0,
    "fee": 0,
    "net": 180000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-05",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-06",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-04-06",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 57000,
    "tax": 0,
    "fee": 0,
    "net": 57000,
    "note": "Cash"
  },
  {
    "date": "2026-04-06",
    "item": "Coklat",
    "category": "Bahan Baku",
    "gross": 182000,
    "tax": 0,
    "fee": 0,
    "net": 182000,
    "note": "Cash"
  },
  {
    "date": "2026-04-06",
    "item": "Aren",
    "category": "Bahan Baku",
    "gross": 60000,
    "tax": 0,
    "fee": 0,
    "net": 60000,
    "note": "Cash"
  },
  {
    "date": "2026-04-06",
    "item": "Cookies",
    "category": "Bahan Baku",
    "gross": 233000,
    "tax": 0,
    "fee": 0,
    "net": 233000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-06",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-07",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-07",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 390000,
    "tax": 0,
    "fee": 0,
    "net": 390000,
    "note": "Cash"
  },
  {
    "date": "2026-04-07",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Cash"
  },
  {
    "date": "2026-04-08",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-08",
    "item": "Koeslan Spro",
    "category": "Bahan Baku",
    "gross": 550000,
    "tax": 0,
    "fee": 0,
    "net": 550000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-09",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-09",
    "item": "Spro White Desk",
    "category": "Bahan Baku",
    "gross": 362000,
    "tax": 0,
    "fee": 0,
    "net": 362000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-09",
    "item": "Spro Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 1220000,
    "tax": 0,
    "fee": 0,
    "net": 1220000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-10",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-04-10",
    "item": "Listrik",
    "category": "Bahan Baku",
    "gross": 200000,
    "tax": 0,
    "fee": 0,
    "net": 200000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-11",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 375000,
    "tax": 0,
    "fee": 0,
    "net": 375000,
    "note": "Cash"
  },
  {
    "date": "2026-04-11",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-04-11",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-04-11",
    "item": "Filter NIR",
    "category": "Bahan Baku",
    "gross": 362000,
    "tax": 0,
    "fee": 0,
    "net": 362000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-11",
    "item": "Tukang",
    "category": "Lain-lain",
    "gross": 80000,
    "tax": 0,
    "fee": 0,
    "net": 80000,
    "note": "Cash"
  },
  {
    "date": "2026-04-11",
    "item": "Sirup",
    "category": "Bahan Baku",
    "gross": 670000,
    "tax": 0,
    "fee": 0,
    "net": 670000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-11",
    "item": "Filter Tokped",
    "category": "Bahan Baku",
    "gross": 445000,
    "tax": 0,
    "fee": 0,
    "net": 445000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-11",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 275000,
    "tax": 0,
    "fee": 0,
    "net": 275000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-12",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-12",
    "item": "Lemon",
    "category": "Bahan Baku",
    "gross": 15000,
    "tax": 0,
    "fee": 0,
    "net": 15000,
    "note": "Cash"
  },
  {
    "date": "2026-04-12",
    "item": "Spro Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 1650000,
    "tax": 0,
    "fee": 0,
    "net": 1650000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-13",
    "item": "Krimer Coklat Aren",
    "category": "Lain-lain",
    "gross": 565000,
    "tax": 0,
    "fee": 0,
    "net": 565000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-13",
    "item": "Spro Uberall",
    "category": "Bahan Baku",
    "gross": 496000,
    "tax": 0,
    "fee": 0,
    "net": 496000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-13",
    "item": "FIlter Good Things",
    "category": "Bahan Baku",
    "gross": 633000,
    "tax": 0,
    "fee": 0,
    "net": 633000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-13",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-14",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-14",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-04-14",
    "item": "Beans BB",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Cash"
  },
  {
    "date": "2026-04-14",
    "item": "Cookies",
    "category": "Bahan Baku",
    "gross": 233000,
    "tax": 0,
    "fee": 0,
    "net": 233000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-15",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-15",
    "item": "Filter Sundara",
    "category": "Bahan Baku",
    "gross": 95000,
    "tax": 0,
    "fee": 0,
    "net": 95000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-15",
    "item": "Kebersihan",
    "category": "Lain-lain",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-16",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-16",
    "item": "Krimer",
    "category": "Bahan Baku",
    "gross": 195000,
    "tax": 0,
    "fee": 0,
    "net": 195000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-16",
    "item": "Lemon",
    "category": "Bahan Baku",
    "gross": 14000,
    "tax": 0,
    "fee": 0,
    "net": 14000,
    "note": "Cash"
  },
  {
    "date": "2026-04-17",
    "item": "Rich Milk",
    "category": "Bahan Baku",
    "gross": 343000,
    "tax": 0,
    "fee": 0,
    "net": 343000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-17",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-18",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-04-18",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-04-18",
    "item": "Cone",
    "category": "Lain-lain",
    "gross": 350000,
    "tax": 0,
    "fee": 0,
    "net": 350000,
    "note": "Cash"
  },
  {
    "date": "2026-04-18",
    "item": "Spotify",
    "category": "Lain-lain",
    "gross": 50000,
    "tax": 0,
    "fee": 0,
    "net": 50000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-18",
    "item": "Wifi",
    "category": "Wifi",
    "gross": 350000,
    "tax": 0,
    "fee": 0,
    "net": 350000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-19",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-19",
    "item": "Buah Vita, Cranberry",
    "category": "Bahan Baku",
    "gross": 45000,
    "tax": 0,
    "fee": 0,
    "net": 45000,
    "note": "Cash"
  },
  {
    "date": "2026-04-20",
    "item": "Gaji Parttime",
    "category": "Karyawan",
    "gross": 500000,
    "tax": 0,
    "fee": 0,
    "net": 500000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-20",
    "item": "Papper Filter",
    "category": "Bahan Baku",
    "gross": 450000,
    "tax": 0,
    "fee": 0,
    "net": 450000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-20",
    "item": "Spro Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 1650000,
    "tax": 0,
    "fee": 0,
    "net": 1650000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-20",
    "item": "Cookies",
    "category": "Bahan Baku",
    "gross": 233000,
    "tax": 0,
    "fee": 0,
    "net": 233000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-20",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-20",
    "item": "Air",
    "category": "Lain-lain",
    "gross": 55000,
    "tax": 0,
    "fee": 0,
    "net": 55000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-20",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-04-21",
    "item": "Matcha",
    "category": "Bahan Baku",
    "gross": 237000,
    "tax": 0,
    "fee": 0,
    "net": 237000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-21",
    "item": "Krimer Coklat Aren",
    "category": "Bahan Baku",
    "gross": 641000,
    "tax": 0,
    "fee": 0,
    "net": 641000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-21",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-04-21",
    "item": "Lemon",
    "category": "Bahan Baku",
    "gross": 20000,
    "tax": 0,
    "fee": 0,
    "net": 20000,
    "note": "Cash"
  },
  {
    "date": "2026-04-22",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-04-22",
    "item": "Cup",
    "category": "Bahan Baku",
    "gross": 375000,
    "tax": 0,
    "fee": 0,
    "net": 375000,
    "note": "Cash"
  },
  {
    "date": "2026-04-22",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-23",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-23",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 72000,
    "tax": 0,
    "fee": 0,
    "net": 72000,
    "note": "Cash"
  },
  {
    "date": "2026-04-24",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 24000,
    "tax": 0,
    "fee": 0,
    "net": 24000,
    "note": "Cash"
  },
  {
    "date": "2026-04-24",
    "item": "Sikat Mesin Spro",
    "category": "Bahan Baku",
    "gross": 365000,
    "tax": 0,
    "fee": 0,
    "net": 365000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-24",
    "item": "Espresso Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 1480000,
    "tax": 0,
    "fee": 0,
    "net": 1480000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-25",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-25",
    "item": "Susu",
    "category": "Bahan Baku",
    "gross": 490000,
    "tax": 0,
    "fee": 0,
    "net": 490000,
    "note": "Cash"
  },
  {
    "date": "2026-04-26",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-27",
    "item": "Buah Vita + Cranberry",
    "category": "Bahan Baku",
    "gross": 336000,
    "tax": 0,
    "fee": 0,
    "net": 336000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-27",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-04-27",
    "item": "Sirup Vanilla",
    "category": "Bahan Baku",
    "gross": 600000,
    "tax": 0,
    "fee": 0,
    "net": 600000,
    "note": "Cash"
  },
  {
    "date": "2026-04-27",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-27",
    "item": "Lemon",
    "category": "Bahan Baku",
    "gross": 18000,
    "tax": 0,
    "fee": 0,
    "net": 18000,
    "note": "Cash"
  },
  {
    "date": "2026-04-27",
    "item": "Spons",
    "category": "Lain-lain",
    "gross": 9000,
    "tax": 0,
    "fee": 0,
    "net": 9000,
    "note": "Cash"
  },
  {
    "date": "2026-04-27",
    "item": "Gula",
    "category": "Bahan Baku",
    "gross": 21000,
    "tax": 0,
    "fee": 0,
    "net": 21000,
    "note": "Cash"
  },
  {
    "date": "2026-04-28",
    "item": "Koeslan Spro",
    "category": "Bahan Baku",
    "gross": 558000,
    "tax": 0,
    "fee": 0,
    "net": 558000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-28",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-28",
    "item": "Aren",
    "category": "Bahan Baku",
    "gross": 152000,
    "tax": 0,
    "fee": 0,
    "net": 152000,
    "note": "Cash"
  },
  {
    "date": "2026-04-29",
    "item": "Galon",
    "category": "Bahan Baku",
    "gross": 48000,
    "tax": 0,
    "fee": 0,
    "net": 48000,
    "note": "Cash"
  },
  {
    "date": "2026-04-29",
    "item": "Spro Tanah Dieng",
    "category": "Bahan Baku",
    "gross": 2000000,
    "tax": 0,
    "fee": 0,
    "net": 2000000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-29",
    "item": "Cookies",
    "category": "Bahan Baku",
    "gross": 233000,
    "tax": 0,
    "fee": 0,
    "net": 233000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-29",
    "item": "Es",
    "category": "Bahan Baku",
    "gross": 12000,
    "tax": 0,
    "fee": 0,
    "net": 12000,
    "note": "Cash"
  },
  {
    "date": "2026-04-30",
    "item": "Gaji Rehan",
    "category": "Karyawan",
    "gross": 2000000,
    "tax": 0,
    "fee": 0,
    "net": 2000000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-30",
    "item": "Gaji Sijo",
    "category": "Karyawan",
    "gross": 2300000,
    "tax": 0,
    "fee": 0,
    "net": 2300000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-30",
    "item": "Sapu & Sorok",
    "category": "Lain-lain",
    "gross": 40000,
    "tax": 0,
    "fee": 0,
    "net": 40000,
    "note": "Cash"
  },
  {
    "date": "2026-04-30",
    "item": "Gaji Zara",
    "category": "Karyawan",
    "gross": 600000,
    "tax": 0,
    "fee": 0,
    "net": 600000,
    "note": "Transfer Bank"
  },
  {
    "date": "2026-04-30",
    "item": "Gaji Yasar",
    "category": "Karyawan",
    "gross": 255000,
    "tax": 0,
    "fee": 0,
    "net": 255000,
    "note": "Transfer Bank"
  }
];
