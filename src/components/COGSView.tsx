import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Calculator, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface OtherCost {
  id: string;
  name: string;
  totalPrice: number;
  piecesPerPack: number;
  dosePerBrew: number;
}

export function COGSView() {
  const [note, setNote] = useState('');
  const [basePrice, setBasePrice] = useState(150000);
  const [weightPurchased, setWeightPurchased] = useState(1000); // in grams
  const [dosePerBrew, setDosePerBrew] = useState(15);
  const [profitMargin, setProfitMargin] = useState(60);
  const [otherCosts, setOtherCosts] = useState<OtherCost[]>([
    { id: '1', name: 'Cup & Lid', totalPrice: 50000, piecesPerPack: 50, dosePerBrew: 1 }
  ]);
  const [customPrice, setCustomPrice] = useState<number | ''>('');

  const addOtherCost = () => {
    setOtherCosts([
      ...otherCosts,
      { id: Date.now().toString(), name: '', totalPrice: 0, piecesPerPack: 1, dosePerBrew: 1 }
    ]);
  };

  const removeOtherCost = (id: string) => {
    setOtherCosts(otherCosts.filter(c => c.id !== id));
  };

  const updateOtherCost = (id: string, field: keyof OtherCost, value: any) => {
    setOtherCosts(otherCosts.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const results = useMemo(() => {
    const costPerGram = basePrice / weightPurchased;
    const baseCostPerBrew = costPerGram * dosePerBrew;
    
    const otherCostItems = otherCosts.map(c => ({
      name: c.name || 'Unnamed Cost',
      costPerBrew: c.piecesPerPack > 0 ? (c.totalPrice / c.piecesPerPack) * c.dosePerBrew : 0
    }));

    const totalOtherCostPerBrew = otherCostItems.reduce((acc, c) => acc + c.costPerBrew, 0);
    const totalCostPerBrew = baseCostPerBrew + totalOtherCostPerBrew;
    
    // Selling Price calculation based on margin: Cost / (1 - margin/100)
    // Actually common HPP Recommended = Cost * (1 + margin/100) or Cost / (1 - margin/100)
    // The image says Profit Margin is (Selling - Cost) / Selling.
    // So Selling = Cost / (1 - margin/100)
    const recommendedPrice = profitMargin < 100 ? totalCostPerBrew / (1 - profitMargin / 100) : totalCostPerBrew;
    
    let customMargin = 0;
    let customProfit = 0;
    if (customPrice && customPrice > 0) {
      customProfit = customPrice - totalCostPerBrew;
      customMargin = (customProfit / customPrice) * 100;
    }

    return {
      costPerGram,
      baseCostPerBrew,
      otherCostItems,
      totalOtherCostPerBrew,
      totalCostPerBrew,
      recommendedPrice,
      customMargin,
      customProfit
    };
  }, [basePrice, weightPurchased, dosePerBrew, otherCosts, profitMargin, customPrice]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-light tracking-tight text-foreground flex items-center gap-4">
          COGS Calculator <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground border border-border px-2 py-0.5 rounded-sm">HPP V2.1</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Cost Of Goods Sold & Pricing Engine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <Card className="bg-card border-border p-8 rounded-sm shadow-none space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Note (Optional)</Label>
              <Input 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Ethiopian beans batch"
                className="bg-background border-border text-foreground rounded-sm h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Beans Price (IDR)</Label>
                <Input 
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="bg-background border-border text-foreground rounded-sm h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Weight Purchased</Label>
                <Select value={weightPurchased.toString()} onValueChange={(v) => setWeightPurchased(Number(v))}>
                  <SelectTrigger className="bg-background border-border text-foreground rounded-sm h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="250">250g</SelectItem>
                    <SelectItem value="500">500g</SelectItem>
                    <SelectItem value="1000">1kg</SelectItem>
                    <SelectItem value="5000">5kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Coffee Dose per Brew (g)</Label>
              <Input 
                type="number"
                value={dosePerBrew}
                onChange={(e) => setDosePerBrew(Number(e.target.value))}
                className="bg-background border-border text-foreground rounded-sm h-12"
              />
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Other Costs</Label>
                <Button variant="ghost" size="sm" onClick={addOtherCost} className="h-8 text-accent">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {otherCosts.map((cost) => (
                  <div key={cost.id} className="space-y-4 bg-muted/20 p-4 rounded-sm border border-border/50 relative group">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeOtherCost(cost.id)} 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold italic">Item Description</Label>
                      <Input 
                        value={cost.name}
                        onChange={(e) => updateOtherCost(cost.id, 'name', e.target.value)}
                        placeholder="Item name (e.g. Sugar, Cup, Straw)"
                        className="h-10 text-xs bg-background"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Total Price</Label>
                        <Input 
                          type="number"
                          value={cost.totalPrice}
                          onChange={(e) => updateOtherCost(cost.id, 'totalPrice', Number(e.target.value))}
                          className="h-10 text-xs bg-background"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Qty/Pack</Label>
                        <Input 
                          type="number"
                          value={cost.piecesPerPack}
                          onChange={(e) => updateOtherCost(cost.id, 'piecesPerPack', Number(e.target.value))}
                          className="h-10 text-xs bg-background"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Use/Brew</Label>
                        <Input 
                          type="number"
                          value={cost.dosePerBrew}
                          onChange={(e) => updateOtherCost(cost.id, 'dosePerBrew', Number(e.target.value))}
                          className="h-10 text-xs bg-background"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {otherCosts.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-sm">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">No additional costs defined</p>
                    <Button variant="ghost" size="sm" onClick={addOtherCost} className="mt-4 text-accent h-10 px-6 uppercase text-[10px] tracking-widest">
                      <Plus className="h-4 w-4 mr-2" /> Add First Item
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Profit Margin Goal</Label>
              <Select value={profitMargin.toString()} onValueChange={(v) => setProfitMargin(Number(v))}>
                <SelectTrigger className="bg-background border-border text-foreground rounded-sm h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground">
                  {[20, 30, 40, 50, 60, 70, 80].map(m => (
                    <SelectItem key={m} value={m.toString()}>{m}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <Card className="bg-card border-border p-0 rounded-sm shadow-none overflow-hidden h-full flex flex-col">
            <div className="p-8 space-y-8 flex-1">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <Calculator className="h-4 w-4 text-accent" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">Analysis Output</span>
              </div>

              <div className="space-y-6">
                 <div className="flex justify-between items-center bg-background/30 p-4 rounded-sm border border-border/50">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Cost per gram:</span>
                    <span className="text-sm font-mono text-foreground font-bold">{formatCurrency(results.costPerGram)}</span>
                 </div>
                 
                 <div className="flex justify-between items-center bg-background/30 p-4 rounded-sm border border-border/50">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Base Cost per brew:</span>
                    <span className="text-sm font-mono text-foreground font-bold">{formatCurrency(results.baseCostPerBrew)}</span>
                 </div>

                 {results.otherCostItems.length > 0 && (
                   <div className="space-y-3 p-4 bg-background/20 rounded-sm border border-border/20">
                     <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold block mb-2">Other Costs Breakdown</span>
                     {results.otherCostItems.map((item, i) => (
                       <div key={i} className="flex justify-between text-[10px] tracking-widest">
                         <span className="text-muted-foreground italic">{item.name}</span>
                         <span className="text-foreground font-mono">{formatCurrency(item.costPerBrew)}</span>
                       </div>
                     ))}
                     <div className="pt-2 border-t border-border/50 flex justify-between text-[10px] font-bold">
                       <span className="text-muted-foreground uppercase">Total Other:</span>
                       <span className="text-foreground">{formatCurrency(results.totalOtherCostPerBrew)}</span>
                     </div>
                   </div>
                 )}

                 <div className="flex justify-between items-center pt-4">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Target Profit Margin:</span>
                    <span className="text-md font-mono text-accent font-bold">{profitMargin}%</span>
                 </div>
              </div>
            </div>

            <div className="bg-accent/5 p-8 border-t border-border mt-auto">
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-black">Recommended Selling Price</span>
                <div className="text-5xl font-light tracking-tighter text-foreground">
                  {formatCurrency(results.recommendedPrice)}
                </div>
                <div className="bg-accent text-[9px] text-white px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                  {profitMargin}% Profitability
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-border bg-background/50">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Custom Selling Price (IDR)</Label>
                  <Input 
                    type="number"
                    placeholder="e.g. 25000"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="bg-background border-border text-foreground rounded-sm h-12"
                  />
                </div>
                
                {customPrice && customPrice > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-2 gap-4 p-4 bg-background rounded-sm border border-border"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase text-muted-foreground font-bold block">Resulting Margin</span>
                      <div className={cn(
                        "text-lg font-bold font-mono",
                        results.customMargin >= profitMargin ? "text-emerald-500" : "text-amber-500"
                      )}>
                        {results.customMargin.toFixed(1)}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase text-muted-foreground font-bold block">Net Profit/Unit</span>
                      <div className="text-lg font-bold font-mono text-foreground">
                        {formatCurrency(results.customProfit)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-sm flex gap-4 items-start">
        <Info className="h-5 w-5 text-amber-500 shrink-0" />
        <div className="space-y-1">
          <p className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">Pricing Policy Notice</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Profit margin is calculated using the formula: <code className="bg-amber-500/10 px-1 rounded">((Price - Cost) / Price) × 100</code>. 
            This represents the portion of each sale that is profit. Recommended prices are rounded to the nearest integer.
          </p>
        </div>
      </div>
    </div>
  );
}
