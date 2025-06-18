import { StockDataPoint } from "@/types/stock";
import { useEffect, useRef, useState } from "react";
import { drawChart } from "@/hooks/useHandleChart";
import { Button } from "@/components/ui/button";
import { BarChart3, RefreshCw, Target, TrendingDown, TrendingUp } from "lucide-react";

interface CandlestickChartProps {
  data: StockDataPoint[];
  simulationResults: any;
  shortPeriod: number;
  longPeriod: number;
}


const CandleStickChart = ({ data, simulationResults, longPeriod, shortPeriod }: CandlestickChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const volumeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [chartKey, setChartKey] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    drawChart(canvasRef, volumeCanvasRef, data, simulationResults);
  }, [data, simulationResults, chartKey]);

  // 마우스 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !data) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    /*const y = e.clientY - rect.top*/

    setMousePos({ x: e.clientX, y: e.clientY })

    // 가장 가까운 데이터 포인트 찾기
    const padding = 60
    const chartWidth = rect.width - padding * 2
    const dataIndex = Math.round(((x - padding) / chartWidth) * (data.length - 1))

    if (dataIndex >= 0 && dataIndex < data.length) {
      setHoveredIndex(dataIndex)
    } else {
      setHoveredIndex(null)
    }
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-lg font-semibold mb-2">캔들스틱 차트 데이터가 없습니다</div>
          <div className="text-sm">데이터를 불러오는 중이거나 오류가 발생했습니다.</div>
        </div>
      </div>
    )
  }

  const hoveredData = hoveredIndex !== null ? data[hoveredIndex] : null

  return (
    <div className="space-y-4">
      {/* 차트 상태 정보 */}
      <div className="bg-green-50 p-3 rounded-lg border border-green-200 flex justify-between items-center">
        <div className="text-sm text-green-700">
          ✅ 캔들스틱 차트 준비 완료: {data.length}개 데이터 포인트 | 차트 ID: {chartKey}
        </div>
        <Button onClick={() => setChartKey((prev) => prev + 1)} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-1" />
          새로고침
        </Button>
      </div>

      {/* 메인 캔들스틱 차트 */}
      <div className="w-full bg-white border border-gray-200 rounded-lg p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            캔들스틱 차트 (OHLC)
          </h3>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair border-b"
          style={{ width: "100%", height: "300px" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* 볼륨 차트 */}
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-600 mb-1">거래량</h4>
          <canvas
            ref={volumeCanvasRef}
            className="w-full cursor-crosshair"
            style={{ width: "100%", height: "100px" }}
          />
        </div>
      </div>

      {/* 호버 툴팁 */}
      {hoveredData && hoveredIndex !== null && (
        <div
          className="fixed bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-50 pointer-events-none"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 10,
            transform: mousePos.x > window.innerWidth - 200 ? "translateX(-100%)" : "none",
          }}
        >
          <div className="text-sm space-y-1">
            <div className="font-semibold">{hoveredData.date}</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>시가: ${(hoveredData.open || hoveredData.close).toFixed(2)}</div>
              <div>고가: ${(hoveredData.high || hoveredData.close * 1.02).toFixed(2)}</div>
              <div>저가: ${(hoveredData.low || hoveredData.close * 0.98).toFixed(2)}</div>
              <div>종가: ${hoveredData.close.toFixed(2)}</div>
            </div>
            <div className="text-xs text-gray-600 border-t pt-1">
              거래량: {((hoveredData.volume || 1000000) / 1000000).toFixed(1)}M
            </div>
            {simulationResults?.shortSMA?.[hoveredIndex] && (
              <div className="text-xs text-green-600">
                단기 SMA: ${simulationResults.shortSMA[hoveredIndex].toFixed(2)}
              </div>
            )}
            {simulationResults?.longSMA?.[hoveredIndex] && (
              <div className="text-xs text-orange-600">
                장기 SMA: ${simulationResults.longSMA[hoveredIndex].toFixed(2)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 범례 */}
      <div className="flex flex-wrap gap-4 text-sm bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-green-500"></div>
          <span>상승 캔들 (종가 &gt; 시가)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-red-500"></div>
          <span>하락 캔들 (종가 &lt; 시가)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-600 border-dashed border-t"></div>
          <span>단기 SMA({shortPeriod}일)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-orange-600 border-dashed border-t"></div>
          <span>장기 SMA({longPeriod}일)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span>골든크로스</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          <TrendingDown className="w-4 h-4 text-red-600" />
          <span>데드크로스</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <Target className="w-4 h-4 text-blue-600" />
          <span>최대 수익 구간</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-300 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
          <span>과열 / 과매도</span>
        </div>
      </div>

      {/* 캔들스틱 차트 설명 */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-700 mb-2">📊 캔들스틱 차트 읽는 법</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-600">
          <div>
            <h5 className="font-medium mb-1">🟢 상승 캔들 (초록색)</h5>
            <ul className="space-y-1 text-xs">
              <li>• 종가가 시가보다 높음</li>
              <li>• 몸체 아래쪽이 시가, 위쪽이 종가</li>
              <li>• 위아래 선은 고가/저가</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">🔴 하락 캔들 (빨간색)</h5>
            <ul className="space-y-1 text-xs">
              <li>• 종가가 시가보다 낮음</li>
              <li>• 몸체 위쪽이 시가, 아래쪽이 종가</li>
              <li>• 위아래 선은 고가/저가</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 text-xs text-blue-600">
          💡 <strong>팁:</strong> 마우스를 차트 위에 올리면 상세한 OHLC 정보를 볼 수 있습니다!
        </div>
      </div>
    </div>
  )
};

export default CandleStickChart;
