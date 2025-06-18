import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StockDataPoint, StockDataResponse } from "@/types/stock";

interface SuccessCardProps {
  displayData: StockDataResponse
  startDate?: string;
  endDate?: string;
  displayFilteredData: StockDataPoint[];
}

const SuccessCard = ({displayFilteredData, displayData, endDate, startDate}: SuccessCardProps) => {
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="w-4 h-4 text-green-600" />
        <span className="font-medium text-green-700">
          주식 데이터가 성공적으로 로드되었습니다!
        </span>
        {displayData.isSimulated && (
          <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-300">
            시뮬레이션 데이터
          </Badge>
        )}
      </div>
      {displayData.simulationReason && (
        <p className="text-xs text-yellow-600 mt-1">사유: {displayData.simulationReason}</p>
      )}
      {(startDate || endDate) && (
        <p className="text-xs text-green-600 mt-1">
          📅 분석 기간: {startDate || displayData.data[0]?.date} ~{" "}
          {endDate || displayData.data[displayData.data.length - 1]?.date} ({displayFilteredData.length}
          일간)
        </p>
      )}
    </div>
  )
}

export default SuccessCard;
