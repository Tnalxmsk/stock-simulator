"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Search,
  DollarSign,
  BookOpen,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";

const TermsGuide = () => {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            주린이를 위한 주식 용어 가이드
          </CardTitle>
          <CardDescription>
            주식 투자의 기본 용어와 개념을 쉽게 설명해드립니다. 각 항목을 클릭해서 자세한 내용을 확인하세요!
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 기본 용어 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />📊 기본 주식 용어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="stock-price">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">기본</Badge>
                  주가 (Stock Price)
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>
                    <strong>주가</strong>는 주식 한 주의 가격을 의미합니다.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>
                      <strong>시가</strong>: 하루 거래가 시작될 때의 첫 거래 가격
                    </li>
                    <li>
                      <strong>고가</strong>: 하루 중 가장 높았던 가격
                    </li>
                    <li>
                      <strong>저가</strong>: 하루 중 가장 낮았던 가격
                    </li>
                    <li>
                      <strong>종가</strong>: 하루 거래가 끝날 때의 마지막 거래 가격 (차트에서 주로 사용)
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="volume">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">기본</Badge>
                  거래량 (Volume)
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>
                    <strong>거래량</strong>은 특정 기간 동안 거래된 주식의 수량입니다.
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>💡 투자 팁:</strong> 거래량이 많으면서 주가가 오르면 상승 신호, 거래량이 많으면서 주가가
                      떨어지면 하락 신호로 해석할 수 있어요!
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* 이동평균선 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />📈 이동평균선 (Moving Average)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sma">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">
                    핵심
                  </Badge>
                  이동평균선이란?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>
                    <strong>이동평균선(SMA)</strong>은 일정 기간 동안의 주가 평균을 선으로 연결한 것입니다.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-700 mb-2">📊 계산 방법</h4>
                      <p className="text-sm">5일 이평선 = (최근 5일 종가의 합) ÷ 5</p>
                      <p className="text-xs text-gray-600 mt-1">예: (100+102+98+105+95) ÷ 5 = 100원</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-700 mb-2">🎯 활용법</h4>
                      <p className="text-sm">주가의 전반적인 흐름과 추세를 파악하는 데 사용합니다.</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="short-long">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">
                    핵심
                  </Badge>
                  단기 vs 장기 이동평균선
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-green-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                        <div className="w-4 h-1 bg-green-600"></div>
                        단기 이동평균선
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• 보통 5일, 10일, 20일</li>
                        <li>• 주가 변화에 빠르게 반응</li>
                        <li>• 단기 추세 파악에 유용</li>
                        <li>• 변동성이 큼</li>
                      </ul>
                    </div>
                    <div className="border border-orange-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
                        <div className="w-4 h-1 bg-orange-600"></div>
                        장기 이동평균선
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• 보통 60일, 120일, 200일</li>
                        <li>• 주가 변화에 천천히 반응</li>
                        <li>• 장기 추세 파악에 유용</li>
                        <li>• 안정적이고 부드러움</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>🤔 왜 두 개를 같이 볼까요?</strong> 단기선과 장기선의 관계를 보면 주가의 방향성을 더
                      정확히 판단할 수 있어요!
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* 크로스 신호 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />🎯 매매 신호 (크로스)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="golden-cross">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <Badge variant="outline" className="bg-green-50">
                    매수신호
                  </Badge>
                  골든크로스 (Golden Cross)
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-700 mb-2">✅ 골든크로스란?</h4>
                    <p className="text-sm mb-3">
                      단기 이동평균선이 장기 이동평균선을 <strong>아래에서 위로</strong> 뚫고 올라가는 현상
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-1 bg-green-600"></div>
                      <span>단기선이</span>
                      <div className="w-8 h-1 bg-orange-600"></div>
                      <span>장기선을 위로 돌파!</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">📈 의미</h5>
                      <ul className="text-sm space-y-1">
                        <li>• 상승 추세 시작 신호</li>
                        <li>• 매수 타이밍으로 해석</li>
                        <li>• 주가 상승 기대감 증가</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">⚠️ 주의사항</h5>
                      <ul className="text-sm space-y-1">
                        <li>• 100% 확실한 신호는 아님</li>
                        <li>• 다른 지표와 함께 판단</li>
                        <li>• 거래량도 함께 확인</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dead-cross">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <Badge variant="outline" className="bg-red-50">
                    매도신호
                  </Badge>
                  데드크로스 (Dead Cross)
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-700 mb-2">❌ 데드크로스란?</h4>
                    <p className="text-sm mb-3">
                      단기 이동평균선이 장기 이동평균선을 <strong>위에서 아래로</strong> 뚫고 내려가는 현상
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-1 bg-green-600"></div>
                      <span>단기선이</span>
                      <div className="w-8 h-1 bg-orange-600"></div>
                      <span>장기선을 아래로 돌파!</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">📉 의미</h5>
                      <ul className="text-sm space-y-1">
                        <li>• 하락 추세 시작 신호</li>
                        <li>• 매도 타이밍으로 해석</li>
                        <li>• 주가 하락 우려 증가</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">💡 대응 방법</h5>
                      <ul className="text-sm space-y-1">
                        <li>• 손절매 고려</li>
                        <li>• 추가 매수 신중히 판단</li>
                        <li>• 시장 상황 종합 분석</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* 알고리즘 설명 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />🤖 시뮬레이터 알고리즘 설명
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="greedy">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <Badge variant="outline" className="bg-blue-50">
                    알고리즘
                  </Badge>
                  Greedy (탐욕) 알고리즘
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>
                    <strong>탐욕 알고리즘</strong>은 가장 낮을 때 사서 가장 높을 때 판다는 이상적인 투자를
                    시뮬레이션합니다.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">🎯 동작 원리</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>전체 기간에서 가장 낮은 가격을 찾습니다</li>
                      <li>그 이후 가장 높은 가격을 찾습니다</li>
                      <li>두 가격의 차이가 최대 수익입니다</li>
                    </ol>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>⚠️ 현실적 한계:</strong> 실제로는 미래를 알 수 없으므로 완벽한 타이밍을 잡기 어려워요.
                      참고용으로만 활용하세요!
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="binary-search">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-600" />
                  <Badge variant="outline" className="bg-purple-50">
                    알고리즘
                  </Badge>
                  Binary Search (이진 탐색)
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>
                    <strong>이진 탐색</strong>은 특정 날짜의 주가를 빠르게 찾는 알고리즘입니다.
                  </p>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-700 mb-2">🔍 동작 원리</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>전체 데이터의 중간점을 확인합니다</li>
                      <li>찾는 날짜와 비교해서 앞/뒤를 결정합니다</li>
                      <li>범위를 절반씩 줄여가며 빠르게 찾습니다</li>
                    </ol>
                  </div>
                  <p className="text-sm text-gray-600">
                    💡 날짜를 선택하면 차트에서 해당 지점이 파란색 점으로 표시됩니다!
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="kmp">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-600" />
                  <Badge variant="outline" className="bg-orange-50">
                    알고리즘
                  </Badge>
                  KMP 패턴 매칭
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>
                    <strong>KMP 알고리즘</strong>은 주가에서 V자형 반등 패턴을 찾는 데 사용됩니다.
                  </p>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-700 mb-2">📉📈 V자 패턴이란?</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>주가가 하락하다가 다시 상승하는 모양</li>
                      <li>바닥에서 반등하는 매수 기회로 해석</li>
                      <li>2일 이상 하락 → 2일 이상 상승 패턴</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>💡 투자 활용:</strong> V자 패턴이 나타나면 주가가 바닥을 찍고 반등할 가능성이 있어요.
                      하지만 항상 맞는 건 아니니 신중하게 판단하세요!
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* 투자 주의사항 */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            ⚠️ 투자 주의사항
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-yellow-700 mb-2">📚 교육 목적</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>이 시뮬레이터는 학습용입니다</li>
                  <li>과거 데이터 기반 분석입니다</li>
                  <li>실제 투자와는 다를 수 있습니다</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-700 mb-2">💰 실제 투자 시</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>여러 지표를 종합적으로 판단하세요</li>
                  <li>리스크 관리를 철저히 하세요</li>
                  <li>전문가 조언을 구하세요</li>
                </ul>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-yellow-300">
              <p className="text-sm font-medium text-center">
                📢 <strong>투자의 책임은 본인에게 있습니다. 신중한 투자 결정을 내리세요!</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsGuide;
