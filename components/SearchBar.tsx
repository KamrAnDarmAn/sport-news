import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = "Search stories…" }: Props) => (
    <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-11 pr-11 h-12 rounded-full bg-card border-border focus-visible:ring-primary"
            aria-label="Search"
        />
        {value && (
            <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted transition-smooth"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        )}
    </div>
);
