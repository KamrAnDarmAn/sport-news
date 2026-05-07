import { Flame } from "lucide-react";
import {
  SiX as Twitter,
  SiInstagram as Instagram,
  SiYoutube as Youtube,
} from "react-icons/si";


export const Footer = () => (
  <footer className="border-t border-border mt-24 ">
    <div className="container py-12 grid md:grid-cols-3 gap-8 mx-auto px-4 md:px-0">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Flame className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-black">PULSE<span className="text-gradient-primary">.</span></span>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">The heartbeat of global sports — news, rankings & stories that move the game.</p>
      </div>
      <div>
        <h4 className="text-sm font-bold mb-3 uppercase tracking-wider">Newsletter</h4>
        <p className="text-sm text-muted-foreground mb-3">Get the highlight reel in your inbox.</p>
        <div className="flex gap-2">
          <input className="flex-1 px-4 py-2 rounded-full bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="you@email.com" />
          <button className="px-5 py-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:scale-105 transition-smooth">Join</button>
        </div>
      </div>
      <div className="md:text-right">
        <h4 className="text-sm font-bold mb-3 uppercase tracking-wider">Follow</h4>
        <div className="flex gap-3 md:justify-end">
          {[Twitter, Instagram, Youtube].map((Icon, i) => (
            <a key={i} href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-gradient-primary hover:text-primary-foreground transition-smooth">
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">© 2026 Pulse Sports. Built for fans.</div>
  </footer>
);
