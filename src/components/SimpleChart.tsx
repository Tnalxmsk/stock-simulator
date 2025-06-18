"use client"

import { useRef, useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Target, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StockDataPoint } from "@/types/stock";

interface SimpleChartProps {
  data: StockDataPoint[]
  simulationResults: any
  shortPeriod: number
  longPeriod: number
}

const SimpleChart = ({ data, simulationResults, shortPeriod, longPeriod }: SimpleChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chartKey, setChartKey] = useState(0)

  useEffect(() => {
    drawChart()
  }, [data, simulationResults, chartKey])

  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas || !data || data.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 캔버스 크기 설정
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // 차트 영역 설정
    const padding = 60
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // 데이터 준비
    const prices = data.map((d) => d.close)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice

    // 배경 그리기
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, rect.width, rect.height)

    // 격자 그리기
    ctx.strokeStyle = "#f0f0f0"
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const y = padding + (chartHeight / 10) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }

    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, padding + chartHeight)
      ctx.stroke()
    }

    // 좌표 변환 함수
    const getX = (index: number) => padding + (chartWidth / (data.length - 1)) * index
    const getY = (price: number) => padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight

    // 주가 라인 그리기
    ctx.strokeStyle = "#2563eb"
    ctx.lineWidth = 2
    ctx.beginPath()
    data.forEach((item, index) => {
      const x = getX(index)
      const y = getY(item.close)
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // 단기 이동평균선 그리기
    if (simulationResults?.shortSMA) {
      ctx.strokeStyle = "#16a34a"
      ctx.lineWidth = 1.5
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      simulationResults.shortSMA.forEach((sma: number | null, index: number) => {
        if (sma !== null) {
          const x = getX(index)
          const y = getY(sma)
          if (index === 0 || simulationResults.shortSMA[index - 1] === null) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
      })
      ctx.stroke()
      ctx.setLineDash([])
    }

    // 장기 이동평균선 그리기
    if (simulationResults?.longSMA) {
      ctx.strokeStyle = "#ea580c"
      ctx.lineWidth = 1.5
      ctx.setLineDash([10, 5])
      ctx.beginPath()
      simulationResults.longSMA.forEach((sma: number | null, index: number) => {
        if (sma !== null) {
          const x = getX(index)
          const y = getY(sma)
          if (index === 0 || simulationResults.longSMA[index - 1] === null) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
      })
      ctx.stroke()
      ctx.setLineDash([])
    }

    // 크로스 신호 그리기
    if (simulationResults?.crosses) {
      simulationResults.crosses.forEach((cross: any) => {
        const x = getX(cross.index)
        const y = getY(data[cross.index]?.close || 0)

        ctx.fillStyle = cross.type === "golden" ? "#16a34a" : "#dc2626"
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, 2 * Math.PI)
        ctx.fill()

        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()
      })
    }

    // 최대 수익 구간 표시
    if (simulationResults?.maxProfit) {
      // 매수점
      const buyX = getX(simulationResults.maxProfit.buyIndex)
      const buyY = getY(simulationResults.maxProfit.buyPrice)
      ctx.fillStyle = "#10b981"
      ctx.beginPath()
      ctx.arc(buyX, buyY, 8, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // 매도점
      const sellX = getX(simulationResults.maxProfit.sellIndex)
      const sellY = getY(simulationResults.maxProfit.sellPrice)
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(sellX, sellY, 8, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()
    }

    if (simulationResults?.disparitySignals) {
      simulationResults.disparitySignals.forEach((signal: any) => {
        const x = getX(signal.index)
        const y = getY(signal.price)

        ctx.fillStyle = signal.status === "overbought" ? "#f87171" : "#60a5fa" // 빨강 or 파랑
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fill()

        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()
      })
    }

    // Y축 라벨 그리기
    ctx.fillStyle = "#666666"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (priceRange / 5) * i
      const y = padding + chartHeight - (chartHeight / 5) * i
      ctx.fillText(`$${price.toFixed(0)}`, padding - 10, y + 4)
    }

    // X축 라벨 그리기 (날짜)
    ctx.textAlign = "center"
    const labelInterval = Math.max(1, Math.floor(data.length / 8))
    for (let i = 0; i < data.length; i += labelInterval) {
      const x = getX(i)
      const date = new Date(data[i].date)
      const label = `${date.getMonth() + 1}/${date.getDate()}`
      ctx.fillText(label, x, padding + chartHeight + 20)
    }
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-lg font-semibold mb-2">차트 데이터가 없습니다</div>
          <div className="text-sm">데이터를 불러오는 중이거나 오류가 발생했습니다.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 차트 상태 정보 */}
      <div className="bg-green-50 p-3 rounded-lg border border-green-200 flex justify-between items-center">
        <div className="text-sm text-green-700">
          ✅ Canvas 차트 준비 완료: {data.length}개 데이터 포인트 | 차트 ID: {chartKey}
        </div>
        <Button onClick={() => setChartKey((prev) => prev + 1)} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-1" />
          새로고침
        </Button>
      </div>

      {/* Canvas 차트 */}
      <div className="w-full bg-white border border-gray-200 rounded-lg p-4">
        <canvas ref={canvasRef} className="w-full h-96 cursor-crosshair" style={{ width: "100%", height: "384px" }} />
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-4 text-sm bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-600"></div>
          <span>종가</span>
        </div>
        {simulationResults?.shortSMA && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-600 border-dashed border-t"></div>
            <span>단기 SMA({shortPeriod}일)</span>
          </div>
        )}
        {simulationResults?.longSMA && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-orange-600 border-dashed border-t"></div>
            <span>장기 SMA({longPeriod}일)</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span>골든크로스/매수점</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          <TrendingDown className="w-4 h-4 text-red-600" />
          <span>데드크로스/매도점</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <Target className="w-4 h-4 text-blue-600" />
          <span>최대 수익 구간</span>
        </div>
      </div>
    </div>
  )
}

export default SimpleChart;
