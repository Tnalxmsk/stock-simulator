import { useState } from "react";
import { StockResults } from "@/types/stock";

export const useSimulationSetting = () => {
  const [simulationResults, setSimulationResults] = useState<StockResults | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  return {
    setIsSimulating,
    setSimulationResults,
    isSimulating,
    simulationResults,
  };
};
