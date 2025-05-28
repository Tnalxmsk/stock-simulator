import { StockDataPoint, StockDataResponse, symbolNameMap } from "@/types/stock";

export const fetchStockData = async (symbol: string) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${process.env.NEXT_PUBLIC_API_KEY}`)
    const data = await response.json();
    console.log(data)
    const timeSeriesKey = "Time Series (Daily)";
    const timeSeriesData = data[timeSeriesKey]
    const dates = Object.keys(timeSeriesData)

    const formattedData: StockDataPoint[] = dates
      .sort() // 날짜 오름차순 정렬
      .map((date) => {
        const dayData = timeSeriesData[date]
        return {
          date,
          close: Number.parseFloat(dayData["4. close"]),
          open: Number.parseFloat(dayData["1. open"]),
          high: Number.parseFloat(dayData["2. high"]),
          low: Number.parseFloat(dayData["3. low"]),
          volume: Number.parseFloat(dayData["5. volume"]),
        }
      })
      .filter((item) => !Number.isNaN(item.close))

    return {
      symbol,
      name: symbolNameMap[symbol] || symbol,
      data: formattedData,
      timeZone: data["Meta Data"] ? data["Meta Data"]["5. Time Zone"] || "US/Eastern" : "US/Eastern",
      isDemo: false,
      isSimulated: false,
    }

  } catch ( error ) {
    console.error("Error fetching stock data:", error);
  }
}

// 백업 데이터: API 호출 실패 시 사용할 가상 데이터
export function getBackupData(symbol: string, reason = "API 오류"): StockDataResponse {
  console.log(`백업 데이터 생성 중 (${reason}):`, symbol)

  // 더 현실적인 데이터 생성
  const data: StockDataPoint[] = []

  // 심볼에 따른 기본 가격 설정
  let basePrice = 150 // 기본값을 달러 기준으로 설정
  if (symbol.includes("005930") || symbol.includes("KS")) {
    basePrice = 70000 // 한국 주식 (원)
  } else if (symbol === "AAPL") {
    basePrice = 180 // 애플 (달러)
  } else if (symbol === "TSLA") {
    basePrice = 200 // 테슬라 (달러)
  } else if (symbol === "GOOGL") {
    basePrice = 140 // 구글 (달러)
  } else if (symbol === "MSFT") {
    basePrice = 350 // 마이크로소프트 (달러)
  } else if (symbol === "NVDA") {
    basePrice = 800 // 엔비디아 (달러)
  } else if (symbol === "META") {
    basePrice = 300 // 메타 (달러)
  } else if (symbol === "AMZN") {
    basePrice = 160 // 아마존 (달러)
  }

  // 최근 3개월 데이터 생성 (약 90일)
  const today = new Date()
  const startDate = new Date()
  startDate.setDate(today.getDate() - 90)

  const currentDate = new Date(startDate)
  let currentPrice = basePrice

  while (currentDate <= today) {
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // 주말 제외

      // 더 현실적인 가격 변동 (트렌드 + 랜덤)
      const trend = Math.sin((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) * 0.001 // 월간 트렌드
      const randomChange = (Math.random() - 0.5) * 0.03 // -1.5% ~ +1.5% 일일 변동
      const totalChange = trend + randomChange

      currentPrice = currentPrice * (1 + totalChange)

      // 가격이 너무 낮아지지 않도록 조정
      const minPrice = basePrice * 0.7
      const maxPrice = basePrice * 1.5

      if (currentPrice < minPrice) {
        currentPrice = minPrice * (1 + Math.random() * 0.05)
      }
      if (currentPrice > maxPrice) {
        currentPrice = maxPrice * (1 - Math.random() * 0.05)
      }

      // 소수점 처리
      const finalPrice = symbol.includes("KS")
        ? Math.round(currentPrice / 100) * 100 // 한국 주식은 100원 단위
        : Math.round(currentPrice * 100) / 100 // 달러는 센트 단위

      data.push({
        date: currentDate.toISOString().split("T")[0],
        close: finalPrice,
        open: finalPrice * (0.995 + Math.random() * 0.01), // 시가
        high: finalPrice * (1 + Math.random() * 0.02), // 고가
        low: finalPrice * (1 - Math.random() * 0.02), // 저가
        volume: Math.floor(Math.random() * 2000000) + 500000, // 거래량
      })
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return {
    symbol,
    name: symbolNameMap[symbol] || symbol,
    data,
    timeZone: symbol.includes("KS") ? "Asia/Seoul" : "US/Eastern",
    isDemo: false,
    isSimulated: true,
    simulationReason: reason,
  }
}

export function getDateRanges() {
  const today = new Date()

  // 1개월 전
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(today.getMonth() - 1)

  // 3개월 전
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(today.getMonth() - 3)

  // 6개월 전
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(today.getMonth() - 6)

  // 1년 전
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(today.getFullYear() - 1)

  // 올해 시작
  const startOfYear = new Date(today.getFullYear(), 0, 1)

  // 작년 시작
  const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1)

  // 작년 끝
  const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31)

  return {
    oneMonthAgo: oneMonthAgo.toISOString().split("T")[0],
    threeMonthsAgo: threeMonthsAgo.toISOString().split("T")[0],
    sixMonthsAgo: sixMonthsAgo.toISOString().split("T")[0],
    oneYearAgo: oneYearAgo.toISOString().split("T")[0],
    startOfYear: startOfYear.toISOString().split("T")[0],
    today: today.toISOString().split("T")[0],
    startOfLastYear: startOfLastYear.toISOString().split("T")[0],
    endOfLastYear: endOfLastYear.toISOString().split("T")[0],
  }
}

// 무료 API 대안: Financial Modeling Prep API
export async function fetchFMPData(symbol: string): Promise<StockDataResponse> {
  try {
    // Financial Modeling Prep API (무료 티어 제공)
    const apiKey = process.env.NEXT_PUBLIC_PREP_API_KEY // 실제 키로 변경 필요
    const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${apiKey}`

    console.log("FMP API 요청 URL:", url)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`FMP API HTTP 오류: ${response.status}`)
    }

    const data = await response.json()
    console.log("FMP API 응답:", data)

    if (data.Error) {
      throw new Error(`FMP API 오류: ${data.Error}`)
    }

    if (!data.historical || !Array.isArray(data.historical)) {
      throw new Error("FMP API: 히스토리컬 데이터를 찾을 수 없습니다")
    }

    const formattedData: StockDataPoint[] = data.historical
      .map((item: any) => ({
        date: item.date,
        close: item.close,
        open: item.open,
        high: item.high,
        low: item.low,
        volume: item.volume,
      }))
      .sort((a: StockDataPoint, b: StockDataPoint) => a.date.localeCompare(b.date))
      .filter((item: StockDataPoint) => !Number.isNaN(item.close))

    if (formattedData.length === 0) {
      throw new Error("FMP API: 유효한 데이터가 없습니다")
    }

    return {
      symbol,
      name: symbolNameMap[symbol] || data.symbol || symbol,
      data: formattedData,
      timeZone: "US/Eastern",
    }
  } catch (error) {
    console.error("FMP API 오류:", error)
    throw error
  }
}

// Yahoo Finance API를 통해 주식 데이터 가져오기 (대체 API)
export async function fetchYahooFinanceData(symbol: string): Promise<StockDataResponse> {
  try {
    // CORS 문제로 인해 직접 호출이 어려울 수 있으므로 프록시 서버나 다른 방법이 필요할 수 있습니다
    throw new Error("Yahoo Finance API는 CORS 제한으로 인해 브라우저에서 직접 호출할 수 없습니다")
  } catch (error) {
    console.error("Yahoo Finance API 오류:", error)
    throw error
  }
}
