"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockDataPoint } from "@/types/stock";

interface StockChartProps {
  data: StockDataPoint[];
  simulationResults: any;
  shortPeriod: number;
  longPeriod: number;
}

const StockChart = ({ data, simulationResults, shortPeriod, longPeriod }: StockChartProps) => {
  const [chartKey, setChartKey] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);

  // 클라이언트 사이드에서만 렌더링
  useEffect(() => {
    setIsClient(true);
    setChartError(null);
  }, []);

  // 데이터 변경 시 차트 강제 리렌더링
  useEffect(() => {
    setChartKey((prev) => prev + 1);
    setChartError(null);
  }, [data, simulationResults]);

  console.log("=== StockChart 최종 렌더링 ===");
  console.log("받은 데이터 길이:", data?.length);
  console.log("시뮬레이션 결과:", !!simulationResults);
  console.log("클라이언트 렌더링:", isClient);

  // 차트 데이터 준비 - 더 안전한 방식
  const chartData = React.useMemo(() => {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log("❌ 데이터가 없습니다");
        return [];
      }

      // 데이터 샘플링 (너무 많은 데이터 포인트는 성능 문제 야기)
      const maxPoints = 100;
      const step = Math.max(1, Math.floor(data.length / maxPoints));
      const sampledData = data.filter((_, index) => index % step === 0);

      console.log(`📊 데이터 샘플링: ${data.length} -> ${sampledData.length} 포인트`);

      const result = sampledData
        .map((item, index) => {
          const originalIndex = index * step;

          return {
            date: item.date,
            close: Number(item.close) || 0,
            shortSMA: simulationResults?.shortSMA?.[originalIndex] || null,
            longSMA: simulationResults?.longSMA?.[originalIndex] || null,
            index: originalIndex,
            displayDate: new Date(item.date).toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            }),
          };
        })
        .filter((item) => item.close > 0);

      console.log("✅ 차트 데이터 준비 완료:", result.length, "포인트");
      return result;
    } catch ( error ) {
      console.error("❌ 차트 데이터 준비 중 오류:", error);
      setChartError("차트 데이터 준비 중 오류가 발생했습니다.");
      return [];
    }
  }, [data, simulationResults]);

  // 클라이언트 렌더링 대기
  if (!isClient) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <span className="text-gray-600">차트 초기화 중...</span>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (chartError) {
    return (
      <div className="h-96 flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
        <div className="text-center text-red-600">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <div className="font-semibold mb-1">차트 렌더링 오류</div>
          <div className="text-sm">{chartError}</div>
          <Button
            onClick={() => {
              setChartError(null);
              setChartKey((prev) => prev + 1);
            }}
            className="mt-3"
            variant="outline"
            size="sm"
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!data || data.length === 0 || chartData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-lg font-semibold mb-2">차트 데이터가 없습니다</div>
          <div className="text-sm mb-4">
            원본 데이터: {data?.length || 0}개 | 유효 데이터: {chartData.length}개
          </div>
          <Button onClick={() => setChartKey((prev) => prev + 1)} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            차트 새로고침
          </Button>
        </div>
      </div>
    );
  }

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> ${entry.value?.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 가격 범위 계산
  const prices = chartData.map((item) => item.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;

  console.log("📈 차트 렌더링 시작:", {
    dataPoints: chartData.length,
    priceRange: `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`,
    chartKey,
  });

  return (
    <div className="space-y-4">
      {/* 차트 상단 정보 */}
      {simulationResults?.dataRange?.isFiltered && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-700">
      분석 기간: {simulationResults.dataRange.start} ~ {simulationResults.dataRange.end}
  </span>
            <span className="text-blue-600">({simulationResults.dataRange.totalDays}일간)</span>
          </div>
        </div>
      )}

      {/* 차트 상태 정보 */}
      <div className="bg-green-50 p-3 rounded-lg border border-green-200 flex justify-between items-center">
        <div className="text-sm text-green-700">
          ✅ 차트 준비 완료: {chartData.length}개 데이터 포인트 | 가격 범위: ${minPrice.toFixed(2)} ~ $
          {maxPrice.toFixed(2)} | 차트 ID: {chartKey}
        </div>
        <Button onClick={() => setChartKey((prev) => prev + 1)} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-1" />
          새로고침
        </Button>
      </div>

      {/* 메인 차트 영역 - 고정 높이와 명시적 스타일 */}
      <div
        className="w-full bg-white border border-gray-200 rounded-lg p-4"
        style={{ height: "400px", minHeight: "400px" }}
      >
        <ResponsiveContainer width="100%" height="100%" key={`chart-${chartKey}`}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 11, fill: "#666" }}
              axisLine={{ stroke: "#ccc" }}
              tickLine={{ stroke: "#ccc" }}
              interval="preserveStartEnd"
            />

            <YAxis
              tick={{ fontSize: 11, fill: "#666" }}
              axisLine={{ stroke: "#ccc" }}
              tickLine={{ stroke: "#ccc" }}
              domain={[minPrice - padding, maxPrice + padding]}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* 주가 라인 - 메인 */}
            <Line
              type="monotone"
              dataKey="close"
              stroke="#2563eb"
              strokeWidth={2}
              name="종가"
              dot={false}
              activeDot={{ r: 4, fill: "#2563eb" }}
              connectNulls={false}
              isAnimationActive={false}
            />

            {/* 단기 이동평균선 */}
            {simulationResults?.shortSMA && (
              <Line
                type="monotone"
                dataKey="shortSMA"
                stroke="#16a34a"
                strokeWidth={1.5}
                name={`단기 SMA(${shortPeriod})`}
                dot={false}
                strokeDasharray="5 5"
                connectNulls={false}
                isAnimationActive={false}
              />
            )}

            {/* 장기 이동평균선 */}
            {simulationResults?.longSMA && (
              <Line
                type="monotone"
                dataKey="longSMA"
                stroke="#ea580c"
                strokeWidth={1.5}
                name={`장기 SMA(${longPeriod})`}
                dot={false}
                strokeDasharray="10 5"
                connectNulls={false}
                isAnimationActive={false}
              />
            )}

            {/* 매매 신호 점들 */}
            {simulationResults?.crosses?.map((cross: any, index: number) => {
              const crossData = chartData.find((item) => item.index === cross.index);
              if (!crossData) return null;

              return (
                <ReferenceDot
                  key={`cross-${index}`}
                  x={crossData.displayDate}
                  y={crossData.close}
                  r={5}
                  fill={cross.type === "golden" ? "#16a34a" : "#dc2626"}
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            })}

            {/* 최대 수익 구간 */}
            {simulationResults?.maxProfit && (
              <>
                {chartData.find((item) => item.index === simulationResults.maxProfit.buyIndex) && (
                  <ReferenceDot
                    x={chartData.find((item) => item.index === simulationResults.maxProfit.buyIndex)?.displayDate}
                    y={simulationResults.maxProfit.buyPrice}
                    r={6}
                    fill="#10b981"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )}
                {chartData.find((item) => item.index === simulationResults.maxProfit.sellIndex) && (
                  <ReferenceDot
                    x={chartData.find((item) => item.index === simulationResults.maxProfit.sellIndex)?.displayDate}
                    y={simulationResults.maxProfit.sellPrice}
                    r={6}
                    fill="#ef4444"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-4 text-sm bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-600"></div>
          <span>종가</span>
        </div>
        {simulationResults?.shortSMA && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-600" style={{ borderTop: "2px dashed #16a34a" }}></div>
            <span>단기 SMA({shortPeriod}일)</span>
          </div>
        )}
        {simulationResults?.longSMA && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-orange-600" style={{ borderTop: "2px dashed #ea580c" }}></div>
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
      </div>
    </div>
  );
};

export default StockChart;
