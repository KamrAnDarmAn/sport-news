import { ArrowLeft, Home } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

const NotFound = () => {
    // const location = useLocation();

    // useEffect(() => {
    //     console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    // }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 grid-pattern opacity-30" />
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-primary blur-3xl opacity-20 animate-float" />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-electric blur-3xl opacity-20 animate-float" />
                <div className="container relative text-center py-24 animate-fade-in">
                    <div className="text-[10rem] md:text-[14rem] font-black leading-none text-gradient-primary">404</div>
                    <h1 className="text-3xl md:text-5xl font-black mb-3 -mt-4">Off the pitch.</h1>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        That route doesn't exist — but the action's still on. Let's get you back in the game.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-primary text-primary-foreground font-bold shadow-glow hover:scale-105 transition-smooth">
                            <Home className="w-4 h-4" /> Back to Home
                        </Link>
                        <Link href="/category" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card font-bold hover:bg-muted transition-smooth">
                            <ArrowLeft className="w-4 h-4" /> Browse Sports
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
