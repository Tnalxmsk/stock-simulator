import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { availableStocks } from "@/types/stock";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { usePeriodStore } from "@/store/usePeriodStore";

interface SimulationSettingProps {
  selectedStock: string;
  setSelectedStock: (symbol: string) => void;
  runSimulation: () => void;
  isSimulating: boolean;
}

const SimulationSetting = ({selectedStock, isSimulating, runSimulation, setSelectedStock }: SimulationSettingProps) => {
  const { shortPeriod, longPeriod, setShortPeriod, setLongPeriod   } = usePeriodStore();;
  return (
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
    </div>
  )
}

export default SimulationSetting;
