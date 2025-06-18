import { useState } from "react";

export const useSimulationSetting = () => {
  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  return {
    setIsSimulating,
    setSimulationResults,
    isSimulating,
    simulationResults,
  };
};
