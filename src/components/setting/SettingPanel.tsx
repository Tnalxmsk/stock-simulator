import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import SimulationSetting from "@/components/SimulationSetting";
import DateRangeSelector from "@/components/DateRangeSelector";
import StatusCard from "@/components/status/StatusCard";
import { StockDataPoint, StockDataResponse } from "@/types/stock";

interface SettingPanelProps {
  selectedStock: string;
  setSelectedStock: (symbol: string) => void;
  runSimulation: () => void;
  isSimulating: boolean;
  isLoading: boolean;
  error: Error | null;
  stockData: StockDataResponse | undefined;
  displayFilteredData: StockDataPoint[];
}

const SettingPanel = ({ selectedStock, stockData, setSelectedStock, displayFilteredData, isLoading, error, isSimulating, runSimulation }: SettingPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          시뮬레이션 설정
        </CardTitle>
        <CardDescription>종목과 분석 기간을 설정하여 알고리즘 기반 분석을 시작하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SimulationSetting
          selectedStock={selectedStock}
          setSelectedStock={setSelectedStock}
          runSimulation={runSimulation}
          isSimulating={isSimulating}
        />
        <DateRangeSelector />
        {/* 데이터 상태 표시 */}
        <StatusCard
          isLoading={isLoading}
          error={error}
          displayData={stockData}
          displayFilteredData={displayFilteredData}
        />
      </CardContent>
    </Card>
  );
};

export default SettingPanel;
