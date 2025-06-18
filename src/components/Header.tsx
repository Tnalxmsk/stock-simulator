import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-4xl font-bold text-gray-900">🎯 주식 시뮬레이터</h1>
      <p className="text-lg text-gray-600">실제 주식 데이터로 분석하는 스마트 투자 시뮬레이션</p>
      <div className="flex justify-center gap-2 flex-wrap">
        <Badge variant="secondary">SMA (슬라이딩 윈도우)</Badge>
        <Badge variant="secondary">Greedy (탐욕 알고리즘)</Badge>
        <Badge variant="secondary">Peek/Valley 기반 탐색</Badge>
        <Badge variant="secondary">실시간 API 데이터</Badge>
      </div>
    </div>
  )
}

export default Header;
