import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: {
      widget: new (config: Record<string, unknown>) => unknown;
    };
  }
}

const TradingViewWidget: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;

    // Create the script element
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    
    // Configure the widget
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": "BINANCE:BTCUSDT",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });

    // Add the script to the container
    currentContainer.appendChild(script);

    // Cleanup
    return () => {
      if (currentContainer && currentContainer.contains(script)) {
        currentContainer.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget h-full"></div>
    </div>
  );
};

export default TradingViewWidget;
