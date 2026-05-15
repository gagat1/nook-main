import React, { useState } from 'react';
import { Plus, MoreVertical, UserPlus, Trash2, Edit2, Shield, ShieldOff, DollarSign } from 'lucide-react';
import { useScheduleStore } from '../store';
import { Employee, EmploymentType } from '../types';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', 
  '#ef4444', '#06b6d4', '#84cc16', '#a855f7', '#6366f1'
];

export function EmployeesView() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, shifts } = useScheduleStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee> | null>(null);

  const closeEmployeeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDialogOpenChange = (openChange: boolean | { open: boolean }) => {
    const nextOpen = typeof openChange === 'boolean' ? openChange : openChange.open;

    setIsDialogOpen(nextOpen);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = (formData.get('name') as string).trim();
    const morningTarget = Number(formData.get('morningTarget') || 0);
    const nightTarget = Number(formData.get('nightTarget') || 0);

    if (!name) {
      toast.error('Employee name is required');
      return;
    }
    
    const emp: Employee = {
      id: editingEmployee?.id || Math.random().toString(36).substr(2, 9),
      name,
      type: formData.get('type') as EmploymentType,
      color: formData.get('color') as string,
      isActive: editingEmployee?.isActive ?? true,
      dailyWage: formData.get('dailyWage') ? Number(formData.get('dailyWage')) : undefined,
      fixedOffDays: editingEmployee?.fixedOffDays || [],
      preferredShiftIds: editingEmployee?.preferredShiftIds || [],
      coreShiftTargets: {
        morning: morningTarget > 0 ? morningTarget : undefined,
        night: nightTarget > 0 ? nightTarget : undefined,
      },
    };

    if (editingEmployee?.id) {
      updateEmployee(emp);
      toast.success('Employee updated');
    } else {
      addEmployee(emp);
      toast.success('Employee added');
    }
    closeEmployeeDialog();
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingEmployee({
      type: 'Fulltime',
      color: COLORS[0],
      fixedOffDays: [],
      preferredShiftIds: [],
      coreShiftTargets: { morning: 3, night: 3 },
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Personnel.Database</h1>
          <p className="text-4xl font-light tracking-tight text-foreground">Team Registry</p>
        </div>
        <Button onClick={handleCreate} className="bg-foreground text-background hover:opacity-90 uppercase text-[10px] tracking-[0.2em] font-bold px-8 py-6 rounded-sm">
          <UserPlus className="mr-2 h-4 w-4" /> Add Operative
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-card border border-border rounded-sm overflow-hidden group hover:border-accent transition-colors relative">
            <div className="h-1" style={{ backgroundColor: emp.color }} />
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div 
                    className="h-10 w-10 flex items-center justify-center text-foreground font-bold border border-border"
                    style={{ backgroundColor: `${emp.color}22`, borderColor: emp.color }}
                  >
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-light tracking-tight text-foreground">{emp.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={cn(
                        "text-[9px] uppercase tracking-[0.2em] font-bold",
                        emp.type === 'Fulltime' ? "text-blue-500" : "text-amber-500"
                      )}>
                        {emp.type}
                      </span>
                      {!emp.isActive && <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-red-500 border border-red-900/30 px-1.5 rounded-sm">Inactive</span>}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-muted-foreground hover:text-foreground cursor-pointer")}>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border border-border text-muted-foreground rounded-sm">
                    <DropdownMenuItem onClick={() => handleEdit(emp)} className="hover:bg-accent hover:text-foreground cursor-pointer uppercase text-[10px] tracking-widest py-3">
                      <Edit2 className="mr-2 h-3.5 w-3.5" /> Edit Record
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateEmployee({ ...emp, isActive: !emp.isActive })}
                      className="hover:bg-accent hover:text-foreground cursor-pointer uppercase text-[10px] tracking-widest py-3"
                    >
                      {emp.isActive ? <ShieldOff className="mr-2 h-3.5 w-3.5" /> : <Shield className="mr-2 h-3.5 w-3.5" />}
                      {emp.isActive ? 'Suspend' : 'Reinstate'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem 
                      onClick={() => { deleteEmployee(emp.id); toast.info('Employee removed'); }} 
                      className="text-red-900 hover:bg-red-950/20 hover:text-red-500 cursor-pointer uppercase text-[10px] tracking-widest py-3"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Purge Record
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-6">
                {(emp.dailyWage !== undefined && emp.dailyWage > 0) && (
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Remuneration / Day</span>
                    <span className="text-sm font-mono text-foreground font-medium">Rp{emp.dailyWage?.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="space-y-3">
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Off Cycle Days</p>
                  <div className="flex flex-wrap gap-2">
                    {emp.fixedOffDays.length > 0 ? (
                      emp.fixedOffDays.map(d => (
                        <span key={d} className="text-[9px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5 rounded-sm">
                          {DAYS[d]}
                        </span>
                      ))
                    ) : (
                      <span className="text-[9px] text-muted-foreground opacity-50 uppercase tracking-widest italic">Always Available</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Weekly Core Targets</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5 rounded-sm">
                      Morning {emp.coreShiftTargets?.morning ?? '-'}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5 rounded-sm">
                      Night {emp.coreShiftTargets?.night ?? '-'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Shift Affinities</p>
                  <div className="flex flex-wrap gap-2">
                    {emp.preferredShiftIds.length > 0 ? (
                      emp.preferredShiftIds.map(sid => {
                        const s = shifts.find(st => st.id === sid);
                        return (
                          <span key={sid} className="text-[9px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5 rounded-sm flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: s?.color }} />
                            {s?.name}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[9px] text-muted-foreground opacity-50 uppercase tracking-widest italic">Neutral Profile</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent key={editingEmployee?.id || 'new'} className="bg-card border border-border text-foreground max-w-2xl rounded-sm flex flex-col h-[90vh] overflow-hidden p-0 gap-0">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-light tracking-tight">{editingEmployee?.id ? 'Update Operative' : 'Enroll Operative'}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
            <form id="employee-form" onSubmit={handleSave} className="space-y-10 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Identified Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    defaultValue={editingEmployee?.name || ''} 
                    required 
                    placeholder="FULL NAME"
                    className="bg-background border-border text-foreground rounded-sm uppercase tracking-widest text-xs focus:border-accent transition-all py-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Assignment Type</Label>
                  <Select 
                    name="type_select" 
                    value={editingEmployee?.type || 'Fulltime'}
                    onValueChange={(v) => setEditingEmployee(prev => ({ ...prev, type: v as EmploymentType }))}
                  >
                    <SelectTrigger className="bg-background border-border text-foreground rounded-sm py-6 uppercase tracking-widest text-xs">
                      <SelectValue placeholder="Selection" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="Fulltime" className="uppercase text-[10px] tracking-widest hover:bg-accent transition-colors">Full-Time (FT)</SelectItem>
                      <SelectItem value="Parttime" className="uppercase text-[10px] tracking-widest hover:bg-accent transition-colors">Part-Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="type" value={editingEmployee?.type || 'Fulltime'} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Visual Key</Label>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditingEmployee(prev => ({ ...prev, color: c }))}
                        className={cn(
                          "h-6 w-6 rounded-sm border transition-all hover:scale-110",
                          (editingEmployee?.color === c || (!editingEmployee?.color && c === COLORS[0])) ? "border-foreground scale-110" : "border-border"
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input type="hidden" name="color" value={editingEmployee?.color || COLORS[0]} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dailyWage" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Remuneration Ratio</Label>
                  <Input 
                    id="dailyWage" 
                    name="dailyWage" 
                    type="number"
                    defaultValue={editingEmployee?.dailyWage || ''} 
                    placeholder="0.00"
                    className="bg-background border-border text-foreground rounded-sm py-6 text-xs focus:border-accent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="morningTarget" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Morning / Week</Label>
                  <Input
                    id="morningTarget"
                    name="morningTarget"
                    type="number"
                    min="0"
                    defaultValue={editingEmployee?.coreShiftTargets?.morning ?? 3}
                    className="bg-background border-border text-foreground rounded-sm py-6 text-xs focus:border-accent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nightTarget" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Night / Week</Label>
                  <Input
                    id="nightTarget"
                    name="nightTarget"
                    type="number"
                    min="0"
                    defaultValue={editingEmployee?.coreShiftTargets?.night ?? 3}
                    className="bg-background border-border text-foreground rounded-sm py-6 text-xs focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Cycle Restrictions (Off Days)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DAYS.map((day, idx) => (
                    <div key={day} className="flex items-center space-x-3 bg-background p-4 rounded-sm border border-border hover:bg-accent transition-colors cursor-pointer group">
                      <Checkbox 
                        id={`day-${idx}`} 
                        checked={editingEmployee?.fixedOffDays?.includes(idx) || false}
                        onCheckedChange={(checked) => {
                          const current = editingEmployee?.fixedOffDays || [];
                          const updated = checked 
                            ? [...current, idx] 
                            : current.filter(d => d !== idx);
                          setEditingEmployee(prev => ({ ...prev, fixedOffDays: updated }));
                        }}
                        className="border-muted-foreground"
                      />
                      <label htmlFor={`day-${idx}`} className="text-[10px] font-bold uppercase tracking-widest cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors">
                        {day.slice(0, 3)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Optimized Affinities (Shifts)</Label>
                <div className="flex flex-wrap gap-3">
                  {shifts.map(s => (
                    <div key={s.id} className="flex items-center space-x-3 bg-background p-4 rounded-sm border border-border hover:bg-accent transition-colors cursor-pointer group">
                      <Checkbox 
                        id={`pref-${s.id}`} 
                        checked={editingEmployee?.preferredShiftIds?.includes(s.id) || false}
                        onCheckedChange={(checked) => {
                          const current = editingEmployee?.preferredShiftIds || [];
                          const updated = checked 
                            ? [...current, s.id] 
                            : current.filter(id => id !== s.id);
                          setEditingEmployee(prev => ({ ...prev, preferredShiftIds: updated }));
                        }}
                        className="border-muted-foreground"
                      />
                      <label htmlFor={`pref-${s.id}`} className="text-[10px] font-bold uppercase tracking-widest cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <DialogFooter className="p-8 pt-6 border-t border-border bg-card z-20 flex-shrink-0">
            <Button type="button" variant="outline" onClick={closeEmployeeDialog} className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-accent uppercase text-[10px] tracking-widest px-8 py-6 rounded-sm">
              ABORT
            </Button>
            <Button type="submit" form="employee-form" className="bg-foreground text-background hover:opacity-90 uppercase text-[10px] tracking-[0.2em] font-bold px-8 py-6 rounded-sm shadow-none">
              SAVE CHANGES
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
