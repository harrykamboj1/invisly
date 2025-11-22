export const NAV_ITEMS = [
    { href: '/', label: 'Dashboard' },
    { href: '/search', label: 'Search' },
    { href: '/watchlist', label: 'Watchlist' },
];

// Sign-up form select options
export const INVESTMENT_GOALS = [
    { value: 'Growth', label: 'Growth' },
    { value: 'Income', label: 'Income' },
    { value: 'Balanced', label: 'Balanced' },
    { value: 'Conservative', label: 'Conservative' },
];

export const RISK_TOLERANCE_OPTIONS = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
];

export const PREFERRED_INDUSTRIES = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Energy', label: 'Energy' },
    { value: 'Consumer Goods', label: 'Consumer Goods' },
];

export const ALERT_TYPE_OPTIONS = [
    { value: 'upper', label: 'Upper' },
    { value: 'lower', label: 'Lower' },
];

export const CONDITION_OPTIONS = [
    { value: 'greater', label: 'Greater than (>)' },
    { value: 'less', label: 'Less than (<)' },
];

// TradingView Charts
export const MARKET_OVERVIEW_WIDGET_CONFIG = {
    colorTheme: 'dark', // dark mode
    dateRange: '12M', // last 12 months
    locale: 'en', // language
    largeChartUrl: '',
    isTransparent: true, 
    showFloatingTooltip: true, 
    plotLineColorGrowing: '#0FEDBE', 
    plotLineColorFalling: '#0FEDBE', 
    gridLineColor: 'rgba(240, 243, 250, 0)', 
    scaleFontColor: '#DBDBDB', 
    belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)', 
    belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)', 
    belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
    belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
    symbolActiveColor: 'rgba(15, 237, 190, 0.05)', 
    tabs: [
        {
            title: 'Financial',
            symbols: [
                { s: 'BSE:HDFCBANK', d: 'HDFC Bank' },
                { s: 'BSE:ICICIBANK', d: 'ICICI Bank' },
                { s: 'BSE:AXISBANK', d: 'Axis Bank' },
                { s: 'BSE:BANKBARODA', d: 'Bank of Baroda' },
                { s: 'BSE:SBIN', d: 'State Bank of India' },
                { s: 'BSE:KOTAKBANK', d: 'Kotak Mahindra Bank Limited' },
            ],
        },
        {
            title: 'Technology',
            symbols: [
                { s: 'BSE:TCS', d: 'Tata Consultancy Services Limited' },
                { s: 'BSE:INFY', d: 'Infosys Limited' },
                { s: 'BSE:WIPRO', d: 'Wipro' },
                { s: 'BSE:TECHM', d: 'Tech Mahindra Limited' },
                { s: 'BSE:HCLTECH', d: 'HCL Technologies Limited' }
            ],
        },
        {
            title: 'Services',
            symbols: [
                { s: 'BSE:ADANIENT', d: 'Adani Enterprises Limited' },
                { s: 'BSE:LT', d: 'Larsen & Toubro Limited' },
                { s: 'BSE:TATAPOWER', d: 'Tata Power Company Limited' },
                { s: 'BSE:NTPC', d: 'NTPC Limited' },
                { s: 'BSE:GAIL', d: 'GAIL(India) Limited' },
            ],
        },
    ],
    support_host: 'https://www.tradingview.com',
    backgroundColor: '#141414', 
    width: '100%', 
    height: 600, 
    showSymbolLogo: true, 
    showChart: true, 
};

export const HEATMAP_WIDGET_CONFIG = {
    dataSource: 'SENSEX',
    blockSize: 'market_cap_basic',
    blockColor: 'sector',
    grouping: 'industry',
    isTransparent: true,
    locale: 'en',
    symbolUrl: '',
    colorTheme: 'dark',
    exchanges: [],
    hasTopBar: false,
    isDataSetEnabled: false,
    isZoomEnabled: true,
    hasSymbolTooltip: true,
    isMonoSize: false,
    width: '100%',
    height: '600',
};

export const TOP_STORIES_WIDGET_CONFIG = {
    feedMode: 'all_symbols', 
    colorTheme: 'dark',
    isTransparent: true,
    displayMode: 'regular',
    width: '100%',
    height: 600, 
    locale: 'en',
};

export const MARKET_DATA_WIDGET_CONFIG = {
    title: 'Stocks',
    width: '100%',
    height: 600,
    locale: 'en',
    showSymbolLogo: true,
    colorTheme: 'dark',
    isTransparent: false,
    backgroundColor: '#0F0F0F',
    symbolsGroups: [
        {
            name: 'Financial',
            symbols: [
                { name: 'BSE:HDFCBANK', displayName: 'HDFC Bank' },
                { name: 'BSE:ICICIBANK', displayName: 'ICICI Bank' },
                { name: 'BSE:AXISBANK', displayName: 'Axis Bank' },
                { name: 'BSE:BANKBARODA', displayName: 'Bank of Baroda' },
                { name: 'BSE:SBIN', displayName: 'State Bank of India' },
                { name: 'BSE:KOTAKBANK', displayName: 'Kotak Mahindra Bank Limited' },
            ],
        },
        {
            name: 'Technology',
            symbols: [
                { name: 'BSE:TCS', displayName: 'Tata Consultancy Services Limited' },
                { name: 'BSE:INFY', displayName: 'Infosys Limited' },
                { name: 'BSE:WIPRO', displayName: 'Wipro' },
                { name: 'BSE:TECHM', displayName: 'Tech Mahindra Limited' },
                { name: 'BSE:HCLTECH', displayName: 'HCL Technologies Limited' }
            ],
        },
        {
            name: 'Services',
            symbols: [
                { name: 'BSE:ADANIENT', displayName: 'Adani Enterprises Limited' },
                { name: 'BSE:LT', displayName: 'Larsen & Toubro Limited' },
                { name: 'BSE:TATAPOWER', displayName: 'Tata Power Company Limited' },
                { name: 'BSE:NTPC', displayName: 'NTPC Limited' },
                { name: 'BSE:GAIL', displayName: 'GAIL(India) Limited' },
            ],
        },
    ],
};

