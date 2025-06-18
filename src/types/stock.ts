export interface StockDataPoint {
  date: string;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface StockDataResponse {
  symbol: string;
  name: string;
  data: StockDataPoint[];
  timeZone: string;
  isDemo?: boolean;
  isSimulated?: boolean;
  simulationReason?: string;
}

export const symbolNameMap: Record<string, string> = {
  AAPL: "애플",
  MSFT: "마이크로소프트",
  GOOGL: "알파벳(구글)",
  AMZN: "아마존",
  TSLA: "테슬라",
  META: "메타(페이스북)",
  NVDA: "엔비디아",
  "005930.KS": "삼성전자",
  "000660.KS": "SK하이닉스",
  "035420.KS": "네이버",
  "035720.KS": "카카오",
};

export const availableStocks = [
  { symbol: "AAPL", name: "애플" },
  { symbol: "MSFT", name: "마이크로소프트" },
  { symbol: "GOOGL", name: "알파벳(구글)" },
  { symbol: "AMZN", name: "아마존" },
  { symbol: "TSLA", name: "테슬라" },
  { symbol: "META", name: "메타(페이스북)" },
  { symbol: "NVDA", name: "엔비디아" },
  { symbol: "005930.KS", name: "삼성전자" },
  { symbol: "000660.KS", name: "SK하이닉스" },
  { symbol: "035420.KS", name: "네이버" },
];

export interface StockResults {
  shortSMA: (number | null)[];
  longSMA: (number | null)[];
  maxProfit: {
    profit: number
    buyPrice: number
    sellPrice: number
    buyIndex: number
    sellIndex: number
  } | null;
  patternFound: number[];
  crosses: {
    type: "golden" | "dead"
    index: number
  }[];
  stockName: string;
  dataRange: {
    start: string
    end: string
    totalDays: number
    isFiltered: boolean
    originalStart: string
    originalEnd: string
    originalTotalDays: number
    customRange: {
      startDate: string | null
      endDate: string | null
    }
  };
  rawData: StockDataPoint[];
  prices: number[];
  dates: string[];
}
