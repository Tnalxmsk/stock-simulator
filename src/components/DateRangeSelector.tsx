import { CalendarRange } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setQuickDateRange } from "@/hooks/setQuickDateRange";
import { useDateStore } from "@/store/useDateStore";

const DateRangeSelector = () => {
  const { startDate, endDate, setStartDate, setEndDate, clearDateFilter } = useDateStore();
  const setPresetRange = setQuickDateRange(setStartDate, setEndDate);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CalendarRange className="w-4 h-4 text-blue-600" />
        <Label className="text-sm font-medium">분석 기간 설정</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm">
            시작 날짜
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm">
            종료 날짜
          </Label>
          <div className="flex gap-1">
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="flex-1"
            />
            {(startDate || endDate) && (
              <Button variant="outline" size="sm" onClick={clearDateFilter}>
                ✕
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">빠른 설정</Label>
          <Select onValueChange={setPresetRange}>
            <SelectTrigger>
              <SelectValue placeholder="기간 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">최근 1개월</SelectItem>
              <SelectItem value="3months">최근 3개월</SelectItem>
              <SelectItem value="6months">최근 6개월</SelectItem>
              <SelectItem value="1year">최근 1년</SelectItem>
              <SelectItem value="ytd">올해 (YTD)</SelectItem>
              <SelectItem value="lastyear">작년</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default DateRangeSelector;