export const SYMBOL_INFO_WIDGET_CONFIG = (symbol: string) => ({
    symbol:symbol.toUpperCase(),
    colorTheme: 'dark',
    isTransparent: true,
    locale: 'en',
    width: '100%',
    height: 170,
});

export const CANDLE_CHART_WIDGET_CONFIG = (symbol: string) => ({
    allow_symbol_change: false,
    calendar: false,
    details: true,
    hide_side_toolbar: true,
    hide_top_toolbar: false,
    hide_legend: false,
    hide_volume: false,
    hotlist: false,
    interval: 'D',
    locale: 'en',
    save_image: false,
    style: 1,
    symbol: symbol.toUpperCase(),
    theme: 'dark',
    timezone: 'Etc/UTC',
    backgroundColor: '#141414',
    gridColor: '#141414',
    watchlist: [],
    withdateranges: false,
    compareSymbols: [],
    studies: [],
    width: '100%',
    height: 600,
});

export const BASELINE_WIDGET_CONFIG = (symbol: string) => ({
    allow_symbol_change: false,
    calendar: false,
    details: false,
    hide_side_toolbar: true,
    hide_top_toolbar: false,
    hide_legend: false,
    hide_volume: false,
    hotlist: false,
    interval: 'D',
    locale: 'en',
    save_image: false,
    style: 10,
    symbol: symbol.toUpperCase(),
    theme: 'dark',
    timezone: 'Etc/UTC',
    backgroundColor: '#141414',
    gridColor: '#141414',
    watchlist: [],
    withdateranges: false,
    compareSymbols: [],
    studies: [],
    width: '100%',
    height: 600,
});

export const TECHNICAL_ANALYSIS_WIDGET_CONFIG = (symbol: string) => ({
    symbol: symbol.toUpperCase(),
    colorTheme: 'dark',
    isTransparent: 'true',
    locale: 'en',
    width: '100%',
    height: 400,
    interval: '1h',
    largeChartUrl: '',
});

export const COMPANY_PROFILE_WIDGET_CONFIG = (symbol: string) => ({
    symbol: symbol.toUpperCase(),
    colorTheme: 'dark',
    isTransparent: 'true',
    locale: 'en',
    width: '100%',
    height: 440,
});

export const COMPANY_FINANCIALS_WIDGET_CONFIG = (symbol: string) => ({
    symbol: symbol.toUpperCase(),
    colorTheme: 'dark',
    isTransparent: 'true',
    locale: 'en',
    width: '100%',
    height: 464,
    displayMode: 'regular',
    largeChartUrl: '',
});

export const POPULAR_INDIAN_STOCK_SYMBOLS = [
    'RELIANCE.BO',
    'TCS.BO',
    'INFY.BO',
    'HDFCBANK.BO',
    'ICICIBANK.BO',
    'HINDUNILVR.BO',
    'KOTAKBANK.BO',
    'SBIN.BO',
    'AXISBANK.BO',
    'LT.BO',              // Larsen & Toubro
    'BHARTIARTL.BO',
    'ITC.BO',
    'MARUTI.BO',
    'M&M.BO',             // Mahindra & Mahindra
    'HCLTECH.BO',
    'WIPRO.BO',
    'ASIANPAINT.BSE',
    'NESTLEIND.BSE',
    'TATAMOTORS.BSE',
    'TATASTEEL.BSE',
    'ONGC.BSE',
    'POWERGRID.BSE',
    'ULTRACEMCO.BSE',
    'SUNPHARMA.BSE',
    'DIVISLAB.BSE',
    'SBILIFE.BSE',
    'EICHERMOT.BSE',
    'HDFCLIFE.BSE',
    'ADANIPORTS.BSE',
    'GRASIM.BSE',
    'SHREECEM.BSE',
    'HINDALCO.BSE',
    'COALINDIA.BSE',
    'BPCL.BSE',
    'IOC.BSE',
    'BHARATFORG.BSE',
    'TECHM.BSE',
    'INDUSINDBK.BSE',
    'BRITANNIA.BSE'
  ];

export const NO_MARKET_NEWS =
    '<p class="mobile-text" style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#4b5563;">No market news available today. Please check back tomorrow.</p>';

export const WATCHLIST_TABLE_HEADER = [
    'Company',
    'Symbol',
    'Price',
    'Change',
    'Market Cap',
    'P/E Ratio',
    'Alert',
    'Action',
];

export const GEMINI_MODELS = {
    'gemini-2.5-flash-lite': {
      rpm: 15,        
      tpm: 250000,   
      rpd: 1000,      
      priority: 2  
    },
    'gemini-2.0-flash-lite': {
      rpm: 30,
      tpm: 1000000,
      rpd: 200,
      priority: 3
    },
    'gemini-2.0-flash': {
      rpm: 15,       
      tpm: 1000000,  
      rpd: 1500,   
      priority: 4
    },
    'gemini-2.5-flash': {
      rpm: 15,       
      tpm: 4000000, 
      rpd: 1500,     
      priority: 1
    }
  };
  