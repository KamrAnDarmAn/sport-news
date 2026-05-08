'use client'
import { useState } from "react";
import { z } from "zod";
// import { supabase } from "@/integrations/supabase/client";
// import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Flame, Mail, Lock, User as UserIcon } from "lucide-react";
import Link from "next/link";

const schema = z.object({
    email: z.string().trim().email("Invalid email").max(255),
    password: z.string().min(8, "Min 8 characters").max(72),
    displayName: z.string().trim().min(1).max(60).optional(),
});

export default function Auth() {
    // const nav = useNavigate();
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = schema.safeParse({ email, password, displayName: mode === "signup" ? displayName : undefined });
        if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
        setLoading(true);
        try {
            // TODO: wire this to Supabase/Auth provider.
            await new Promise((resolve) => setTimeout(resolve, 700));
            toast.success(mode === "signin" ? "Signed in successfully" : "Account created successfully");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            toast.error(message);
        } finally { setLoading(false); }
    };

    const google = () => {
        toast.info("Google auth will be connected in the next step.");
    };

    return (
        <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-10  before:absolute before:inset-0 before:grid-pattern before:opacity-20 bg-gradient-hero">
            <Card className="relative w-full max-w-md p-8 md:p-9 rounded-3xl backdrop-blur-xl bg-card  border-0 shadow-2xl animate-fade-in lg:min-w-130 ">
                <Link href="/" className="group flex items-center gap-2 justify-center mb-7 transition-smooth hover:scale-[1.02]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow transition-smooth group-hover:scale-110 group-hover:shadow-electric">
                        <Flame className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-black tracking-tight">PULSE<span className="text-gradient-primary">.</span></span>
                </Link>
                <h1 className="text-3xl md:text-4xl font-black leading-[1.05] text-center mb-1">{mode === "signin" ? "Welcome back" : "Join the action"}</h1>
                <p className="text-sm md:text-base text-muted-foreground/90 text-center mb-6">
                    {mode === "signin" ? "Sign in to your account" : "Create your account in seconds"}
                </p>

                <Button type="button" variant="outline" onClick={google} className="w-full h-11 mb-4 rounded-xl border-border bg-muted/40 hover:bg-muted hover:border-primary/40 transition-smooth font-semibold">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Continue with Google
                </Button>

                <div className="relative my-5">
                    <div className="relative flex justify-center text-xs font-bold uppercase tracking-[0.2em]"><span className="bg-card px-3 text-muted-foreground">Or with email</span></div>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {mode === "signup" && (
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Display name</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Alex Striker" className="h-11 pl-10 rounded-xl border-border bg-background/70 focus-visible:border-primary/50 focus-visible:ring-primary/40 transition-smooth" />
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="h-11 pl-10 rounded-xl border-border bg-background/70 focus-visible:border-primary/50 focus-visible:ring-primary/40 transition-smooth" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="h-11 pl-10 rounded-xl border-border bg-background/70 focus-visible:border-primary/50 focus-visible:ring-primary/40 transition-smooth" required minLength={8} />
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-11 mt-1 rounded-xl bg-gradient-primary text-primary-foreground font-bold tracking-wide hover:opacity-90 shadow-glow hover:shadow-electric transition-smooth">
                        {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                    </Button>
                </form>

                <p className="text-sm text-center text-muted-foreground/90 mt-5">
                    {mode === "signin" ? "New to Pulse?" : "Already have an account?"}{" "}
                    <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-semibold hover:underline underline-offset-4 transition-smooth hover:text-primary/90">
                        {mode === "signin" ? "Create account" : "Sign in"}
                    </button>
                </p>
            </Card>
        </div>
    );
}
