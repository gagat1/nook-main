import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Banknote, RotateCcw, Calculator } from 'lucide-react';
import { motion } from 'motion/react';

const DENOMINATIONS = [
  { value: 100000, label: 'Rp 100.000' },
  { value: 50000, label: 'Rp 50.000' },
  { value: 20000, label: 'Rp 20.000' },
  { value: 10000, label: 'Rp 10.000' },
  { value: 5000, label: 'Rp 5.000' },
  { value: 2000, label: 'Rp 2.000' },
  { value: 1000, label: 'Rp 1.000' },
  { value: 500, label: 'Rp 500' },
  { value: 200, label: 'Rp 200' },
  { value: 100, label: 'Rp 100' },
];

export function CashCounterView() {
  const [counts, setCounts] = useState<Record<number, number>>(
    DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom.value]: 0 }), {})
  );

  const total = DENOMINATIONS.reduce((acc, denom) => {
    return acc + denom.value * (counts[denom.value] || 0);
  }, 0);

  const handleReset = () => {
    setCounts(DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom.value]: 0 }), {}));
  };

  const handleInputChange = (value: number, count: string) => {
    const numCount = parseInt(count) || 0;
    setCounts(prev => ({ ...prev, [value]: numCount }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-light tracking-tight text-foreground flex items-center gap-4">
          Cash Counter <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground border border-border px-2 py-0.5 rounded-sm">V1.0</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Denomination Processing Unit</p>
      </div>

      <Card className="bg-card border-border p-8 rounded-sm shadow-none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DENOMINATIONS.map((denom) => (
            <div key={denom.value} className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                {denom.label}
              </Label>
              <div className="relative group">
                <Input
                  type="number"
                  min="0"
                  value={counts[denom.value] === 0 ? '' : counts[denom.value]}
                  onChange={(e) => handleInputChange(denom.value, e.target.value)}
                  placeholder="0"
                  className="bg-background border-border text-foreground rounded-sm h-12 focus:border-accent transition-all pl-10"
                />
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground">
                  {formatCurrency(denom.value * (counts[denom.value] || 0))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Grand Total Allocation</span>
            <div className="text-5xl font-light tracking-tighter text-emerald-500 mt-2">
              {formatCurrency(total)}
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-accent uppercase text-[10px] tracking-widest px-8 h-12 rounded-sm"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Registry
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border p-6 rounded-sm shadow-none">
          <h3 className="text-[12px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-4">
            <Calculator className="h-3.5 w-3.5" /> Calculation Breakdown
          </h3>
          <div className="space-y-3">
             {DENOMINATIONS.filter(d => counts[d.value] > 0).map(d => (
               <div key={d.value} className="flex justify-between items-center text-[11px] uppercase tracking-widest border-b border-border/50 pb-2">
                 <span className="text-muted-foreground">{d.label} × {counts[d.value]}</span>
                 <span className="font-mono text-foreground">{formatCurrency(d.value * counts[d.value])}</span>
               </div>
             ))}
             {DENOMINATIONS.filter(d => counts[d.value] > 0).length === 0 && (
               <p className="text-[10px] uppercase tracking-widest text-muted-foreground italic">No entries detected.</p>
             )}
          </div>
        </Card>
      </div>
    </div>
  );
}
