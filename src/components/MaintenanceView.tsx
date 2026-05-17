import { FormEvent } from 'react';
import { KeyRound, ShieldAlert, Trash2, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isSupabaseConfigured } from '../lib/supabase';
import { deleteAllJsonRows } from '../lib/supabaseSync';
import { useScheduleStore } from '../store';
import { AuthCredentials } from '../types';

const DATABASE_TABLES = [
  'shift_employees',
  'shift_templates',
  'leave_requests',
  'scheduled_shifts',
  'finance_income',
  'finance_expenses',
  'app_settings',
];

const LOCAL_STORAGE_KEYS = [
  'shift-shift-storage',
  'nook-finance-income-records',
  'nook-finance-expense-records',
  'nook-manual-income',
  'nook-manual-expenses',
  'nook-fixed-cost-daily',
  'nook-business-data',
];

export function MaintenanceView() {
  const { authCredentials, updateAuthCredentials, isSupabaseReady } = useScheduleStore();

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextCredentials: AuthCredentials = {
      username: String(formData.get('username') || '').trim(),
      password: String(formData.get('password') || ''),
      pin: String(formData.get('pin') || '').trim(),
    };

    if (!nextCredentials.username || !nextCredentials.password || !nextCredentials.pin) {
      toast.error('Username, password, and PIN are required');
      return;
    }

    updateAuthCredentials(nextCredentials);
    toast.success('Login maintenance updated');
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm('Delete all Supabase and local app data? This cannot be undone.');
    if (!confirmed) return;

    toast.loading('Deleting all data...', { id: 'delete-all-data' });

    try {
      if (isSupabaseConfigured) {
        await Promise.all(DATABASE_TABLES.map((table) => deleteAllJsonRows(table)));
      }

      LOCAL_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
      window.sessionStorage.removeItem('nook-authenticated');

      toast.success('All data deleted. Reloading app...', { id: 'delete-all-data' });
      window.setTimeout(() => window.location.reload(), 600);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete all data', { id: 'delete-all-data' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-light tracking-tight text-foreground">Maintenance</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Access Control & System Credentials</p>
      </div>

      <Card className="bg-card border-border p-8 rounded-sm shadow-none">
        <div className="flex items-start gap-4 border-b border-border pb-6">
          <div className="h-10 w-10 border border-border flex items-center justify-center">
            <UserCog className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Login Credentials</h2>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Manage the credentials required to open the application.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Username</Label>
            <Input name="username" defaultValue={authCredentials.username} required className="bg-background border-border rounded-sm h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Password</Label>
            <Input name="password" type="password" defaultValue={authCredentials.password} required className="bg-background border-border rounded-sm h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">PIN</Label>
            <Input name="pin" type="password" inputMode="numeric" defaultValue={authCredentials.pin} required className="bg-background border-border rounded-sm h-12" />
          </div>
          <Button type="submit" className="md:col-span-2 h-12 bg-foreground text-background hover:opacity-90 rounded-sm uppercase text-[10px] tracking-[0.2em] font-bold">
            <KeyRound className="mr-2 h-4 w-4" />
            Save Login Access
          </Button>
        </form>
      </Card>

      <Card className="bg-card border-border p-6 rounded-sm shadow-none">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-4 w-4 text-amber-500" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            {isSupabaseReady ? 'Credentials synced to Supabase settings' : 'Credentials saved locally until Supabase is active'}
          </span>
        </div>
      </Card>

      <Card className="bg-card border-red-900/40 p-8 rounded-sm shadow-none">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-red-400 font-bold">Delete All Data</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Clear employees, schedules, finance records, settings, and browser cache so deleted database rows do not return after refresh.
            </p>
          </div>
          <Button type="button" variant="destructive" onClick={handleDeleteAll} className="h-12 rounded-sm uppercase text-[10px] tracking-[0.2em] font-bold">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All
          </Button>
        </div>
      </Card>
    </div>
  );
}
