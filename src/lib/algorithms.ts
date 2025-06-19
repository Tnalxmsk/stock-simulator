class CircularQueue {
  private buffer: number[];
  private head = 0;    // 다음 dequeue 위치
  private size = 0;    // 현재 버퍼에 든 요소 개수
  constructor(private capacity: number) {
    this.buffer = new Array(capacity);
  }

  enqueue(x: number) {
    const tail = (this.head + this.size) % this.capacity;
    this.buffer[tail] = x;
    if (this.size < this.capacity) {
      this.size++;
    } else {
      // capacity 초과 시 head 가리키는 값을 자동으로 덮어쓰며 dequeue
      this.head = (this.head + 1) % this.capacity;
    }
  }

  dequeue(): number {
    if (this.size === 0) throw new Error('Empty');
    const val = this.buffer[this.head];
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    return val;
  }

  isFull() {
    return this.size === this.capacity;
  }

  isEmpty() {
    return this.size === 0;
  }
}

// 슬라이딩 윈도우 + CircularQueue 기반 SMA 계산
export const calculateSMA_Optimized = (
  prices: number[],
  period: number,
): (number | null)[] => {
  const result: (number | null)[] = [];
  const queue = new CircularQueue(period);
  let sum = 0;

  for (let i = 0; i < prices.length; i++) {
    if (queue.isFull()) {
      sum -= queue.dequeue();
    }
    queue.enqueue(prices[i]);
    sum += prices[i];

    result.push(queue.isFull() ? sum / period : null);
  }
  return result;
};


// 최대 수익 1회 매매 찾기 by Greedy Algorithm
export const findMaxProfitGreedy = (prices: number[]) => {
  if (prices.length < 2) return null;

  let minPrice = prices[0];
  let minIndex = 0;
  let maxProfit = 0;
  let buyIndex = 0;
  let sellIndex = 0;

  for (let i = 1; i < prices.length; i++) {
    // 현재 최저가보다 낮으면 업데이트
    if (prices[i] < minPrice) {
      minPrice = prices[i];
      minIndex = i;
    }

    // 현재 가격에서 최저가를 뺀 수이익이 최대 수익보다 크면 업데이트
    const currentProfit = prices[i] - minPrice;
    if (currentProfit > maxProfit) {
      maxProfit = currentProfit;
      buyIndex = minIndex;
      sellIndex = i;
    }
  }

  return {
    profit: maxProfit,
    buyPrice: prices[buyIndex],
    sellPrice: prices[sellIndex],
    buyIndex: buyIndex,
    sellIndex: sellIndex,
  };
};

// V자형 패턴 탐지 by Peek/Valley 기반 탐색
export const detectVPatternsHybrid = (
  prices: number[],
): number[] => {
  const candidates = quicValleyCandidates(prices);
  return confirmVPatternWithDeque(prices, candidates);
};

// Peek/Valley 기반 후보 탐색
const quicValleyCandidates = (prices: number[]): number[] => {
  const candidates: number[] = [];
  for (let i = 2; i < prices.length - 2; i++) {
    if (
      prices[i - 2] > prices[i - 1] &&
      prices[i - 1] > prices[i] &&
      prices[i + 1] > prices[i] &&
      prices[i + 2] > prices[i]
    ) {
      candidates.push(i);
    }
  }
  return candidates;
};

// 슬라이싱 대신 Deque(윈도우 배열)로 성능 개선 + 자료구조 활용
const confirmVPatternWithDeque = (prices: number[], indices: number[]): number[] => {
  const result: number[] = [];
  const window: number[] = new Array(5);

  for (const i of indices) {
    if (i - 2 < 0 || i + 2 >= prices.length) continue;

    // 슬라이딩 윈도우 수동 구성 (자료구조로 명시적 관리)
    for (let offset = -2; offset <= 2; offset++) {
      window[offset + 2] = prices[i + offset];
    }

    if (isVPattern(window)) {
      result.push(i);
    }
  }

  return result;
};

// V자 패턴 판별 함수
const isVPattern = (segment: number[]): boolean => {
  const changes: number[] = [];
  for (let i = 1; i < segment.length; i++) {
    changes.push((segment[i] - segment[i - 1]) / segment[i - 1]);
  }

  const firstHalf = changes.slice(0, 2);
  const secondHalf = changes.slice(-2);

  const isDeclineFirst = firstHalf.every((change) => change < -0.01);
  const isRiseSecond = secondHalf.every((change) => change > 0.01);

  return isDeclineFirst && isRiseSecond;
};

// 골든크로스/데드크로스 찾기
export function findGoldenDeadCrosses(shortSMA: (number | null)[], longSMA: (number | null)[]) {
  const crosses: Array<{ type: "golden" | "dead"; index: number }> = [];

  for (let i = 1; i < shortSMA.length; i++) {
    const prevShort = shortSMA[i - 1];
    const currShort = shortSMA[i];
    const prevLong = longSMA[i - 1];
    const currLong = longSMA[i];

    // 모든 값이 존재하는지 확인
    if (prevShort !== null && currShort !== null && prevLong !== null && currLong !== null) {
      // 골든크로스: 단기선이 장기선을 아래에서 위로 돌파
      if (prevShort <= prevLong && currShort > currLong) {
        crosses.push({ type: "golden", index: i });
      }
      // 데드크로스: 단기선이 장기선을 위에서 아래로 돌파
      else if (prevShort >= prevLong && currShort < currLong) {
        crosses.push({ type: "dead", index: i });
      }
    }
  }

  return crosses;
}

export interface DisparitySignal {
  index: number;
  price: number;
  sma: number;
  disparity: number;
  status: "normal" | "overbought" | "oversold";
}

// 이격도 기반 과열/과매도 탐지
export const detectDisparitySignals = (
  prices: number[],
  sma: (number | null)[],
  threshold = 5,
): DisparitySignal[] => {
  const result: DisparitySignal[] = [];
  for (let i = 0; i < prices.length; i++) {
    const ma = sma[i];
    if (ma === null) continue;

    const diff = ((prices[i] - ma) / ma) * 100;
    if (Math.abs(diff) < threshold) continue;

    result.push({
      index: i,
      price: prices[i],
      sma: ma,
      disparity: diff,
      status: diff > 0 ? "overbought" : "oversold",
    });
  }
  return result;
};
