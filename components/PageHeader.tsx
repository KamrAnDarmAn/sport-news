import { Breadcrumbs } from "./Breadcrumbs";

interface Props { eyebrow?: string; title: string; subtitle?: string; breadcrumbs?: any; children?: React.ReactNode }

export const PageHeader = ({ eyebrow, title, subtitle, breadcrumbs, children }: Props) => (
  <section className="relative overflow-hidden border-b border-border flex items-center justify-center px-4 md:px-0">
    <div className="absolute inset-0 grid-pattern opacity-30" />
    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-primary blur-3xl opacity-20" />
    <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-electric blur-3xl opacity-20" />
    <div className="container relative animate-fade-in">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className=" py-20 md:py-28">

        {eyebrow && (
          <span className="inline-block px-4 py-1.5 rounded-full bg-muted border border-border text-xs font-bold uppercase tracking-widest mb-5">
            {eyebrow}
          </span>
        )}
        <h1 className="text-5xl md:text-7xl font-black leading-[0.95] mb-4">
          {title.split(" ").map((w, i, arr) => (
            <span key={i} className={i === arr.length - 1 ? "text-gradient-primary" : ""}>
              {w}{i < arr.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>
        {subtitle && <p className="text-lg text-muted-foreground max-w-2xl">{subtitle}</p>}
        {children && <div className="mt-6 flex items-center gap-3 flex-wrap">{children}</div>}
      </div>
    </div>

  </section>
);
