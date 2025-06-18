import { AlertCircle } from "lucide-react";

const ErrorCard = () => {
  return (
    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center gap-2 text-sm">
        <AlertCircle className="w-4 h-4 text-yellow-600" />
        <span className="font-medium text-yellow-700">
                    API 데이터 로딩에 실패했습니다.
                  </span>
      </div>
    </div>
  )
}

export default ErrorCard;
