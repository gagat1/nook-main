import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { BookOpen, Coffee, PiggyBank, Plus, Target, Trash2, WalletCards, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadJsonRow, saveSingleton } from '../lib/supabaseSync';
import {
  brewGuides,
  costIngredients,
  menuCosts,
  recipes,
  roasteryGroups,
  savingsEntries,
  targetEntries,
  type BrewGuide,
  type CostIngredient,
  type MenuCost,
  type Recipe,
  type RoasteryGroup,
  type SavingEntry,
  type TargetEntry,
} from '../data/veteranBusiness';

type BusinessDataState = {
  id: string;
  roasteryGroups: RoasteryGroup[];
  costIngredients: CostIngredient[];
  menuCosts: MenuCost[];
  recipes: Recipe[];
  brewGuides: BrewGuide[];
  savingsEntries: SavingEntry[];
  targetEntries: TargetEntry[];
};

const SETTINGS_TABLE = 'app_settings';
const BUSINESS_SETTINGS_ID = 'business';

const defaultBusinessData: BusinessDataState = {
  id: BUSINESS_SETTINGS_ID,
  roasteryGroups,
  costIngredients,
  menuCosts,
  recipes,
  brewGuides,
  savingsEntries,
  targetEntries,
};

const money = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

function formatMoney(value: number | null) {
  if (value == null) return '-';
  return money.format(Math.round(value));
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function linesToArray(value: string) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

function menuItemsToText(items: MenuCost['items']) {
  return items.map((item) => `${item.name} | ${item.qty} | ${item.cost}`).join('\n');
}

function textToMenuItems(value: string) {
  return linesToArray(value).map((line) => {
    const [name = '', qty = '', cost = '0'] = line.split('|').map((part) => part.trim());
    return { name, qty, cost: toNumber(cost) };
  }).filter((item) => item.name);
}

function loadStoredBusinessData() {
  if (typeof window === 'undefined') return defaultBusinessData;
  try {
    const stored = window.localStorage.getItem('nook-business-data');
    return stored ? { ...defaultBusinessData, ...JSON.parse(stored), id: BUSINESS_SETTINGS_ID } : defaultBusinessData;
  } catch {
    return defaultBusinessData;
  }
}

export function BusinessDataView() {
  const [data, setData] = useState<BusinessDataState>(loadStoredBusinessData);
  const canSyncRef = useRef(false);
  const savingTotal = data.savingsEntries.reduce((sum, entry) => sum + entry.total, 0);
  const menuMargin = data.menuCosts.reduce((sum, item) => sum + item.margin, 0);

  useEffect(() => {
    void (async () => {
      const saved = await loadJsonRow<BusinessDataState>(SETTINGS_TABLE, BUSINESS_SETTINGS_ID);
      if (saved) setData({ ...defaultBusinessData, ...saved, id: BUSINESS_SETTINGS_ID });
      canSyncRef.current = true;
    })();
  }, []);

  useEffect(() => {
    window.localStorage.setItem('nook-business-data', JSON.stringify(data));
    if (!canSyncRef.current) return;
    const timer = window.setTimeout(() => {
      void saveSingleton(SETTINGS_TABLE, BUSINESS_SETTINGS_ID, data).catch((error) => {
        console.warn('Business data sync skipped:', error);
      });
    }, 450);
    return () => window.clearTimeout(timer);
  }, [data]);

  const saveToast = () => toast.success('Business data updated');

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">NOOK BREW.Business Data</h1>
        <p className="text-3xl font-light tracking-tight text-foreground md:text-4xl">Editable Business Tables</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Coffee} label="Roastery Regions" value={String(data.roasteryGroups.length)} />
        <Metric icon={BookOpen} label="Recipes" value={String(data.recipes.length)} />
        <Metric icon={WalletCards} label="Menu Margin" value={formatMoney(menuMargin)} />
        <Metric icon={PiggyBank} label="Savings Total" value={formatMoney(savingTotal)} />
      </div>

      <Tabs defaultValue="roastery" className="space-y-6">
        <TabsList variant="line" className="h-auto min-h-10 w-full justify-start overflow-x-auto rounded-none border-b border-border bg-transparent">
          <TabsTrigger value="roastery" className="px-5 text-[10px] uppercase tracking-widest">Roastery List</TabsTrigger>
          <TabsTrigger value="cogs" className="px-5 text-[10px] uppercase tracking-widest">COGS</TabsTrigger>
          <TabsTrigger value="recipes" className="px-5 text-[10px] uppercase tracking-widest">Recipes</TabsTrigger>
          <TabsTrigger value="savings" className="px-5 text-[10px] uppercase tracking-widest">Savings & Targets</TabsTrigger>
        </TabsList>

        <TabsContent value="roastery" className="space-y-4">
          <AddButton label="Add Region" onClick={() => setData((current) => ({
            ...current,
            roasteryGroups: [...current.roasteryGroups, { region: 'New Region', roasteries: ['New Roastery'] }],
          }))} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.roasteryGroups.map((group, index) => (
              <Card key={`${group.region}-${index}`} className="rounded-sm border-border bg-card p-5 shadow-none">
                <EditableHeader onDelete={() => setData((current) => ({
                  ...current,
                  roasteryGroups: current.roasteryGroups.filter((_, itemIndex) => itemIndex !== index),
                }))} />
                <Input
                  value={group.region}
                  onChange={(event) => setData((current) => ({
                    ...current,
                    roasteryGroups: current.roasteryGroups.map((item, itemIndex) => itemIndex === index ? { ...item, region: event.target.value } : item),
                  }))}
                  onBlur={saveToast}
                  className="mt-4 h-11 rounded-sm border-border bg-background text-sm"
                />
                <textarea
                  value={group.roasteries.join('\n')}
                  onChange={(event) => setData((current) => ({
                    ...current,
                    roasteryGroups: current.roasteryGroups.map((item, itemIndex) => itemIndex === index ? { ...item, roasteries: linesToArray(event.target.value) } : item),
                  }))}
                  onBlur={saveToast}
                  className="mt-3 min-h-40 w-full rounded-sm border border-border bg-background p-3 text-xs text-foreground outline-none"
                />
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cogs" className="space-y-6">
          <EditableSectionTitle title="Ingredients" onAdd={() => setData((current) => ({
            ...current,
            costIngredients: [...current.costIngredients, { name: 'New Ingredient', cost: 0, packSize: '1 pcs' }],
          }))} />
          <EditableGrid>
            <HeaderRow columns="grid-cols-[1.5fr_1fr_1fr_auto]" labels={['Ingredient', 'Purchase Cost', 'Pack Size', '']} />
            {data.costIngredients.map((item, index) => (
              <div key={`${item.name}-${index}`} className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-3 border-b border-border/60 p-3">
                <Input value={item.name} onChange={(event) => setData((current) => ({
                  ...current,
                  costIngredients: current.costIngredients.map((entry, itemIndex) => itemIndex === index ? { ...entry, name: event.target.value } : entry),
                }))} onBlur={saveToast} className="h-10 rounded-sm border-border bg-background text-xs" />
                <Input type="number" value={item.cost ?? ''} onChange={(event) => setData((current) => ({
                  ...current,
                  costIngredients: current.costIngredients.map((entry, itemIndex) => itemIndex === index ? { ...entry, cost: event.target.value ? toNumber(event.target.value) : null } : entry),
                }))} onBlur={saveToast} className="h-10 rounded-sm border-border bg-background text-xs" />
                <Input value={item.packSize} onChange={(event) => setData((current) => ({
                  ...current,
                  costIngredients: current.costIngredients.map((entry, itemIndex) => itemIndex === index ? { ...entry, packSize: event.target.value } : entry),
                }))} onBlur={saveToast} className="h-10 rounded-sm border-border bg-background text-xs" />
                <IconButton label="Delete Ingredient" onClick={() => setData((current) => ({
                  ...current,
                  costIngredients: current.costIngredients.filter((_, itemIndex) => itemIndex !== index),
                }))} />
              </div>
            ))}
          </EditableGrid>

          <EditableSectionTitle title="Menu Costing" onAdd={() => setData((current) => ({
            ...current,
            menuCosts: [...current.menuCosts, { name: 'New Menu', cost: 0, sellingPrice: 0, margin: 0, items: [] }],
          }))} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.menuCosts.map((item, index) => (
              <Card key={`${item.name}-${index}`} className="rounded-sm border-border bg-card p-5 shadow-none">
                <EditableHeader onDelete={() => setData((current) => ({
                  ...current,
                  menuCosts: current.menuCosts.filter((_, itemIndex) => itemIndex !== index),
                }))} />
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input value={item.name} onChange={(event) => updateMenu(index, { name: event.target.value })} onBlur={saveToast} className="h-10 rounded-sm border-border bg-background text-xs sm:col-span-2" />
                  <Input type="number" value={item.cost} onChange={(event) => updateMenu(index, { cost: toNumber(event.target.value) })} onBlur={saveToast} className="h-10 rounded-sm border-border bg-background text-xs" placeholder="Cost" />
                  <Input type="number" value={item.sellingPrice} onChange={(event) => updateMenu(index, { sellingPrice: toNumber(event.target.value) })} onBlur={saveToast} className="h-10 rounded-sm border-border bg-background text-xs" placeholder="Selling Price" />
                  <Input type="number" value={item.margin} onChange={(event) => updateMenu(index, { margin: toNumber(event.target.value) })} onBlur={saveToast} className="h-10 rounded-sm border-border bg-background text-xs sm:col-span-2" placeholder="Margin" />
                </div>
                <textarea
                  value={menuItemsToText(item.items)}
                  onChange={(event) => updateMenu(index, { items: textToMenuItems(event.target.value) })}
                  onBlur={saveToast}
                  placeholder="Ingredient | Qty | Cost"
                  className="mt-3 min-h-28 w-full rounded-sm border border-border bg-background p-3 text-xs text-foreground outline-none"
                />
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recipes" className="space-y-6">
          <EditableSectionTitle title="Recipes" onAdd={() => setData((current) => ({
            ...current,
            recipes: [...current.recipes, { name: 'New Recipe', ingredients: ['Ingredient 1'] }],
          }))} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.recipes.map((recipe, index) => (
              <div key={`${recipe.name}-${index}`}>
                <EditableTextList
                  title={recipe.name}
                  text={recipe.ingredients.join('\n')}
                  titlePlaceholder="Recipe Name"
                  listPlaceholder="One ingredient per line"
                  onTitleChange={(name) => setData((current) => ({
                    ...current,
                    recipes: current.recipes.map((item, itemIndex) => itemIndex === index ? { ...item, name } : item),
                  }))}
                  onTextChange={(value) => setData((current) => ({
                    ...current,
                    recipes: current.recipes.map((item, itemIndex) => itemIndex === index ? { ...item, ingredients: linesToArray(value) } : item),
                  }))}
                  onDelete={() => setData((current) => ({
                    ...current,
                    recipes: current.recipes.filter((_, itemIndex) => itemIndex !== index),
                  }))}
                  onSave={() => saveToast()}
                />
              </div>
            ))}
          </div>

          <EditableSectionTitle title="Brew Guides" onAdd={() => setData((current) => ({
            ...current,
            brewGuides: [...current.brewGuides, { name: 'New Brew Guide', dose: '', grind: '', steps: [], totalTime: '', totalYield: '' }],
          }))} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.brewGuides.map((guide, index) => (
              <Card key={`${guide.name}-${index}`} className="rounded-sm border-border bg-card p-5 shadow-none">
                <EditableHeader onDelete={() => setData((current) => ({
                  ...current,
                  brewGuides: current.brewGuides.filter((_, itemIndex) => itemIndex !== index),
                }))} />
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(['name', 'dose', 'grind', 'totalTime', 'totalYield'] as const).map((field) => (
                    <Input
                      key={field}
                      value={guide[field]}
                      onChange={(event) => setData((current) => ({
                        ...current,
                        brewGuides: current.brewGuides.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: event.target.value } : item),
                      }))}
                      onBlur={saveToast}
                      placeholder={field}
                      className="h-10 rounded-sm border-border bg-background text-xs"
                    />
                  ))}
                </div>
                <textarea
                  value={guide.steps.join('\n')}
                  onChange={(event) => setData((current) => ({
                    ...current,
                    brewGuides: current.brewGuides.map((item, itemIndex) => itemIndex === index ? { ...item, steps: linesToArray(event.target.value) } : item),
                  }))}
                  onBlur={saveToast}
                  placeholder="One step per line"
                  className="mt-3 min-h-28 w-full rounded-sm border border-border bg-background p-3 text-xs text-foreground outline-none"
                />
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="savings" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Metric icon={PiggyBank} label="Nook Savings" value={formatMoney(data.savingsEntries.reduce((sum, entry) => sum + entry.nook, 0))} />
            <Metric icon={WalletCards} label="Personal Savings" value={formatMoney(data.savingsEntries.reduce((sum, entry) => sum + entry.personal, 0))} />
            <Metric icon={Target} label="Current Target Base" value={formatMoney(data.targetEntries.find((target) => target.label === 'Current Cash')?.amount ?? null)} />
          </div>

          <EditableSectionTitle title="Savings" onAdd={() => setData((current) => ({
            ...current,
            savingsEntries: [...current.savingsEntries, { month: 'New Month', nook: 0, personal: 0, total: 0, note: '' }],
          }))} />
          <EditableGrid>
            <HeaderRow columns="grid-cols-[1fr_1fr_1fr_1fr_2fr_auto]" labels={['Month', 'Nook', 'Personal', 'Total', 'Notes', '']} />
            {data.savingsEntries.map((entry, index) => (
              <div key={`${entry.month}-${index}`} className="grid grid-cols-[1fr_1fr_1fr_1fr_2fr_auto] gap-3 border-b border-border/60 p-3">
                {(['month', 'nook', 'personal', 'total', 'note'] as const).map((field) => (
                  <Input
                    key={field}
                    type={field === 'month' || field === 'note' ? 'text' : 'number'}
                    value={entry[field]}
                    onChange={(event) => setData((current) => ({
                      ...current,
                      savingsEntries: current.savingsEntries.map((item, itemIndex) => itemIndex === index ? {
                        ...item,
                        [field]: field === 'month' || field === 'note' ? event.target.value : toNumber(event.target.value),
                      } : item),
                    }))}
                    onBlur={saveToast}
                    className="h-10 rounded-sm border-border bg-background text-xs"
                  />
                ))}
                <IconButton label="Delete Saving" onClick={() => setData((current) => ({
                  ...current,
                  savingsEntries: current.savingsEntries.filter((_, itemIndex) => itemIndex !== index),
                }))} />
              </div>
            ))}
          </EditableGrid>

          <EditableSectionTitle title="Targets" onAdd={() => setData((current) => ({
            ...current,
            targetEntries: [...current.targetEntries, { label: 'New Target', amount: 0, note: '' }],
          }))} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.targetEntries.map((target, index) => (
              <Card key={`${target.label}-${index}`} className="rounded-sm border-border bg-card p-5 shadow-none">
                <EditableHeader onDelete={() => setData((current) => ({
                  ...current,
                  targetEntries: current.targetEntries.filter((_, itemIndex) => itemIndex !== index),
                }))} />
                <Input value={target.label} onChange={(event) => setData((current) => ({
                  ...current,
                  targetEntries: current.targetEntries.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item),
                }))} onBlur={saveToast} className="mt-4 h-10 rounded-sm border-border bg-background text-xs" />
                <Input type="number" value={target.amount ?? ''} onChange={(event) => setData((current) => ({
                  ...current,
                  targetEntries: current.targetEntries.map((item, itemIndex) => itemIndex === index ? { ...item, amount: event.target.value ? toNumber(event.target.value) : null } : item),
                }))} onBlur={saveToast} className="mt-3 h-10 rounded-sm border-border bg-background text-xs" />
                <Input value={target.note || ''} onChange={(event) => setData((current) => ({
                  ...current,
                  targetEntries: current.targetEntries.map((item, itemIndex) => itemIndex === index ? { ...item, note: event.target.value } : item),
                }))} onBlur={saveToast} className="mt-3 h-10 rounded-sm border-border bg-background text-xs" placeholder="Note" />
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  function updateMenu(index: number, updates: Partial<MenuCost>) {
    setData((current) => ({
      ...current,
      menuCosts: current.menuCosts.map((item, itemIndex) => itemIndex === index ? { ...item, ...updates } : item),
    }));
  }
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <Card className="rounded-sm border-border bg-card p-5 shadow-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-foreground" />
      </div>
      <p className="mt-4 text-2xl font-light tracking-tight text-foreground">{value}</p>
    </Card>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" onClick={onClick} className="h-10 rounded-sm bg-foreground text-[10px] uppercase tracking-[0.2em] text-background">
      <Plus className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

function IconButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" aria-label={label} onClick={onClick} className="h-10 w-10 rounded-sm border-border bg-transparent p-0 text-red-500">
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

function EditableHeader({ onDelete }: { onDelete: () => void }) {
  return (
    <div className="flex justify-end border-b border-border pb-3">
      <IconButton label="Delete Row" onClick={onDelete} />
    </div>
  );
}

function EditableSectionTitle({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
      <AddButton label={`Add ${title}`} onClick={onAdd} />
    </div>
  );
}

function EditableGrid({ children }: { children: ReactNode }) {
  return (
    <Card className="overflow-x-auto rounded-sm border-border bg-card shadow-none">
      <div className="min-w-[860px]">{children}</div>
    </Card>
  );
}

function HeaderRow({ columns, labels }: { columns: string; labels: string[] }) {
  return (
    <div className={`grid ${columns} gap-3 border-b border-border p-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground`}>
      {labels.map((label) => <span key={label}>{label}</span>)}
    </div>
  );
}

function EditableTextList({
  title,
  text,
  titlePlaceholder,
  listPlaceholder,
  onTitleChange,
  onTextChange,
  onDelete,
  onSave,
}: {
  title: string;
  text: string;
  titlePlaceholder: string;
  listPlaceholder: string;
  onTitleChange: (value: string) => void;
  onTextChange: (value: string) => void;
  onDelete: () => void;
  onSave: () => void;
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Card className="rounded-sm border-border bg-card p-5 shadow-none">
      <EditableHeader onDelete={onDelete} />
      <form onSubmit={handleSubmit}>
        <Input value={title} onChange={(event) => onTitleChange(event.target.value)} onBlur={onSave} placeholder={titlePlaceholder} className="mt-4 h-10 rounded-sm border-border bg-background text-xs" />
        <textarea value={text} onChange={(event) => onTextChange(event.target.value)} onBlur={onSave} placeholder={listPlaceholder} className="mt-3 min-h-40 w-full rounded-sm border border-border bg-background p-3 text-xs text-foreground outline-none" />
      </form>
    </Card>
  );
}
