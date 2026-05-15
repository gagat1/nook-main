export type RoasteryGroup = {
  region: string;
  roasteries: string[];
};

export type CostIngredient = {
  name: string;
  cost: number | null;
  packSize: string;
};

export type MenuCost = {
  name: string;
  cost: number;
  sellingPrice: number;
  margin: number;
  items: Array<{ name: string; qty: string; cost: number }>;
};

export type Recipe = {
  name: string;
  ingredients: string[];
};

export type BrewGuide = {
  name: string;
  dose: string;
  grind: string;
  steps: string[];
  totalTime: string;
  totalYield: string;
};

export type SavingEntry = {
  month: string;
  nook: number;
  personal: number;
  total: number;
  note: string;
};

export type TargetEntry = {
  label: string;
  amount: number | null;
  note?: string;
};

export const roasteryGroups: RoasteryGroup[] = [
  { region: 'Bali', roasteries: ['Revolver', 'Blacklist', 'Koro', 'Expat', 'Everhaos'] },
  {
    region: 'Jabodetabek',
    roasteries: ['Tenun', 'Movere', 'J68', 'Southpaw', 'Instinc', 'Sematjam', 'Onward', 'Common Grounds', 'A Roastwork', 'Poche', 'Karma Takesover', 'Curious People', 'Axy'],
  },
  { region: 'Bandung', roasteries: ['Herd', 'Good Things', 'Makmur Jaya', 'Wheels', 'Jack Runners', 'TTKR', 'Contrast', 'Fugol', 'Two Hands Full'] },
  { region: 'Surabaya / East Java', roasteries: ['Ultra Coffee', 'Moodmaker', 'Hana', 'Glance', 'HOBBS', 'NIR', 'TBRK'] },
  { region: 'Semarang', roasteries: ['Mormor', 'Panna', 'Ahead', '33Micro'] },
  { region: 'Yogyakarta', roasteries: ['Djaya', 'Hayati', 'Kopirelo', 'Creator', 'Rahayu'] },
  { region: 'Solo', roasteries: ['Koeslan', 'Sekutu', 'White Desk'] },
];

export const costIngredients: CostIngredient[] = [
  { name: 'Modern Espresso', cost: 320000, packSize: '1,000 gr' },
  { name: 'Classic Espresso', cost: 265000, packSize: '1,000 gr' },
  { name: 'Local Filter Beans', cost: 100000, packSize: '200 gr' },
  { name: 'Artisan Filter Beans', cost: 160000, packSize: '200 gr' },
  { name: 'Choices Filter Beans', cost: 180000, packSize: '100 gr' },
  { name: 'Exotic Filter Beans', cost: null, packSize: '100 gr' },
  { name: 'Matcha', cost: 150000, packSize: '100 gr' },
  { name: 'Chocolate', cost: 50000, packSize: '165 gr' },
  { name: 'Fresh Milk', cost: 240000, packSize: '12 liter' },
  { name: 'Vanilla Syrup', cost: 110000, packSize: '750 ml' },
  { name: 'Lavender Syrup', cost: 75000, packSize: '650 ml' },
  { name: 'Creamer', cost: 40000, packSize: '500 gr' },
  { name: 'Palm Sugar', cost: 25000, packSize: '500 gr' },
  { name: 'Cleo Gallon Water', cost: 48000, packSize: '48 liter' },
  { name: 'Paper Filter', cost: 100000, packSize: '100 pcs' },
];

export const menuCosts: MenuCost[] = [
  { name: 'Americano - Modern', cost: 6000, sellingPrice: 20000, margin: 14000, items: [{ name: 'Modern Espresso', qty: '18 gr', cost: 5400 }, { name: 'Water', qty: '600 ml', cost: 600 }] },
  { name: 'Americano - Classic', cost: 5400, sellingPrice: 20000, margin: 14600, items: [{ name: 'Classic Espresso', qty: '18 gr', cost: 4800 }, { name: 'Water', qty: '600 ml', cost: 600 }] },
  { name: 'Latte / Cappuccino - Modern', cost: 10000, sellingPrice: 25000, margin: 15000, items: [{ name: 'Modern Espresso', qty: '18 gr', cost: 5400 }, { name: 'Fresh Milk', qty: '200 ml', cost: 4000 }, { name: 'Water', qty: '600 ml', cost: 600 }] },
  { name: 'Latte / Cappuccino - Classic', cost: 9400, sellingPrice: 25000, margin: 15600, items: [{ name: 'Classic Espresso', qty: '18 gr', cost: 4800 }, { name: 'Fresh Milk', qty: '200 ml', cost: 4000 }, { name: 'Water', qty: '600 ml', cost: 600 }] },
  { name: 'Local Filter Beans', cost: 8000, sellingPrice: 20000, margin: 12000, items: [{ name: 'Local Filter Beans', qty: '15 gr', cost: 7500 }, { name: 'Paper Filter', qty: '1 pc', cost: 500 }] },
  { name: 'Artisan Filter Beans', cost: 12500, sellingPrice: 30000, margin: 17500, items: [{ name: 'Artisan Filter Beans', qty: '15 gr', cost: 12000 }, { name: 'Paper Filter', qty: '1 pc', cost: 500 }] },
  { name: 'Choices Filter Beans', cost: 27500, sellingPrice: 40000, margin: 12500, items: [{ name: 'Choices Filter Beans', qty: '15 gr', cost: 27000 }, { name: 'Paper Filter', qty: '1 pc', cost: 500 }] },
  { name: 'Matcha Ice', cost: 16000, sellingPrice: 30000, margin: 14000, items: [{ name: 'Matcha', qty: '3 gr', cost: 4500 }, { name: 'Fresh Milk', qty: '100 ml', cost: 2000 }, { name: 'Vanilla Syrup', qty: '10 ml', cost: 1500 }] },
  { name: 'Chocolate Ice', cost: 13500, sellingPrice: 30000, margin: 16500, items: [{ name: 'Chocolate', qty: '8 gr', cost: 2500 }, { name: 'Fresh Milk', qty: '100 ml', cost: 2000 }, { name: 'Vanilla Syrup', qty: '10 ml', cost: 1500 }] },
  { name: 'Everyday Common', cost: 15500, sellingPrice: 28000, margin: 12500, items: [{ name: 'Classic Espresso', qty: '18 gr', cost: 4800 }, { name: 'Palm Sugar', qty: '10 gr', cost: 500 }, { name: 'Fresh Milk', qty: '100 ml', cost: 2000 }] },
  { name: 'First City Bloom', cost: 15000, sellingPrice: 30000, margin: 15000, items: [{ name: 'Classic Espresso', qty: '18 gr', cost: 4800 }, { name: 'Lavender Syrup', qty: '15 ml', cost: 1800 }, { name: 'Fresh Milk', qty: '100 ml', cost: 2000 }] },
];

