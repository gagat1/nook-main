import React, { useState } from 'react';
import { Plus, MoreVertical, Clock, Trash2, Edit2, Copy, Power, PowerOff, Users, ArrowRight } from 'lucide-react';
import { useScheduleStore } from '../store';
import { ShiftTemplate, ShiftPriority } from '../types';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const COLORS = [
  '#fbbf24', '#f97316', '#ef4444', '#ec4899', '#8b5cf6', 
  '#3b82f6', '#06b6d4', '#10b981', '#1e293b', '#475569'
];

export function ShiftsView() {
  const { shifts, addShift, updateShift, deleteShift, duplicateShift } = useScheduleStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Partial<ShiftTemplate> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const shift: ShiftTemplate = {
      id: editingShift?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      color: formData.get('color') as string,
      minStaff: Number(formData.get('minStaff')),
      maxStaff: Number(formData.get('maxStaff')),
      priority: formData.get('priority') as ShiftPriority,
      isActive: editingShift?.isActive ?? true,
      daySpecificStaffing: editingShift?.daySpecificStaffing,
    };

    if (editingShift?.id) {
      updateShift(shift);
      toast.success('Shift template updated');
    } else {
      addShift(shift);
      toast.success('Shift template created');
    }
    setIsDialogOpen(false);
    setEditingShift(null);
  };

  const handleEdit = (shift: ShiftTemplate) => {
    setEditingShift(shift);
    setIsDialogOpen(true);
  };

  const getPriorityColor = (p: ShiftPriority) => {
    switch (p) {
      case 'High': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Medium': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Shift.Architecture</h1>
          <p className="text-4xl font-light tracking-tight text-foreground">Structural Templates</p>
        </div>
        <Button onClick={() => { setEditingShift(null); setIsDialogOpen(true); }} className="bg-foreground text-background hover:opacity-90 uppercase text-[10px] tracking-[0.2em] font-bold px-8 py-6 rounded-sm">
          <Plus className="mr-2 h-4 w-4" /> Create Framework
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shifts.map((shift) => (
          <div key={shift.id} className="bg-card border border-border rounded-sm overflow-hidden group hover:border-accent transition-all relative">
            <div className="h-0.5" style={{ backgroundColor: shift.color }} />
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground group-hover:text-foreground transition-colors">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-light tracking-tight text-foreground">{shift.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={cn("text-[9px] uppercase tracking-[0.2em] font-bold", getPriorityColor(shift.priority).split(' ').pop())}>
                        {shift.priority}
                      </span>
                      {!shift.isActive && <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-red-900 border border-red-900/20 px-1.5 rounded-sm">Hibernated</span>}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-muted-foreground hover:text-foreground cursor-pointer")}>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border border-border text-muted-foreground rounded-sm">
                    <DropdownMenuItem onClick={() => handleEdit(shift)} className="hover:bg-accent hover:text-foreground cursor-pointer uppercase text-[10px] tracking-widest py-3">
                      <Edit2 className="mr-2 h-3.5 w-3.5" /> Modify Spec
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { duplicateShift(shift.id); toast.success('Shift duplicated'); }} className="hover:bg-accent hover:text-foreground cursor-pointer uppercase text-[10px] tracking-widest py-3">
                      <Copy className="mr-2 h-3.5 w-3.5" /> Clone Template
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateShift({ ...shift, isActive: !shift.isActive })}
                      className="hover:bg-accent hover:text-foreground cursor-pointer uppercase text-[10px] tracking-widest py-3"
                    >
                      {shift.isActive ? <PowerOff className="mr-2 h-3.5 w-3.5" /> : <Power className="mr-2 h-3.5 w-3.5" />}
                      {shift.isActive ? 'Decommission' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem 
                      onClick={() => { deleteShift(shift.id); toast.info('Shift template deleted'); }} 
                      className="text-red-900 hover:bg-red-950/20 hover:text-red-500 cursor-pointer uppercase text-[10px] tracking-widest py-3"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Purge
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between p-4 border border-border bg-card/50 rounded-sm">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-1">Entrance</span>
                    <span className="text-xl font-light tracking-tighter text-foreground font-mono">{shift.startTime}</span>
                  </div>
                  <div className="h-[1px] w-8 bg-border" />
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-1">Exit</span>
                    <span className="text-xl font-light tracking-tighter text-foreground font-mono">{shift.endTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Min Staff: <b className="text-foreground border-b border-border ml-1">{shift.minStaff}</b></span>
                    <span>Max Staff: <b className="text-foreground border-b border-border ml-1">{shift.maxStaff}</b></span>
                  </div>
                </div>

                {shift.daySpecificStaffing && shift.daySpecificStaffing.length > 0 && (
                  <div className="pt-6 border-t border-border space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Active Overrides</span>
                    <div className="flex flex-wrap gap-2">
                      {shift.daySpecificStaffing.map(d => (
                        <Badge key={d.dayOfWeek} variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[8px] tracking-tighter rounded-none">
                          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.dayOfWeek]}: {d.minStaff}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent key={editingShift?.id || 'new'} className="bg-card border border-border text-foreground max-w-lg rounded-sm flex flex-col h-[85vh] overflow-hidden p-0 gap-0">
          <DialogHeader className="p-10 pb-4">
            <DialogTitle className="text-2xl font-light tracking-tight">{editingShift ? 'Modify Template' : 'Initialize Template'}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-10 py-4 custom-scrollbar">
            <form id="shift-form" onSubmit={handleSave} className="space-y-10 pb-8">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Protocol Name</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={editingShift?.name || ''} 
                required 
                placeholder="e.g. ALPHA_MORNING"
                className="bg-background border-border text-foreground rounded-sm py-6 uppercase tracking-[0.15em] text-xs focus:border-accent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="startTime" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Start Cycle</Label>
                <Input 
                  id="startTime" 
                  name="startTime" 
                  type="time"
                  defaultValue={editingShift?.startTime || '08:00'} 
                  required 
                  className="bg-background border-border text-foreground rounded-sm py-6 text-xs focus:border-accent transition-all"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="endTime" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">End Cycle</Label>
                <Input 
                  id="endTime" 
                  name="endTime" 
                  type="time"
                  defaultValue={editingShift?.endTime || '17:00'} 
                  required 
                  className="bg-background border-border text-foreground rounded-sm py-6 text-xs focus:border-accent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="minStaff" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Personnel Min</Label>
                <Input 
                  id="minStaff" 
                  name="minStaff" 
                  type="number"
                  min="1"
                  defaultValue={editingShift?.minStaff || 1} 
                  required 
                  className="bg-background border-border text-foreground rounded-sm py-6 text-xs focus:border-accent transition-all"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="maxStaff" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Personnel Max</Label>
                <Input 
                  id="maxStaff" 
                  name="maxStaff" 
                  type="number"
                  min="1"
                  defaultValue={editingShift?.maxStaff || 2} 
                  required 
                  className="bg-background border-border text-foreground rounded-sm py-6 text-xs focus:border-accent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="priority" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Priority Rank</Label>
                <Select 
                  name="priority_select" 
                  value={editingShift?.priority || 'Medium'}
                  onValueChange={(v) => setEditingShift(prev => ({ ...prev, priority: v as ShiftPriority }))}
                >
                  <SelectTrigger className="bg-background border-border text-foreground rounded-sm py-6 uppercase tracking-widest text-[10px]">
                    <SelectValue placeholder="Selection" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="High" className="uppercase text-[10px] tracking-widest hover:bg-accent transition-colors">Crucial</SelectItem>
                    <SelectItem value="Medium" className="uppercase text-[10px] tracking-widest hover:bg-accent transition-colors">Balanced</SelectItem>
                    <SelectItem value="Low" className="uppercase text-[10px] tracking-widest hover:bg-accent transition-colors">Peripheral</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="priority" value={editingShift?.priority || 'Medium'} />
              </div>
              <div className="space-y-3">
                <Label htmlFor="color" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Identification Hex</Label>
                <div className="flex flex-wrap gap-2 pt-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditingShift(prev => ({ ...prev, color: c }))}
                      className={cn(
                        "h-6 w-6 rounded-sm border transition-all hover:scale-110",
                        (editingShift?.color === c || (!editingShift?.color && c === COLORS[0])) ? "border-foreground scale-110" : "border-border"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input type="hidden" name="color" value={editingShift?.color || COLORS[0]} />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <div className="flex flex-col gap-1">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Dynamic Staffing Overrides</Label>
                <p className="text-[9px] uppercase tracking-tight text-muted-foreground opacity-60">Specify higher personnel requirements for high-load days.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => {
                  const override = editingShift?.daySpecificStaffing?.find(d => d.dayOfWeek === idx);
                  return (
                    <div key={day} className="flex items-center justify-between bg-background p-4 border border-border rounded-sm group hover:border-accent transition-all">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{day}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] uppercase tracking-tighter text-muted-foreground">Min Personnel:</span>
                        <Input 
                          type="number"
                          className="w-16 h-8 bg-card border-border text-xs text-center focus:border-accent transition-all rounded-none"
                          value={override?.minStaff || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const current = editingShift?.daySpecificStaffing || [];
                            let updated;
                            if (isNaN(val)) {
                              updated = current.filter(d => d.dayOfWeek !== idx);
                            } else {
                              const existing = current.find(d => d.dayOfWeek === idx);
                              if (existing) {
                                updated = current.map(d => d.dayOfWeek === idx ? { ...d, minStaff: val } : d);
                              } else {
                                updated = [...current, { dayOfWeek: idx, minStaff: val }];
                              }
                            }
                            setEditingShift(prev => ({ ...prev, daySpecificStaffing: updated }));
                          }}
                          placeholder="DEF"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
          </div>
          
          <DialogFooter className="p-10 pt-8 border-t border-border bg-card z-20 flex-shrink-0">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-accent uppercase text-[10px] tracking-widest px-8 py-6 rounded-sm">
              ABORT
            </Button>
            <Button type="submit" form="shift-form" className="bg-foreground text-background hover:opacity-90 uppercase text-[10px] tracking-[0.2em] font-bold px-8 py-6 rounded-sm shadow-none">
              COMMIT ARCHITECTURE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
