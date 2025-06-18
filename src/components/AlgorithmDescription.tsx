import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AlgorithmDescription = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🧠 적용된 알고리즘</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-green-600 mb-2">1. SMA (슬라이딩 윈도우)</h3>
            <p className="text-sm text-gray-600">
              일정 기간의 평균 주가를 계산하여 추세를 부드럽게 표현하고 골든크로스/데드크로스를 탐지합니다.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-blue-600 mb-2">2. Binary Search 알고리즘</h3>
            <p className="text-sm text-gray-600">
              사용자가 선택한 날짜의 인덱스를 빠르게 찾습니다.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-purple-600 mb-2">3. 실시간 API 데이터</h3>
            <p className="text-sm text-gray-600">
              여러 API를 통해 실제 주식 시장 데이터를 가져와 분석합니다. API 실패 시 시뮬레이션 데이터를 사용합니다.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-orange-600 mb-2">4. Peek/Valley 기반 탐색</h3>
            <p className="text-sm text-gray-600">
              V자형 반등 패턴과 같은 특정 주가 패턴이 선택한 기간에 존재하는지 효율적으로 탐지합니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AlgorithmDescription;
