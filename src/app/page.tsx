"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Target, BarChart3, Calendar, CalendarRange, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { calculateSMA, findMaxProfitGreedy, kmpPatternSearch, findGoldenDeadCrosses } from "@/lib/algorithms"
import { useStockData, useFilteredStockData } from "@/hooks/use-stock-data"
import { getDateRanges, getBackupData } from "@/lib/api"
import { availableStocks } from "@/types/stock"
import ChartAnalysis from "@/components/ChartAnalysis";
import SimulationResults from "@/components/SimulationResults";
import TermsGuide from "@/components/TermsGuide";

export default function StockSimulator() {
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [shortPeriod, setShortPeriod] = useState(5)
  const [longPeriod, setLongPeriod] = useState(20)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [simulationResults, setSimulationResults] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [forceBackupData, setForceBackupData] = useState(false)

  // 날짜 범위 계산
  const dateRanges = getDateRanges()

  // TanStack Query로 주식 데이터 가져오기
  const { data: stockData, isLoading, error } = useStockData(selectedStock)

  // 날짜 범위로 필터링된 데이터
  const filteredData = useFilteredStockData(stockData, startDate || null, endDate || null)

  // 백업 데이터 강제 사용
  const useBackupData = () => {
    setForceBackupData(true)
    const backupData = getBackupData(selectedStock, "사용자 요청으로 백업 데이터 사용")
    console.log("백업 데이터 강제 사용:", backupData)
  }

  // 페이지 로드 시 자동으로 시뮬레이션 실행
  useEffect(() => {
    if (stockData && stockData.data && stockData.data.length > 0 && !simulationResults) {
      console.log("자동 시뮬레이션 실행")
      runSimulation()
    }
  }, [simulationResults, stockData])

  const runSimulation = async () => {
    let dataToUse = stockData

    // 백업 데이터 강제 사용 또는 데이터가 없는 경우
    if (forceBackupData || !stockData || !stockData.data || stockData.data.length === 0) {
      console.log("백업 데이터 사용")
      dataToUse = getBackupData(selectedStock, "데이터 없음 또는 강제 사용")
    }

    if (!dataToUse || !dataToUse.data || dataToUse.data.length === 0) {
      console.error("시뮬레이션할 데이터가 없습니다")
      return
    }

    setIsSimulating(true)

    // 필터링된 데이터 계산
    let dataForSimulation = dataToUse.data
    if (startDate) {
      dataForSimulation = dataForSimulation.filter((item) => item.date >= startDate)
    }
    if (endDate) {
      dataForSimulation = dataForSimulation.filter((item) => item.date <= endDate)
    }

    console.log("시뮬레이션 데이터:", dataForSimulation.length, "포인트")

    // 시뮬레이션 지연 효과
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const prices = dataForSimulation.map((d) => d.close)
    const dates = dataForSimulation.map((d) => d.date)

    // KMP: 개선된 V자형 패턴 탐지
    const patternFound = kmpPatternSearch(prices, [])

    // SMA 계산 (슬라이딩 윈도우)
    const shortSMA = calculateSMA(prices, shortPeriod)
    const longSMA = calculateSMA(prices, longPeriod)

    // Greedy 알고리즘: 최대 수익 구간
    const maxProfit = findMaxProfitGreedy(prices)

    // 골든크로스/데드크로스 찾기
    const crosses = findGoldenDeadCrosses(shortSMA, longSMA)

    const results = {
      shortSMA,
      longSMA,
      maxProfit,
      patternFound,
      crosses,
      stockName: dataToUse.name,
      dataRange: {
        start: dataForSimulation[0]?.date || dates[0],
        end: dataForSimulation[dataForSimulation.length - 1]?.date || dates[dates.length - 1],
        totalDays: dataForSimulation.length,
        isFiltered: !!(startDate || endDate),
        originalStart: dataToUse.data[0]?.date,
        originalEnd: dataToUse.data[dataToUse.data.length - 1]?.date,
        originalTotalDays: dataToUse.data.length,
        customRange: {
          startDate: startDate || null,
          endDate: endDate || null,
        },
      },
      // 추가 분석 데이터
      rawData: dataForSimulation,
      prices,
      dates,
    }

    console.log("시뮬레이션 결과:", results)
    setSimulationResults(results)
    setIsSimulating(false)
  }

  const clearDateFilter = () => {
    setStartDate("")
    setEndDate("")
    setSimulationResults(null)
  }

  const setPresetRange = (preset: string) => {
    switch (preset) {
      case "1month":
        setStartDate(dateRanges.oneMonthAgo)
        setEndDate(dateRanges.today)
        break
      case "3months":
        setStartDate(dateRanges.threeMonthsAgo)
        setEndDate(dateRanges.today)
        break
      case "6months":
        setStartDate(dateRanges.sixMonthsAgo)
        setEndDate(dateRanges.today)
        break
      case "1year":
        setStartDate(dateRanges.oneYearAgo)
        setEndDate(dateRanges.today)
        break
      case "ytd":
        setStartDate(dateRanges.startOfYear)
        setEndDate(dateRanges.today)
        break
      case "lastyear":
        setStartDate(dateRanges.startOfLastYear)
        setEndDate(dateRanges.endOfLastYear)
        break
      default:
        break
    }
  }

  // 실제 데이터 또는 백업 데이터 결정
  const displayData = forceBackupData ? getBackupData(selectedStock, "백업 데이터 강제 사용") : stockData
  const displayFilteredData = forceBackupData
    ? useFilteredStockData(getBackupData(selectedStock, "백업 데이터 강제 사용"), startDate || null, endDate || null)
    : filteredData

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">🎯 주식 시뮬레이터</h1>
          <p className="text-lg text-gray-600">실제 주식 데이터로 분석하는 스마트 투자 시뮬레이션</p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary">SMA (슬라이딩 윈도우)</Badge>
            <Badge variant="secondary">Greedy (탐욕 알고리즘)</Badge>
            <Badge variant="secondary">KMP 패턴 매칭</Badge>
            <Badge variant="secondary">실시간 API 데이터</Badge>
          </div>
        </div>

        {/* 설정 패널 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              시뮬레이션 설정
            </CardTitle>
            <CardDescription>종목과 분석 기간을 설정하여 알고리즘 기반 분석을 시작하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 첫 번째 행: 종목, 이평선 설정 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">종목 선택</Label>
                <Select value={selectedStock} onValueChange={setSelectedStock}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStocks.map((stock) => (
                      <SelectItem key={stock.symbol} value={stock.symbol}>
                        {stock.name} ({stock.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short">단기 이평선</Label>
                <Input
                  id="short"
                  type="number"
                  value={shortPeriod}
                  onChange={(e) => setShortPeriod(Number(e.target.value))}
                  min="1"
                  max="50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long">장기 이평선</Label>
                <Input
                  id="long"
                  type="number"
                  value={longPeriod}
                  onChange={(e) => setLongPeriod(Number(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={runSimulation} disabled={isSimulating} className="w-full" size="lg">
                  {isSimulating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      분석 중...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      시뮬레이션 실행
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-end">
                <Button onClick={useBackupData} variant="outline" className="w-full" size="lg">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  데모 데이터 사용
                </Button>
              </div>
            </div>

            {/* 두 번째 행: 날짜 범위 설정 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarRange className="w-4 h-4 text-blue-600" />
                <Label className="text-sm font-medium">분석 기간 설정</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm">
                    시작 날짜
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm">
                    종료 날짜
                  </Label>
                  <div className="flex gap-1">
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="YYYY-MM-DD"
                      className="flex-1"
                    />
                    {(startDate || endDate) && (
                      <Button variant="outline" size="sm" onClick={clearDateFilter}>
                        ✕
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">빠른 설정</Label>
                  <Select onValueChange={setPresetRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="기간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">최근 1개월</SelectItem>
                      <SelectItem value="3months">최근 3개월</SelectItem>
                      <SelectItem value="6months">최근 6개월</SelectItem>
                      <SelectItem value="1year">최근 1년</SelectItem>
                      <SelectItem value="ytd">올해 (YTD)</SelectItem>
                      <SelectItem value="lastyear">작년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 데이터 상태 표시 */}
            {isLoading ? (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="font-medium text-blue-700">주식 데이터를 불러오는 중입니다...</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">여러 API를 시도하고 있습니다. 잠시만 기다려주세요.</p>
              </div>
            ) : error ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-700">
                    API 데이터 로딩에 실패했습니다. 데모 데이터 사용 버튼을 클릭하세요.
                  </span>
                </div>
                <p className="text-xs text-yellow-600 mt-1">오류: {error.message}</p>
              </div>
            ) : (
              displayData && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-700">
                      {displayData.name} 데이터 로드 완료: {displayData.data.length}일 데이터
                    </span>
                    {displayData.isSimulated && (
                      <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-300">
                        시뮬레이션 데이터
                      </Badge>
                    )}
                    {forceBackupData && (
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-300">
                        데모 데이터
                      </Badge>
                    )}
                  </div>
                  {displayData.simulationReason && (
                    <p className="text-xs text-yellow-600 mt-1">사유: {displayData.simulationReason}</p>
                  )}
                  {(startDate || endDate) && (
                    <p className="text-xs text-green-600 mt-1">
                      📅 분석 기간: {startDate || displayData.data[0]?.date} ~{" "}
                      {endDate || displayData.data[displayData.data.length - 1]?.date} ({displayFilteredData.length}
                      일간)
                    </p>
                  )}
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* 결과 표시 */}
        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart">📈 차트 분석</TabsTrigger>
            <TabsTrigger value="results">📊 알고리즘 결과</TabsTrigger>
            <TabsTrigger value="guide">📚 용어 가이드</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <ChartAnalysis
              data={displayFilteredData}
              simulationResults={simulationResults}
              shortPeriod={shortPeriod}
              longPeriod={longPeriod}
              stockName={displayData?.name}
            />
          </TabsContent>

          <TabsContent value="results">
            <SimulationResults results={simulationResults} />
          </TabsContent>

          <TabsContent value="guide">
            <TermsGuide />
          </TabsContent>
        </Tabs>

        {/* 알고리즘 설명 */}
        <Card>
          <CardHeader>
            <CardTitle>🧠 적용된 알고리즘</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">1. SMA (슬라이딩 윈도우)</h3>
                <p className="text-sm text-gray-600">
                  일정 기간의 평균 주가를 계산하여 추세를 부드럽게 표현하고 골든크로스/데드크로스를 탐지합니다.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-600 mb-2">2. Greedy 알고리즘</h3>
                <p className="text-sm text-gray-600">
                  최저점에서 매수하고 최고점에서 매도하는 최적의 1회 거래 시점을 찾아 최대 수익을 계산합니다.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-purple-600 mb-2">3. 실시간 API 데이터</h3>
                <p className="text-sm text-gray-600">
                  여러 API를 통해 실제 주식 시장 데이터를 가져와 분석합니다. API 실패 시 시뮬레이션 데이터를 사용합니다.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-orange-600 mb-2">4. KMP 패턴 매칭</h3>
                <p className="text-sm text-gray-600">
                  V자형 반등 패턴과 같은 특정 주가 패턴이 선택한 기간에 존재하는지 효율적으로 탐지합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
