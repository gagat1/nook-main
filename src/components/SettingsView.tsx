import React from 'react';
import { useScheduleStore } from '../store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, Clock, Calendar, Users } from 'lucide-react';
import { ScheduleConstraint } from '../types';

export function SettingsView() {
  const { constraints, updateConstraints } = useScheduleStore();
  
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedConstraints: ScheduleConstraint = {
      maxConsecutiveDays: parseInt(formData.get('maxConsecutiveDays') as string),
      minRestHours: parseInt(formData.get('minRestHours') as string),
      ftMaxShiftsPerWeek: parseInt(formData.get('ftMaxShiftsPerWeek') as string),
      ftMinShiftsPerWeek: parseInt(formData.get('ftMinShiftsPerWeek') as string),
      ptMaxShiftsPerWeek: parseInt(formData.get('ptMaxShiftsPerWeek') as string),
      ptMinShiftsPerWeek: parseInt(formData.get('ptMinShiftsPerWeek') as string),
      ptMaxHoursPerWeek: parseInt(formData.get('ptMaxHoursPerWeek') as string),
      requireMorningNightEveryday: formData.get('requireMorningNightEveryday') === 'on',
    };
    
    updateConstraints(updatedConstraints);
    toast.success('System constraints updated');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-light tracking-tight text-foreground">System Protocol</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Operational Constraints & Rules Engine</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="bg-card border-border p-8 space-y-8 rounded-sm shadow-none">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Shield className="h-4 w-4 text-foreground" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Global Rules</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Max Consecutive Working Days</Label>
                <Input 
                  name="maxConsecutiveDays"
                  type="number" 
                  defaultValue={constraints.maxConsecutiveDays}
                  className="bg-background border-border text-foreground rounded-sm h-12 focus:border-accent transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Min Rest Between Shifts (Hours)</Label>
                <Input 
                  name="minRestHours"
                  type="number" 
                  defaultValue={constraints.minRestHours}
                  className="bg-background border-border text-foreground rounded-sm h-12 focus:border-accent transition-all"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-4 bg-background p-6 border border-border rounded-sm group hover:border-accent transition-all">
                <input 
                  type="checkbox" 
                  name="requireMorningNightEveryday" 
                  defaultChecked={constraints.requireMorningNightEveryday}
                  id="requireMorningNightEveryday"
                  className="h-4 w-4 rounded border-border bg-card text-foreground focus:ring-0 focus:ring-offset-0"
                />
                <div className="space-y-1">
                  <Label htmlFor="requireMorningNightEveryday" className="text-[10px] uppercase tracking-widest text-foreground font-bold cursor-pointer">Mandatory Core Coverage</Label>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-tight">Every operational day must have at least one Morning and one Night operative assigned.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Users className="h-4 w-4 text-foreground" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Workload Caps</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">FT Max Shifts / Week</Label>
                <Input 
                  name="ftMaxShiftsPerWeek"
                  type="number" 
                  defaultValue={constraints.ftMaxShiftsPerWeek}
                  className="bg-background border-border text-foreground rounded-sm h-12 focus:border-accent transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">FT Min Shifts / Week</Label>
                <Input 
                  name="ftMinShiftsPerWeek"
                  type="number" 
                  defaultValue={constraints.ftMinShiftsPerWeek}
                  className="bg-background border-border text-foreground rounded-sm h-12 focus:border-accent transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">PT Max Shifts / Week</Label>
                <Input 
                  name="ptMaxShiftsPerWeek"
                  type="number" 
                  defaultValue={constraints.ptMaxShiftsPerWeek}
                  className="bg-background border-border text-foreground rounded-sm h-12 focus:border-accent transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">PT Min Shifts / Week</Label>
                <Input 
                  name="ptMinShiftsPerWeek"
                  type="number" 
                  defaultValue={constraints.ptMinShiftsPerWeek}
                  className="bg-background border-border text-foreground rounded-sm h-12 focus:border-accent transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">PT Max Working Hours / Week</Label>
                <Input 
                  name="ptMaxHoursPerWeek"
                  type="number" 
                  defaultValue={constraints.ptMaxHoursPerWeek}
                  className="bg-background border-emerald-900/30 text-foreground rounded-sm h-12 focus:border-emerald-500 transition-all shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                />
                <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">This rule overrides shift counts if duration is reached.</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <Button type="submit" className="w-full bg-foreground text-background hover:opacity-90 uppercase text-[11px] tracking-[0.2em] font-bold h-14 rounded-sm">
              Commit System Protocols
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