export const recipes: Recipe[] = [
  { name: 'Matcha Ice', ingredients: ['Matcha 3 gr', 'Water 30 ml', 'Creamer 10 gr', 'Vanilla syrup 10 ml', 'Fresh milk 100 ml', 'Ice 100 gr'] },
  { name: 'Chocolate Ice', ingredients: ['Chocolate 8 gr', 'Water 30 ml', 'Creamer 10 gr', 'Vanilla syrup 10 ml', 'Fresh milk 100 ml', 'Ice 100 gr'] },
  { name: 'Matcha Hot', ingredients: ['Matcha 3 gr', 'Water 30 ml', 'Vanilla syrup 10 ml', 'Fresh milk 150 ml'] },
  { name: 'Chocolate Hot', ingredients: ['Chocolate 6 gr', 'Water 30 ml', 'Vanilla syrup 10 ml', 'Fresh milk 150 ml'] },
  { name: 'Everyday Common', ingredients: ['Classic espresso 18 gr', 'Palm sugar 10 gr', 'Creamer 15 gr', 'Fresh milk 100 ml', 'Chocolate 2 gr', 'Vanilla syrup 10 ml'] },
  { name: 'First City Bloom', ingredients: ['Classic espresso 18 gr', 'Palm sugar 5 gr', 'Creamer 10 gr', 'Fresh milk 100 ml', 'Lavender syrup 15 ml', 'Vanilla syrup 5 ml'] },
  { name: 'Americano', ingredients: ['Modern or classic espresso 18 gr', 'Ice 100 gr', 'Water 100 ml'] },
  { name: 'Split', ingredients: ['Modern or classic espresso 20 gr', '50 gr total yield'] },
  { name: 'Iced Palm Sugar Coffee', ingredients: ['Classic espresso 18 gr', 'Palm sugar 10 gr', 'Creamer 10 gr', 'Fresh milk 100 ml', 'Condensed milk 5 ml', 'Ice 100 ml'] },
];

export const brewGuides: BrewGuide[] = [
  {
    name: 'Iced Filter',
    dose: '15 gr',
    grind: '5 clicks',
    steps: ['00:30 - pour 30 ml, add 30 gr ice', '01:30 - pour 30 ml', '02:30 - pour 30 ml', 'Serve over 100 gr ice'],
    totalTime: '02:30 - 03:00',
    totalYield: '225 - 230 ml',
  },
  {
    name: 'Hot Filter',
    dose: '15 gr',
    grind: '5.5 clicks',
    steps: ['00:30 - pour 30 ml', '01:30 - pour 120 ml', '02:30 - pour 75 ml'],
    totalTime: '02:30 - 03:00',
    totalYield: '225 ml',
  },
];

export const savingsEntries: SavingEntry[] = [
  { month: 'January', nook: 0, personal: 0, total: 0, note: '' },
  { month: 'February', nook: 0, personal: 0, total: 0, note: '' },
  { month: 'March', nook: 0, personal: 0, total: 0, note: '' },
  { month: 'April', nook: 0, personal: 0, total: 0, note: '' },
  { month: 'May', nook: 0, personal: 0, total: 0, note: '' },
  { month: 'June', nook: 0, personal: 0, total: 0, note: '' },
  { month: 'July', nook: 0, personal: 0, total: 0, note: '' },
  { month: 'August', nook: 222000, personal: 39000, total: 261000, note: 'Remaining cash after buying Victoria Arduino.' },
  { month: 'September', nook: 1920000, personal: 0, total: 1920000, note: '' },
  { month: 'October', nook: 13800000, personal: 3000000, total: 16800000, note: '' },
  { month: 'November', nook: 0, personal: 3000000, total: 3000000, note: '13M allocated for grinder purchase.' },
  { month: 'December', nook: 8050000, personal: 14000000, total: 22050000, note: '10M for rent, plus another 10M addition.' },
];

export const targetEntries: TargetEntry[] = [
  { label: 'Current Cash', amount: 63731000 },
  { label: 'Conservative Case', amount: null, note: 'Negative scenario target' },
  { label: 'Optimistic Case', amount: null, note: 'Positive scenario target' },
  { label: 'Total Estimate', amount: 63731000 },
  { label: 'X54 + Cliff', amount: null },
  { label: 'EK43S', amount: null },
  { label: 'Estimated Total', amount: 63731000 },
];
