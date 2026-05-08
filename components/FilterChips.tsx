import { cn } from "@/lib/utils";

interface Option { label: string; value: string; }
interface Props {
    options: Option[];
    value: string;
    onChange: (v: string) => void;
    label?: string;
}

export const FilterChips = ({ options, value, onChange, label }: Props) => (
    <div className="flex flex-wrap items-center gap-2">
        {label && <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">{label}</span>}
        {options.map((o) => {
            const active = o.value === value;
            return (
                <button
                    key={o.value}
                    type="button"
                    onClick={() => onChange(o.value)}
                    className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-smooth",
                        active
                            ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                            : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary",
                    )}
                    aria-pressed={active}
                >
                    {o.label}
                </button>
            );
        })}
    </div>
);
