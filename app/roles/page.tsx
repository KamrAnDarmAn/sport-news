'use client'
import { PageHeader } from "@/components/PageHeader";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, User as UserIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";

type Role = "admin" | "editor" | "user";
interface Member { id: string; name: string; email: string; role: Role; lastSeen: string; }

const seed: Member[] = [
    { id: "1", name: "Alex Chen", email: "alex@pulse.app", role: "admin", lastSeen: "Just now" },
    { id: "2", name: "Maria Calvo", email: "maria@pulse.app", role: "editor", lastSeen: "12m ago" },
    { id: "3", name: "Sam Okafor", email: "sam@pulse.app", role: "editor", lastSeen: "2h ago" },
    { id: "4", name: "Jordan Brooks", email: "jordan@pulse.app", role: "user", lastSeen: "1d ago" },
    { id: "5", name: "Lina Tanaka", email: "lina@pulse.app", role: "editor", lastSeen: "3d ago" },
];

const roleTone: Record<Role, string> = {
    admin: "bg-gradient-primary text-primary-foreground",
    editor: "bg-blue-500/15 text-blue-400",
    user: "bg-muted text-muted-foreground",
};

const Roles = () => {

    const isAdmin = true;

    if (!isAdmin) {
        return (
            <div className="container py-32 text-center">
                <SEO title="Roles — Access Denied" noIndex />
                <h1 className="text-3xl font-black mb-4">Admin access required</h1>
                <p className="text-muted-foreground mb-6">Only admins can manage roles.</p>
                <Button asChild><Link href="/auth">Sign in</Link></Button>
            </div>
        );
    }

    return (
        <div >
            <SEO title="Roles & Permissions" description="Manage Pulse admins, editors and contributors." noIndex
                jsonLd={breadcrumbJsonLd([{ name: "Roles", href: "/roles" }])} />
            <Breadcrumbs items={[{ name: "Roles", href: "/roles" }]} />
            <PageHeader eyebrow="Access Control" title="Roles & Permissions" subtitle="Decide who can write, who can publish, and who can read." />

            <section className="container py-12 mx-auto">
                <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <h2 className="font-bold">Team members</h2>
                        <span className="ml-auto text-xs text-muted-foreground">{seed.length} total</span>
                    </div>
                    {seed.map((m) => (
                        <div key={m.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-t border-border hover:bg-muted/20 transition-smooth">
                            <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground">
                                    <UserIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold">{m.name}</div>
                                    <div className="text-xs text-muted-foreground">{m.email}</div>
                                </div>
                            </div>
                            <div className="col-span-6 md:col-span-3 text-xs text-muted-foreground">Active {m.lastSeen}</div>
                            <div className="col-span-4 md:col-span-3">
                                <Select defaultValue={m.role}>
                                    <SelectTrigger className="h-9 w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="user">Reader</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2 md:col-span-1 flex justify-end">
                                <span className={`hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${roleTone[m.role]}`}>
                                    {m.role}
                                </span>
                                <Button size="icon" variant="ghost" className="md:hidden" aria-label="More">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </Card>

                <Card className="mt-6 p-6 border-border/50">
                    <h3 className="font-bold mb-2">Invite a team member</h3>
                    <p className="text-sm text-muted-foreground mb-4">Send an invite link with a pre-assigned role.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="name@email.com"
                            className="flex-1 h-11 px-4 rounded-full bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Select defaultValue="editor">
                            <SelectTrigger className="sm:w-40 h-11"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="user">Reader</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-11 px-6">Send invite</Button>
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default Roles;
