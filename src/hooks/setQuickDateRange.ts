import { getDateRanges } from "@/lib/api";

export const setQuickDateRange = (setStartDate: (date: string) => void, setEndDate:  (date: string) => void) => {
  const dateRanges = getDateRanges();

  const setPresetRange = (preset: string) => {
    switch (preset) {
      case "1month":
        setStartDate(dateRanges.oneMonthAgo);
        setEndDate(dateRanges.today);
        break;
      case "3months":
        setStartDate(dateRanges.threeMonthsAgo);
        setEndDate(dateRanges.today);
        break;
      case "6months":
        setStartDate(dateRanges.sixMonthsAgo);
        setEndDate(dateRanges.today);
        break;
      case "1year":
        setStartDate(dateRanges.oneYearAgo);
        setEndDate(dateRanges.today);
        break;
      case "ytd":
        setStartDate(dateRanges.startOfYear);
        setEndDate(dateRanges.today);
        break;
      case "lastyear":
        setStartDate(dateRanges.startOfLastYear);
        setEndDate(dateRanges.endOfLastYear);
        break;
      default:
        break;
    }
  };

  return setPresetRange;
}
