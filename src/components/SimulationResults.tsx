"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, DollarSign, Clock, CalendarRange } from "lucide-react";

interface SimulationResultsProps {
  results: any;
}

const SimulationResults = ({ results }: SimulationResultsProps) => {
  if (!results) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="opacity-50">
            <CardHeader>
              <CardTitle className="text-gray-400">시뮬레이션을 실행해주세요</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">알고리즘 분석 결과가 여기에 표시됩니다.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const { maxProfit, patternFound, crosses, stockName, dataRange } = results;

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            {stockName} 시뮬레이션 결과 요약
          </CardTitle>
          {dataRange?.isFiltered && (
            <CardDescription className="flex items-center gap-2">
              <CalendarRange className="w-4 h-4" />
              분석 기간: {dataRange.start} ~ {dataRange.end} ({dataRange.totalDays}일간)
              {dataRange.customRange?.startDate && dataRange.customRange?.endDate && (
                <span className="text-xs text-gray-500">
                  (사용자 지정: {dataRange.customRange.startDate} ~ {dataRange.customRange.endDate})
                </span>
              )}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {maxProfit ? `${((maxProfit.profit / maxProfit.buyPrice) * 100).toFixed(2)}%` : "0%"}
              </div>
              <div className="text-sm text-gray-600">최대 수익률</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{crosses ? crosses.length : 0}</div>
              <div className="text-sm text-gray-600">크로스 신호</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{patternFound.length}</div>
              <div className="text-sm text-gray-600">V자 패턴 발견</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 기간 분석 카드 */}
      {dataRange?.isFiltered && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />📊 기간별 분석
            </CardTitle>
            <CardDescription>
              {dataRange.customRange?.startDate && dataRange.customRange?.endDate
                ? `${dataRange.customRange.startDate} ~ ${dataRange.customRange.endDate} 기간 분석 결과`
                : `선택한 기간의 투자 분석 결과입니다`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-1">📊 분석 기간</h4>
                  <p className="text-sm text-gray-600">
                    {dataRange.start} ~ {dataRange.end}
                    <br />
                    <span className="text-xs text-gray-500">총 {dataRange.totalDays}일간 데이터 분석</span>
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-1">🎯 분석 의미</h4>
                  <p className="text-sm text-gray-600">해당 기간의 투자 전략과 패턴을 집중 분석했습니다</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-purple-200">
                <p className="text-sm">
                  <strong>💡 활용법:</strong> 특정 기간을 선택해서 그 기간에 투자했다면? 하는 시뮬레이션을 해보세요!
                  다양한 기간을 비교 분석할 수 있습니다.
                </p>
              </div>
              {dataRange.originalTotalDays > dataRange.totalDays && (
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700">
                    <strong>📈 전체 데이터:</strong> {dataRange.originalStart} ~ {dataRange.originalEnd} (
                    {dataRange.originalTotalDays}일간) 중 {dataRange.totalDays}일간 분석
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Greedy 알고리즘 결과 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Greedy 알고리즘 - 최대 수익 분석
            </CardTitle>
            <CardDescription>
              {dataRange?.isFiltered
                ? `선택한 기간에서 최적 매매 시점`
                : "한 번의 매매로 얻을 수 있는 최대 수익을 계산합니다"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {maxProfit ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">매수 시점</span>
                  <div className="text-right">
                    <div className="font-semibold">{maxProfit.buyPrice.toLocaleString()}원</div>
                    <div className="text-xs text-gray-500">인덱스: {maxProfit.buyIndex}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium">매도 시점</span>
                  <div className="text-right">
                    <div className="font-semibold">{maxProfit.sellPrice.toLocaleString()}원</div>
                    <div className="text-xs text-gray-500">인덱스: {maxProfit.sellIndex}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">총 수익</span>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{maxProfit.profit.toLocaleString()}원</div>
                    <div className="text-xs text-blue-500">
                      +{((maxProfit.profit / maxProfit.buyPrice) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">수익 데이터를 계산할 수 없습니다.</p>
            )}
          </CardContent>
        </Card>

        {/* 골든크로스/데드크로스 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              SMA 크로스 신호
            </CardTitle>
            <CardDescription>단기/장기 이동평균선의 교차점을 분석합니다</CardDescription>
          </CardHeader>
          <CardContent>
            {crosses && crosses.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {crosses.map((cross: any, index: number) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-2 rounded-lg ${
                      cross.type === "golden" ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {cross.type === "golden" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium">
                        {cross.type === "golden" ? "골든크로스" : "데드크로스"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">인덱스: {cross.index}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">크로스 신호가 없습니다</p>
            )}
          </CardContent>
        </Card>

        {/* KMP 패턴 매칭 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              KMP 패턴 매칭
            </CardTitle>
            <CardDescription>V자형 반등 패턴을 탐지합니다</CardDescription>
          </CardHeader>
          <CardContent>
            {patternFound && patternFound.length > 0 ? (
              <div className="space-y-3">
                <Badge variant="outline" className="w-full justify-center text-green-600 border-green-200">
                  ✅ V자 반등 패턴 {patternFound.length}개 발견
                </Badge>
                <div className="text-sm text-gray-600 mb-2">하락 후 반등하는 매수 기회 구간입니다</div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {patternFound.map((index: number, i: number) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-sm font-medium">반등 패턴 #{i + 1}</span>
                      <span className="text-xs text-gray-500">시작점: {index}일차</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📉📈</div>
                <p className="text-gray-500">V자형 반등 패턴이 발견되지 않았습니다</p>
                <p className="text-xs text-gray-400 mt-1">
                  {dataRange?.isFiltered
                    ? "선택한 기간에서는 명확한 반등 신호가 없습니다"
                    : "현재 데이터에서는 명확한 반등 신호가 없습니다"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SimulationResults;
