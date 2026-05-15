import { BookOpen, Coffee, PiggyBank, Target, WalletCards } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  brewGuides,
  costIngredients,
  menuCosts,
  recipes,
  roasteryGroups,
  savingsEntries,
  targetEntries,
} from '../data/veteranBusiness';

const money = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

function formatMoney(value: number | null) {
  if (value == null) return '-';
  return money.format(Math.round(value));
}

export function BusinessDataView() {
  const savingTotal = savingsEntries.reduce((sum, entry) => sum + entry.total, 0);
  const menuMargin = menuCosts.reduce((sum, item) => sum + item.margin, 0);

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">NOOK BREW.Business Data</h1>
        <p className="text-3xl font-light tracking-tight text-foreground md:text-4xl">Roastery, COGS, Recipes, Savings & Targets</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Coffee} label="Roastery Regions" value={String(roasteryGroups.length)} />
        <Metric icon={BookOpen} label="Recipes" value={String(recipes.length)} />
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

        <TabsContent value="roastery">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {roasteryGroups.map((group) => (
              <Card key={group.region} className="rounded-sm border-border bg-card p-5 shadow-none">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{group.region}</h2>
                  <span className="font-mono text-xs text-foreground">{group.roasteries.length}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.roasteries.map((roastery) => (
                    <span key={roastery} className="rounded-sm border border-border px-3 py-1 text-[10px] uppercase tracking-widest text-foreground">
                      {roastery}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cogs" className="space-y-6">
          <Card className="overflow-x-auto rounded-sm border-border bg-card shadow-none">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-3 gap-4 border-b border-border px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <span>Ingredient</span>
                <span>Purchase Cost</span>
                <span>Pack Size</span>
              </div>
              {costIngredients.map((item) => (
                <div key={item.name} className="grid grid-cols-3 gap-4 border-b border-border/60 px-6 py-4 text-xs text-foreground">
                  <span>{item.name}</span>
                  <span>{formatMoney(item.cost)}</span>
                  <span>{item.packSize}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {menuCosts.map((item) => (
              <Card key={item.name} className="rounded-sm border-border bg-card p-5 shadow-none">
                <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Cost {formatMoney(item.cost)} / Price {formatMoney(item.sellingPrice)}</p>
                  </div>
                  <span className="font-mono text-xs text-emerald-500">{formatMoney(item.margin)}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {item.items.map((ingredient) => (
                    <div key={`${item.name}-${ingredient.name}-${ingredient.qty}`} className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>{ingredient.name} / {ingredient.qty}</span>
                      <span className="font-mono text-foreground">{formatMoney(ingredient.cost)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recipes" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe) => (
              <Card key={recipe.name} className="rounded-sm border-border bg-card p-5 shadow-none">
                <h3 className="border-b border-border pb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{recipe.name}</h3>
                <ul className="mt-4 space-y-2">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={`${recipe.name}-${ingredient}`} className="text-xs text-foreground">{ingredient}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {brewGuides.map((guide) => (
              <Card key={guide.name} className="rounded-sm border-border bg-card p-5 shadow-none">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{guide.name}</h3>
                  <span className="font-mono text-xs text-foreground">{guide.totalYield}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <span className="text-muted-foreground">Dose</span>
                  <span className="text-foreground">{guide.dose}</span>
                  <span className="text-muted-foreground">Grind</span>
                  <span className="text-foreground">{guide.grind}</span>
                  <span className="text-muted-foreground">Total Time</span>
                  <span className="text-foreground">{guide.totalTime}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {guide.steps.map((step) => (
                    <p key={step} className="text-xs text-foreground">{step}</p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="savings" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Metric icon={PiggyBank} label="Nook Savings" value={formatMoney(savingsEntries.reduce((sum, entry) => sum + entry.nook, 0))} />
            <Metric icon={WalletCards} label="Personal Savings" value={formatMoney(savingsEntries.reduce((sum, entry) => sum + entry.personal, 0))} />
            <Metric icon={Target} label="Current Target Base" value={formatMoney(targetEntries.find((target) => target.label === 'Current Cash')?.amount ?? null)} />
          </div>

          <Card className="overflow-x-auto rounded-sm border-border bg-card shadow-none">
            <div className="min-w-[820px]">
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr_2fr] gap-4 border-b border-border px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <span>Month</span>
                <span>Nook</span>
                <span>Personal</span>
                <span>Total</span>
                <span>Notes</span>
              </div>
              {savingsEntries.map((entry) => (
                <div key={entry.month} className="grid grid-cols-[1fr_1fr_1fr_1fr_2fr] gap-4 border-b border-border/60 px-6 py-4 text-xs text-foreground">
                  <span>{entry.month}</span>
                  <span>{formatMoney(entry.nook)}</span>
                  <span>{formatMoney(entry.personal)}</span>
                  <span>{formatMoney(entry.total)}</span>
                  <span className="text-muted-foreground">{entry.note || '-'}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {targetEntries.map((target) => (
              <Card key={target.label} className="rounded-sm border-border bg-card p-5 shadow-none">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{target.label}</p>
                <p className="mt-4 text-xl font-light tracking-tight text-foreground">{formatMoney(target.amount)}</p>
                {target.note && <p className="mt-2 text-xs text-muted-foreground">{target.note}</p>}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Coffee; label: string; value: string }) {
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
