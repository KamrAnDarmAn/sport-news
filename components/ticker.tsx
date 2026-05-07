import React from 'react'
const tickerItems = ["⚽ Madrid 3-1 Barcelona", "🏀 Lakers clinch playoff spot", "🏈 Chiefs eyeing 3-peat", "🎾 Sinner advances to final", "🏏 India tour SA announced", "🏎️ Verstappen on pole"];

const Ticker = () => {
    return (
        <div className="border-y border-border bg-card/50 overflow-hidden py-3 " >
            <div className="flex gap-12 animate-marquee whitespace-nowrap">
                {[...tickerItems, ...tickerItems].map((t, i) => (
                    <span key={i} className="text-sm font-semibold text-muted-foreground">{t}</span>
                ))}
            </div>
        </div>
    )
}

export default Ticker