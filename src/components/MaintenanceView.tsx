import { FormEvent } from 'react';
import { KeyRound, ShieldAlert, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useScheduleStore } from '../store';
import { AuthCredentials } from '../types';

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
      toast.error('Username, password, dan PIN wajib diisi');
      return;
    }

    updateAuthCredentials(nextCredentials);
    toast.success('Login maintenance updated');
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
              Update username, password, dan PIN untuk membuka aplikasi.
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
            {isSupabaseReady ? 'Credentials sync to Supabase settings' : 'Credentials saved locally until Supabase is active'}
          </span>
        </div>
      </Card>
    </div>
  );
}
