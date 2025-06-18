"use client";

import {
  findMaxProfitGreedy,
  detectVPatternsHybrid,
  findGoldenDeadCrosses,
  calculateSMA_Optimized, detectDisparitySignals,
} from "@/lib/algorithms";
import { useStockData, useFilteredStockData } from "@/hooks/use-stock-data";
import { useSimulationSetting } from "@/hooks/useSimulationSetting";
import AlgorithmDescription from "@/components/AlgorithmDescription";
import Header from "@/components/Header";
import SimulatorTabs from "@/components/SimulatorTabs";
import { useDateStore } from "@/store/useDateStore";
import { usePeriodStore } from "@/store/usePeriodStore";
import SettingPanel from "@/components/setting/SettingPanel";
import { useState } from "react";
import { StockResults } from "@/types/stock";

export default function StockSimulator() {
  const { startDate, endDate } = useDateStore();
  const { shortPeriod, longPeriod } = usePeriodStore();
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const { isSimulating, simulationResults, setIsSimulating, setSimulationResults } = useSimulationSetting();

  // TanStack Query로 주식 데이터 가져오기
  const { data: stockData, isLoading, error } = useStockData(selectedStock);

  // 날짜 범위로 필터링된 데이터
  const filteredData = useFilteredStockData(stockData, startDate || null, endDate || null);

  const runSimulation = async () => {
    const dataToUse = stockData;

    if (!dataToUse || !dataToUse.data || dataToUse.data.length === 0) {
      console.error("시뮬레이션할 데이터가 없습니다");
      return;
    }

    setIsSimulating(true);

    // 필터링된 데이터 계산
    let dataForSimulation = dataToUse.data;
    if (startDate) {
      dataForSimulation = dataForSimulation.filter((item) => item.date >= startDate);
    }
    if (endDate) {
      dataForSimulation = dataForSimulation.filter((item) => item.date <= endDate);
    }

    // 시뮬레이션 지연 효과
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const prices = dataForSimulation.map((d) => d.close);
    const dates = dataForSimulation.map((d) => d.date);

    // 개선된 V자형 패턴 탐지
    const patternFound = detectVPatternsHybrid(prices);

    // SMA 계산 (슬라이딩 윈도우)
    const shortSMA = calculateSMA_Optimized(prices, shortPeriod);
    const longSMA = calculateSMA_Optimized(prices, longPeriod);
    // 이격도 기반 과열/과매도 탐지
    const disparitySignals = detectDisparitySignals(prices, shortSMA);


    // Greedy 알고리즘: 최대 수익 구간
    const maxProfit = findMaxProfitGreedy(prices);

    // 골든크로스/데드크로스 찾기
    const crosses = findGoldenDeadCrosses(shortSMA, longSMA);

    const results: StockResults = {
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
      disparitySignals,
      prices,
      dates,
    };
    setSimulationResults(results);
    setIsSimulating(false);
  };

  const displayFilteredData = filteredData;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 상단 헤더 */}
        <Header />
        {/* 설정 패널 */}
        <SettingPanel
          selectedStock={selectedStock}
          setSelectedStock={setSelectedStock}
          runSimulation={runSimulation}
          isSimulating={isSimulating}
          isLoading={isLoading}
          error={error}
          stockData={stockData}
          displayFilteredData={displayFilteredData}
        />
        {/* 시뮬레이션 탭 */}
        <SimulatorTabs
          simulationResults={simulationResults!}
          displayData={stockData}
          displayFilteredData={displayFilteredData}
          longPeriod={longPeriod}
          shortPeriod={shortPeriod}
        />
        {/* 알고리즘 설명 */}
        <AlgorithmDescription />
      </div>
    </div>
  );
}
