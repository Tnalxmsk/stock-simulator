"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, AlertTriangle, Loader2, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StockDataPoint } from "@/types/stock";
import CandlestickChart from "@/components/CandleStickChart";
import SimpleChart from "@/components/SimpleChart";

interface ChartAnalysisProps {
  data: StockDataPoint[];
  simulationResults: any;
  shortPeriod: number;
  longPeriod: number;
  stockName?: string;
}

const ChartAnalysis = ({ data, simulationResults, shortPeriod, longPeriod, stockName }: ChartAnalysisProps) => {
  const [chartType, setChartType] = useState<"candlestick" | "simple">("candlestick");

  console.log("=== ChartAnalysis with Candlestick ===");
  console.log("받은 데이터:", data?.length, "개");
  console.log("시뮬레이션 결과:", simulationResults ? "있음" : "없음");
  console.log("차트 타입:", chartType);

  // 로딩 상태
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>주가 차트 및 이동평균선</CardTitle>
          <CardDescription>데이터를 불러오는 중...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-lg text-blue-600">데이터를 불러오는 중입니다...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 데이터 없음
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>주가 차트 및 이동평균선</CardTitle>
          <CardDescription>데이터가 없습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-lg mb-2">📊 차트 데이터가 없습니다</div>
              <div className="text-sm">시뮬레이션을 실행해주세요.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 현재 가격과 변동률 계산
  const currentPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

  // 기간 내 최고가/최저가
  const prices = data.map((d) => d.close).filter((price) => !isNaN(price) && price > 0);
  const highPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const lowPrice = prices.length > 0 ? Math.min(...prices) : 0;

  return (
    <div className="space-y-6">
      {/* 차트 타입 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              전문 주식 차트 (캔들스틱 + 볼륨)
            </div>
            <div className="flex gap-2">
              <Button
                variant={chartType === "candlestick" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("candlestick")}
              >
                🕯️ 캔들스틱 차트
              </Button>
              <Button
                variant={chartType === "simple" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("simple")}
              >
                📈 라인 차트
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            {stockName
              ? simulationResults?.dataRange?.isFiltered
                ? `${simulationResults.dataRange.start} ~ ${simulationResults.dataRange.end} 기간의 ${stockName} 캔들스틱 차트`
                : `${stockName} OHLC 캔들스틱 차트와 기술적 분석`
              : "전문적인 주식 차트 (캔들스틱, 볼륨, 이동평균선)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartType === "candlestick" ? (
            <CandlestickChart
              data={data}
              simulationResults={simulationResults}
              shortPeriod={shortPeriod}
              longPeriod={longPeriod}
            />
          ) : (
            <SimpleChart
              data={data}
              simulationResults={simulationResults}
              shortPeriod={shortPeriod}
              longPeriod={longPeriod}
            />
          )}
        </CardContent>
      </Card>

      {/* 분석 요약 */}
      {simulationResults && prices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              분석 요약
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 현재 가격 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">현재 가격</div>
                <div className="text-2xl font-bold text-blue-700">${currentPrice.toFixed(2)}</div>
                <div
                  className={`text-sm ${priceChange >= 0 ? "text-green-600" : "text-red-600"} flex items-center gap-1`}
                >
                  {priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                </div>
              </div>

              {/* 가격 범위 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">가격 범위</div>
                <div className="text-lg font-bold text-gray-700">
                  ${lowPrice.toFixed(2)} - ${highPrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">변동폭: ${(highPrice - lowPrice).toFixed(2)}</div>
              </div>

              {/* 최대 수익 */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 mb-1">최대 수익 기회</div>
                <div className="text-2xl font-bold text-green-700">
                  {simulationResults.maxProfit ? `$${simulationResults.maxProfit.profit.toFixed(2)}` : "N/A"}
                </div>
                <div className="text-sm text-green-600">
                  {simulationResults.maxProfit
                    ? `+${((simulationResults.maxProfit.profit / simulationResults.maxProfit.buyPrice) * 100).toFixed(1)}%`
                    : ""}
                </div>
              </div>

              {/* 신호 개수 */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 mb-1">매매 신호</div>
                <div className="text-2xl font-bold text-purple-700">
                  {simulationResults.crosses ? simulationResults.crosses.length : 0}개
                </div>
                <div className="text-sm text-purple-600">크로스 신호 발견</div>
              </div>
            </div>

            {/* 추세 정보 */}
            {simulationResults.shortSMA && simulationResults.longSMA && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">현재 추세</div>
                <div className="flex items-center gap-2">
                  {simulationResults.shortSMA[simulationResults.shortSMA.length - 1] >
                  simulationResults.longSMA[simulationResults.longSMA.length - 1] ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">상승 추세</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        강세
                      </Badge>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-red-600">하락 추세</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                        약세
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {simulationResults?.disparitySignals && simulationResults?.disparitySignals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              이격도 기반 과열/과매도 시점
            </CardTitle>
            <CardDescription>단기 SMA 기준 ±5% 이상 이격된 시점을 표시합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {simulationResults.disparitySignals.map((signal: any, i: number) => (
                <div
                  key={i}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    signal.status === "overbought" ? "bg-red-50" : "bg-blue-50"
                  }`}
                >
                  <div className="flex flex-col">
              <span
                className={`text-sm font-semibold ${
                  signal.status === "overbought" ? "text-red-600" : "text-blue-600"
                }`}
              >
                {signal.status === "overbought" ? "🔥 과열" : "❄️ 과매도"}
              </span>
                    <span className="text-xs text-gray-500">
                Index: {signal.index} / 가격: ${signal.price.toFixed(2)}
              </span>
                  </div>
                  <div className="text-sm text-gray-700 font-mono">
                    {signal.disparity.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}


      {/* 투자 주의사항 */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            ⚠️ 투자 주의사항
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>
              • <strong>교육 목적:</strong> 이 분석은 알고리즘 학습을 위한 시뮬레이션입니다.
            </p>
            <p>
              • <strong>과거 데이터:</strong> 과거 성과가 미래 수익을 보장하지 않습니다.
            </p>
            <p>
              • <strong>실제 투자:</strong> 실제 투자 시에는 여러 지표를 종합적으로 고려하고 전문가와 상담하세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartAnalysis;
