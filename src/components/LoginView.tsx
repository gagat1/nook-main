import { FormEvent } from 'react';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useScheduleStore } from '../store';

export function LoginView({ onLogin }: { onLogin: () => void }) {
  const { authCredentials, theme } = useScheduleStore();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '');
    const pin = String(formData.get('pin') || '').trim();

    if (
      username === authCredentials.username &&
      password === authCredentials.password &&
      pin === authCredentials.pin
    ) {
      window.sessionStorage.setItem('nook-authenticated', 'true');
      toast.success('Access granted');
      onLogin();
      return;
    }

    toast.error('Username, password, atau PIN salah');
  };

  return (
    <div className={`${theme} min-h-screen bg-background text-foreground flex items-center justify-center p-6`}>
      <Card className="w-full max-w-md bg-card border-border rounded-sm shadow-none p-8">
        <div className="mb-10 space-y-3">
          <div className="h-12 w-12 border border-border flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">NOOK BREW ACCESS</p>
            <h1 className="mt-3 text-4xl font-light tracking-tight">Operations Login</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Username</Label>
            <Input name="username" autoComplete="username" required className="bg-background border-border rounded-sm h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Password</Label>
            <Input name="password" type="password" autoComplete="current-password" required className="bg-background border-border rounded-sm h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">PIN</Label>
            <Input name="pin" type="password" inputMode="numeric" autoComplete="one-time-code" required className="bg-background border-border rounded-sm h-12" />
          </div>
          <Button type="submit" className="w-full h-12 bg-foreground text-background hover:opacity-90 rounded-sm uppercase text-[10px] tracking-[0.2em] font-bold">
            <LockKeyhole className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
