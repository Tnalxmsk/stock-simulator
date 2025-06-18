import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartAnalysis from "@/components/ChartAnalysis";
import SimulationResults from "@/components/SimulationResults";
import TermsGuide from "@/components/TermsGuide";
import { StockDataPoint, StockDataResponse, StockResults } from "@/types/stock";

interface SimulatorTabsProps {
  displayData: StockDataResponse | undefined;
  displayFilteredData: StockDataPoint[];
  simulationResults: StockResults;
  shortPeriod: number;
  longPeriod: number;
}

const SimulatorTabs = ({
    displayData,
    simulationResults,
    displayFilteredData,
    shortPeriod,
    longPeriod,
  }: SimulatorTabsProps) => {
  return (
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
  );
};

export default SimulatorTabs;
