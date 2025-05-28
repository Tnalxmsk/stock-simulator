"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFMPData, fetchStockData, getBackupData } from "@/lib/api";
import { StockDataResponse } from "@/types/stock";

export function useStockData(symbol: string) {
  return useQuery<StockDataResponse | undefined, Error>({
    queryKey: ["stockData", symbol],
    queryFn: async () => {
      try {
        /*return await fetchStockData(symbol);*/
        return await fetchFMPData(symbol)
      } catch ( error ) {
        console.log(error);
        try {
          return await fetchFMPData(symbol)
        } catch ( error ) {
          console.error("두 번째 API 호출 실패:", error);
          return getBackupData(symbol, "모든 API 호출 실패");
        }
      }
    },
    staleTime: 1000 * 60 * 60, // 1시간
    retry: false, // 자체적으로 여러 API를 시도하므로 React Query의 재시도는 비활성화
  });
}

// 필터링된 데이터 가져오기
export function useFilteredStockData(
  stockData: StockDataResponse | undefined,
  startDate: string | null,
  endDate: string | null,
) {
  if (!stockData || !stockData.data) {
    return [];
  }

  let filteredData = stockData.data;

  if (startDate) {
    filteredData = filteredData.filter((item) => item.date >= startDate);
  }

  if (endDate) {
    filteredData = filteredData.filter((item) => item.date <= endDate);
  }

  return filteredData;
}
