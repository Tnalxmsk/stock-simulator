// SMA by sliding window
export const calculateSMA = (
  prices: number[],
  period: number,
): (number | null)[] => {
  const sma: (number | null)[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sum += prices[j];
      }
      sma.push(sum / period);
    }
  }
  return sma;
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

// 날짜로 인덱스 찾기 by Binary Search
export const binarySearchByDate = (
  dates: string[],
  targetDate: string,
): number => {
  let left = 0;
  let right = dates.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midDate = dates[mid];

    if (midDate === targetDate) {
      return mid;
    } else if (midDate < targetDate) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1; // 찾지 못했을 경우
};

// V자형 패턴 탐지 by KMP Algorithm
export const kmpPatternSearch = (
  prices: number[],
  pattern: number[],
): number[] => {
  // 최소 5일 이상의 데이터 필요
  if (prices.length < 5) return [];

  const matches: number[] = [];
  const minPatternLength = 5;

  for (let i = 0; i <= prices.length - minPatternLength; i++) {
    if (isVPattern(prices.slice(i, i + minPatternLength))) {
      matches.push(i);
    }
  }

  return matches;
};

// V자 패턴 판별 함수
const isVPattern = (segment: number[]): boolean => {
  if (segment.length < 5) return false;

  const changes = []
  for (let i = 1; i < segment.length; i++) {
    changes.push((segment[i] - segment[i - 1]) / segment[i - 1]);
  }

  // V자 패턴 조건
  // 처음 2일은 하락 (-2% 이상), 마지막 2일은 상승 (+2% 이상)
  // 중간에 바닥점이 있음

  const firstHalf = changes.slice(0, 2);
  const secondHalf = changes.slice(-2);

  // 1% 이상 하락
  const isDeclineFirst = firstHalf.every((change) => change < -0.01);
  // 1% 이상 상승
  const isRiseSecond = secondHalf.every((change) => change > 0.01);

  return isDeclineFirst && isRiseSecond;
}

// KMP 전처리: Longest Proper Prefix which is also Suffix
function computeLPS(pattern: number[]): number[] {
  const lps = new Array(pattern.length).fill(0)
  let len = 0
  let i = 1

  while (i < pattern.length) {
    if (Math.abs(pattern[i] - pattern[len]) < 0.1) {
      len++
      lps[i] = len
      i++
    } else {
      if (len !== 0) {
        len = lps[len - 1]
      } else {
        lps[i] = 0
        i++
      }
    }
  }

  return lps
}

// 배열 정규화 함수
function normalizeArray(arr: number[]): number[] {
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  const range = max - min

  if (range === 0) return arr.map(() => 0)

  return arr.map((val) => (val - min) / range)
}

// 골든크로스/데드크로스 찾기
export function findGoldenDeadCrosses(shortSMA: (number | null)[], longSMA: (number | null)[]) {
  const crosses: Array<{ type: "golden" | "dead"; index: number }> = []

  for (let i = 1; i < shortSMA.length; i++) {
    const prevShort = shortSMA[i - 1]
    const currShort = shortSMA[i]
    const prevLong = longSMA[i - 1]
    const currLong = longSMA[i]

    // 모든 값이 존재하는지 확인
    if (prevShort !== null && currShort !== null && prevLong !== null && currLong !== null) {
      // 골든크로스: 단기선이 장기선을 아래에서 위로 돌파
      if (prevShort <= prevLong && currShort > currLong) {
        crosses.push({ type: "golden", index: i })
      }
      // 데드크로스: 단기선이 장기선을 위에서 아래로 돌파
      else if (prevShort >= prevLong && currShort < currLong) {
        crosses.push({ type: "dead", index: i })
      }
    }
  }

  return crosses
}
