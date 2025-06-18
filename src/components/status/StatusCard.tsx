import { StockDataPoint, StockDataResponse } from "@/types/stock";
import LoadingCard from "@/components/status/LoadingCard";
import ErrorCard from "@/components/status/ErrorCard";
import SuccessCard from "./SuccessCard";

interface StatusCardProps {
  isLoading: boolean;
  error: Error | null;
  displayData: StockDataResponse | undefined;
  startDate?: string;
  endDate?: string;
  displayFilteredData: StockDataPoint[];
}

const StatusCard = ({ isLoading, endDate, startDate, displayFilteredData, displayData, error }: StatusCardProps) => {
  return (
    <>
      {isLoading ? (
        <LoadingCard />
      ) : error ? (
        <ErrorCard />
      ) : (
        displayData && (
          <SuccessCard
            displayFilteredData={displayFilteredData}
            displayData={displayData}
            startDate={startDate}
            endDate={endDate}
          />
        )
      )}
    </>
  );
};

export default StatusCard;
