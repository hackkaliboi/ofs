
import React from "react";
import { TrendingUp, BarChart3, Activity } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const CryptoMarket = () => {
  React.useEffect(() => {
    // Create and load TradingView widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": 520,
      "defaultColumn": "overview",
      "screener_type": "crypto_mkt",
      "displayCurrency": "USD",
      "colorTheme": "dark",
      "locale": "en",
      "isTransparent": true
    });

    // Find the container and append the script
    const container = document.getElementById('tradingview-widget-container');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      // Cleanup
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <section id="market" className="section-padding relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,215,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(255,215,0,0.05),transparent_50%)]" />
      </div>
      
      <div className="container-custom relative z-10">
        <AnimatedSection>
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 mb-6">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Live Market Data</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Crypto Market{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Updates
              </span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Real-time cryptocurrency market data powered by TradingView. 
              Stay informed with the latest prices, trends, and market movements.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={2}>
          <div className="custodia-card bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-yellow-500/20 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500">
                  <BarChart3 className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Market Overview</h3>
                  <p className="text-sm text-gray-400">Real-time cryptocurrency data</p>
                </div>
                <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                  <Activity className="h-3 w-3 text-yellow-400" />
                  <span className="text-xs font-medium text-yellow-400">Live</span>
                </div>
              </div>
              <div id="tradingview-widget-container" className="h-[520px] rounded-lg overflow-hidden"></div>
            </div>
            <div className="px-6 py-4 bg-gradient-to-r from-yellow-500/5 to-amber-500/5 border-t border-yellow-500/10">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <TrendingUp className="h-4 w-4 text-yellow-400" />
                <span>Powered by TradingView</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CryptoMarket;
