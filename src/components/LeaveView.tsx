import React, { useState } from 'react';
import { Plus, Check, X, Calendar as CalendarIcon, Clock, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { useScheduleStore } from '../store';
import { LeaveRequest, LeaveStatus } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format, isWithinInterval, startOfDay } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function LeaveView() {
  const { leaves, employees, addLeave, updateLeave, deleteLeave } = useScheduleStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Partial<LeaveRequest> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const leave: LeaveRequest = {
      id: editingLeave?.id || Math.random().toString(36).substr(2, 9),
      employeeId: formData.get('employeeId') as string,
      startDate: startOfDay(new Date(formData.get('startDate') as string)),
      endDate: startOfDay(new Date(formData.get('endDate') as string)),
      type: formData.get('type') as any,
      status: editingLeave?.status || 'Pending',
      preferredShiftId: formData.get('preferredShiftId') as string || undefined,
      reason: formData.get('reason') as string,
    };

    if (editingLeave?.id) {
      updateLeave(leave);
      toast.success('Request updated');
    } else {
      addLeave(leave);
      toast.success('Request submitted');
    }
    setIsDialogOpen(false);
    setEditingLeave(null);
  };

  const statusColors = {
    Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const { shifts } = useScheduleStore();

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between mb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Temporal.Exceptions</h1>
          <p className="text-4xl font-light tracking-tight text-foreground">Leave Status Protocol</p>
        </div>
        <Button onClick={() => { setEditingLeave(null); setIsDialogOpen(true); }} className="bg-foreground text-background hover:opacity-90 uppercase text-[10px] tracking-[0.2em] font-bold px-8 py-6 rounded-sm">
          <Plus className="mr-2 h-4 w-4" /> Log New Exception
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {leaves.length === 0 ? (
          <div className="col-span-full h-64 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground rounded-sm">
            <CalendarIcon className="h-10 w-10 mb-4 opacity-10" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">No active exceptions found in registry</span>
          </div>
        ) : (
          leaves.map((leave) => {
            const emp = employees.find(e => e.id === leave.employeeId);
            return (
              <div key={leave.id} className="bg-card border border-border rounded-sm p-8 group hover:border-accent transition-all relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: emp?.color }} />
                    <div>
                      <h3 className="text-lg font-light tracking-tight text-foreground">{emp?.name || 'Unknown'}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Operative Record</p>
                    </div>
                  </div>
                  <Badge className={cn("text-[9px] uppercase tracking-widest py-1 px-3 rounded-none border-none", statusColors[leave.status])}>
                    {leave.status}
                  </Badge>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4 p-5 border border-border bg-card/50 rounded-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Temporal Window</span>
                      <span className="text-sm font-mono text-foreground mt-1">
                        {format(new Date(leave.startDate), 'MMM dd')} — {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-6">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Classification</span>
                      <span className="text-[10px] uppercase text-muted-foreground opacity-60 tracking-widest">
                        {leave.type}
                        {leave.type === 'ShiftRequest' && leave.preferredShiftId && (
                          <span className="ml-2 text-emerald-500">
                             ({shifts.find(s => s.id === leave.preferredShiftId)?.name})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                       {leave.status === 'Pending' && (
                         <>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-9 w-9 border border-border text-emerald-900 hover:text-emerald-500 hover:bg-emerald-950/20"
                             onClick={() => updateLeave({ ...leave, status: 'Approved' })}
                           >
                             <Check className="h-4 w-4" />
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-9 w-9 border border-border text-red-900 hover:text-red-500 hover:bg-red-950/20"
                             onClick={() => updateLeave({ ...leave, status: 'Rejected' })}
                           >
                             <X className="h-4 w-4" />
                           </Button>
                         </>
                       )}
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-9 w-9 border border-border text-muted-foreground hover:text-foreground"
                         onClick={() => { setEditingLeave(leave); setIsDialogOpen(true); }}
                       >
                         <Edit2 className="h-4 w-4" />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-9 w-9 border border-border text-red-900 hover:text-red-500 hover:bg-red-950/20"
                         onClick={() => { deleteLeave(leave.id); toast.info('Request purged'); }}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent key={editingLeave?.id || 'new'} className="bg-card border border-border text-foreground max-w-lg rounded-sm flex flex-col h-[85vh] overflow-hidden p-0 gap-0">
          <DialogHeader className="p-10 pb-4">
            <DialogTitle className="text-2xl font-light tracking-tight">{editingLeave ? 'Modify Protocol' : 'Register Protocol'}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-10 py-4 custom-scrollbar">
            <form id="leave-form" onSubmit={handleSave} className="space-y-10 pb-8">
            <div className="space-y-3">
              <Label htmlFor="employeeId" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Target Operative</Label>
              <Select 
                name="employeeId_select" 
                value={editingLeave?.employeeId || ''} 
                onValueChange={(v) => setEditingLeave(prev => ({ ...prev, employeeId: v }))}
                required
              >
                <SelectTrigger className="bg-background border-border text-foreground rounded-sm py-6 uppercase tracking-widest text-[10px]">
                  <SelectValue placeholder="Identification" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground">
                  {employees.map(e => (
                    <SelectItem key={e.id} value={e.id} className="uppercase text-[10px] tracking-widest hover:bg-accent transition-colors">{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="employeeId" value={editingLeave?.employeeId || ''} />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="startDate" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Window Entrance</Label>
                <Input 
                  id="startDate" 
                  name="startDate" 
                  type="date"
                  defaultValue={editingLeave?.startDate ? format(new Date(editingLeave.startDate), 'yyyy-MM-dd') : ''} 
                  required 
                  className="bg-background border-border text-foreground rounded-sm py-6 text-xs focus:border-accent transition-all"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="endDate" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Window Exit</Label>
                <Input 
                  id="endDate" 
                  name="endDate" 
                  type="date"
                  defaultValue={editingLeave?.endDate ? format(new Date(editingLeave.endDate), 'yyyy-MM-dd') : ''} 
                  required 
                  className="bg-background border-border text-foreground rounded-sm py-6 text-xs focus:border-accent transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="type" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Exception Category</Label>
              <Select 
                name="type_select" 
                value={editingLeave?.type || 'Vacation'} 
                onValueChange={(v) => setEditingLeave(prev => ({ ...prev, type: v as any }))}
                required
              >
                <SelectTrigger className="bg-background border-border text-foreground rounded-sm py-6 uppercase tracking-widest text-[10px]">
                  <SelectValue placeholder="Classification" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground">
                  <SelectItem value="Vacation" className="uppercase text-[10px] tracking-widest hover:bg-accent transition-colors">Vacation Profile</SelectItem>
                  <SelectItem value="Sick" className="uppercase text-[10px] tracking-widest hover:bg-accent transition-colors">Medical Leave</SelectItem>
                  <SelectItem value="Personal" className="uppercase text-[10px] tracking-widest hover:bg-accent transition-colors">Personal Logistics</SelectItem>
                  <SelectItem value="ShiftRequest" className="uppercase text-[10px] tracking-widest text-emerald-500 hover:bg-accent transition-colors">Specific Shift Request</SelectItem>
                  <SelectItem value="Other" className="uppercase text-[10px] tracking-widest hover:bg-accent transition-colors">Unspecified Registry</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="type" value={editingLeave?.type || 'Vacation'} />
            </div>

            {editingLeave?.type === 'ShiftRequest' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="preferredShiftId" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Requested Shift</Label>
                <Select 
                  name="preferredShiftId_select" 
                  value={editingLeave?.preferredShiftId || ''} 
                  onValueChange={(v) => setEditingLeave(prev => ({ ...prev, preferredShiftId: v }))}
                  required
                >
                  <SelectTrigger className="bg-background border-border text-foreground rounded-sm py-6 uppercase tracking-widest text-[10px]">
                    <SelectValue placeholder="Assigned Shift" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    {shifts.map(s => (
                      <SelectItem key={s.id} value={s.id} className="uppercase text-[10px] tracking-widest font-mono hover:bg-accent transition-colors">
                        {s.name} ({s.startTime}-{s.endTime})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="preferredShiftId" value={editingLeave?.preferredShiftId || ''} />
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="reason" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Registry Notes</Label>
              <Input 
                id="reason" 
                name="reason" 
                defaultValue={editingLeave?.reason || ''} 
                placeholder="SECONDARY DOCUMENTATION"
                className="bg-background border-border text-foreground rounded-sm py-6 uppercase tracking-[0.1em] text-xs focus:border-accent transition-all"
              />
            </div>
          </form>
          </div>
          
          <DialogFooter className="p-10 pt-8 border-t border-border bg-card z-20 flex-shrink-0">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-accent uppercase text-[10px] tracking-widest px-8 py-6 rounded-sm">
              ABORT
            </Button>
            <Button type="submit" form="leave-form" className="bg-foreground text-background hover:opacity-90 uppercase text-[10px] tracking-[0.2em] font-bold px-8 py-6 rounded-sm shadow-none">
              COMMIT EXCEPTION
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
