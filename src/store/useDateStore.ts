import { create } from "zustand/react";

interface DateStoreState {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  clearDateFilter: () => void;
}

export const useDateStore = create<DateStoreState>((set) => ({
  startDate: "",
  endDate: "",
  setStartDate: (date: string) => set({ startDate: date }),
  setEndDate: (date: string) => set({ endDate: date }),
  clearDateFilter: () => set({ startDate: "", endDate: "" }),
}));
