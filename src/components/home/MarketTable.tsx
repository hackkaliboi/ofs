import React, { useEffect } from 'react';

const MarketTable = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": 490,
      "defaultColumn": "overview",
      "defaultScreen": "general",
      "market": "crypto",
      "showToolbar": true,
      "colorTheme": "light",
      "locale": "en",
      "isTransparent": false,
      "screener_type": "crypto_mkt",
      "displayCurrency": "USD",
      "styles": {
        "up": "#4F46E5",
        "down": "#7C3AED",
        "unchanged": "#6366F1"
      }
    });

    const container = document.getElementById('tradingview-market-table');
    if (container) {
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      container.appendChild(widgetDiv);
      container.appendChild(script);
    }

    return () => {
      const container = document.getElementById('tradingview-market-table');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <section className="py-16 bg-card">
      <div className="container-custom">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Market Overview</h2>
          <p className="text-gray-600">Real-time cryptocurrency market data and analysis</p>
        </div>
        <div id="tradingview-market-table" className="tradingview-widget-container rounded-lg overflow-hidden border">
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>
    </section>
  );
};

export default MarketTable;
