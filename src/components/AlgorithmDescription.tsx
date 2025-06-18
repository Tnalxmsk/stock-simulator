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
            <h3 className="font-semibold text-yellow-600 mb-2">2. Greedy 알고리즘</h3>
            <p className="text-sm text-gray-600">
              단 한 번의 매수와 매도를 통해 최대 수익을 얻을 수 있는 최적의 타이밍을 탐색합니다.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-orange-600 mb-2">3. Peek/Valley 기반 탐색</h3>
            <p className="text-sm text-gray-600">
              주가가 하락 후 반등하는 V자형 패턴을 효율적으로 탐색하고 변화율 기반으로 정밀 검증합니다.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-blue-600 mb-2">4. 골든/데드크로스 탐지</h3>
            <p className="text-sm text-gray-600">
              단기 이동 평균선이 장기 이동 평균선을 돌파하는 시점을 탐지하여 매수/매도 신호를 제공합니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmDescription;
