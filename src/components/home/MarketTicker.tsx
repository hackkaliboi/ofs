import React, { useEffect } from 'react';

const MarketTicker = () => {
  useEffect(() => {
    // Create and load TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      "symbols": [
        {
          "proName": "FOREXCOM:SPXUSD",
          "title": "S&P 500"
        },
        {
          "proName": "FOREXCOM:NSXUSD",
          "title": "US 100"
        },
        {
          "proName": "FX_IDC:EURUSD",
          "title": "EUR/USD"
        },
        {
          "description": "BTC/USD",
          "proName": "BITSTAMP:BTCUSD"
        },
        {
          "description": "ETH/USD",
          "proName": "BITSTAMP:ETHUSD"
        },
        {
          "description": "Gold",
          "proName": "TVC:GOLD"
        }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    });

    // Find or create container
    let container = document.getElementById('tradingview-widget-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'tradingview-widget-container';
      document.getElementById('market-ticker')?.appendChild(container);
    }

    // Add widget div
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    container.appendChild(widgetDiv);

    // Add script
    container.appendChild(script);

    // Cleanup
    return () => {
      if (container) {
        container.remove();
      }
    };
  }, []);

  return (
    <div id="market-ticker" className="w-full bg-black/20 backdrop-blur-sm">
      <div className="container-custom">
        <div className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>
    </div>
  );
};

export default MarketTicker;
