import { create } from "zustand/react";

interface PeriodStoreState {
  shortPeriod: number;
  longPeriod: number;
  setShortPeriod: (period: number) => void;
  setLongPeriod: (period: number) => void;
}

export const usePeriodStore = create<PeriodStoreState>((set) => ({
  shortPeriod: 5,
  longPeriod: 20,
  setShortPeriod: (period: number) => set({ shortPeriod: period }),
  setLongPeriod: (period: number) => set({ longPeriod: period }),
}));

