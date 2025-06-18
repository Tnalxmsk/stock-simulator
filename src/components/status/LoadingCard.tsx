import { Loader2 } from "lucide-react";

const LoadingCard = () => {
  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
        <span className="font-medium text-blue-700">주식 데이터를 불러오는 중입니다...</span>
      </div>
      <p className="text-xs text-blue-600 mt-1">여러 API를 시도하고 있습니다. 잠시만 기다려주세요.</p>
    </div>
  )
}

export default LoadingCard;
