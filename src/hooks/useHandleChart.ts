import { StockDataPoint } from "@/types/stock";
import { RefObject } from "react";

export const drawChart = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  volumeCanvasRef: RefObject<HTMLCanvasElement | null>,
  data: StockDataPoint[],
  simulationResults
) => {
  const canvas = canvasRef.current;
  const volumeCanvas = volumeCanvasRef.current;
  if (!canvas || !volumeCanvas || !data || data.length === 0) return;

  const ctx = canvas.getContext("2d");
  const volumeCtx = volumeCanvas.getContext("2d");
  if (!ctx || !volumeCtx) return;

  // 캔버스 크기 설정
  const rect = canvas.getBoundingClientRect();
  const volumeRect = volumeCanvas.getBoundingClientRect();

  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  volumeCanvas.width = volumeRect.width * window.devicePixelRatio;
  volumeCanvas.height = volumeRect.height * window.devicePixelRatio;

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  volumeCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

  // 차트 영역 설정
  const padding = 60;
  const chartWidth = rect.width - padding * 2;
  const chartHeight = rect.height - padding * 2;
  const volumeHeight = volumeRect.height - 20;

  // 데이터 준비 - OHLC 생성
  const chartData = data.map((item) => ({
    ...item,
    open: item.open || item.close * (0.995 + Math.random() * 0.01),
    high: item.high || item.close * (1 + Math.random() * 0.02),
    low: item.low || item.close * (1 - Math.random() * 0.02),
    volume: item.volume || Math.floor(Math.random() * 2000000) + 500000,
  }));

  // 가격 범위 계산
  const allPrices = chartData.flatMap((d) => [d.open, d.high, d.low, d.close]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice;
  const pricePadding = priceRange * 0.1;

  // 볼륨 범위 계산
  const volumes = chartData.map((d) => d.volume);
  const maxVolume = Math.max(...volumes);

  // 좌표 변환 함수
  const getX = (index: number) => padding + (chartWidth / (chartData.length - 1)) * index;
  const getY = (price: number) =>
    padding + chartHeight - ((price - minPrice + pricePadding) / (priceRange + pricePadding * 2)) * chartHeight;
  const getVolumeY = (volume: number) => volumeHeight - (volume / maxVolume) * volumeHeight;

  // 메인 차트 배경
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, rect.width, rect.height);

  // 볼륨 차트 배경
  volumeCtx.fillStyle = "#ffffff";
  volumeCtx.fillRect(0, 0, volumeRect.width, volumeRect.height);

  // 격자 그리기 (메인 차트)
  ctx.strokeStyle = "#f0f0f0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const y = padding + (chartHeight / 10) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + chartWidth, y);
    ctx.stroke();
  }

  for (let i = 0; i <= 10; i++) {
    const x = padding + (chartWidth / 10) * i;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, padding + chartHeight);
    ctx.stroke();
  }

  // 캔들스틱 그리기
  const candleWidth = Math.max(2, (chartWidth / chartData.length) * 0.6);

  chartData.forEach((item, index) => {
    const x = getX(index);
    const openY = getY(item.open);
    const highY = getY(item.high);
    const lowY = getY(item.low);
    const closeY = getY(item.close);

    const isUp = item.close > item.open;
    const bodyTop = Math.min(openY, closeY);
    /*const bodyBottom = Math.max(openY, closeY)*/
    const bodyHeight = Math.abs(closeY - openY);

    // 심지(Wick) 그리기
    ctx.strokeStyle = isUp ? "#26a69a" : "#ef5350";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    // 캔들 몸체 그리기
    if (bodyHeight < 1) {
      // 도지 캔들 (시가 = 종가)
      ctx.strokeStyle = "#666666";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - candleWidth / 2, openY);
      ctx.lineTo(x + candleWidth / 2, openY);
      ctx.stroke();
    } else {
      // 일반 캔들
      ctx.fillStyle = isUp ? "#26a69a" : "#ef5350";
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

      // 캔들 테두리
      ctx.strokeStyle = isUp ? "#1e7e6f" : "#c62828";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    }

    // 볼륨 바 그리기
    const volumeBarHeight = getVolumeY(0) - getVolumeY(item.volume);
    volumeCtx.fillStyle = isUp ? "#26a69a80" : "#ef535080";
    volumeCtx.fillRect(x - candleWidth / 2, getVolumeY(item.volume), candleWidth, volumeBarHeight);
  });

  // 이동평균선 그리기
  if (simulationResults?.shortSMA) {
    ctx.strokeStyle = "#16a34a";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    simulationResults.shortSMA.forEach((sma: number | null, index: number) => {
      if (sma !== null) {
        const x = getX(index);
        const y = getY(sma);
        if (index === 0 || simulationResults.shortSMA[index - 1] === null) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (simulationResults?.longSMA) {
    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    simulationResults.longSMA.forEach((sma: number | null, index: number) => {
      if (sma !== null) {
        const x = getX(index);
        const y = getY(sma);
        if (index === 0 || simulationResults.longSMA[index - 1] === null) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 크로스 신호 그리기
  if (simulationResults?.crosses) {
    simulationResults.crosses.forEach((cross: any) => {
      const x = getX(cross.index);
      const y = getY(chartData[cross.index]?.close || 0);

      ctx.fillStyle = cross.type === "golden" ? "#16a34a" : "#dc2626";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  // 최대 수익 구간 표시
  if (simulationResults?.maxProfit) {
    // 매수점
    const buyX = getX(simulationResults.maxProfit.buyIndex);
    const buyY = getY(simulationResults.maxProfit.buyPrice);
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(buyX, buyY, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 매도점
    const sellX = getX(simulationResults.maxProfit.sellIndex);
    const sellY = getY(simulationResults.maxProfit.sellPrice);
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(sellX, sellY, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Y축 라벨 (가격)
  ctx.fillStyle = "#666666";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "right";
  for (let i = 0; i <= 5; i++) {
    const price = minPrice + (priceRange / 5) * i;
    const y = padding + chartHeight - (chartHeight / 5) * i;
    ctx.fillText(`$${price.toFixed(0)}`, padding - 10, y + 4);
  }

  // X축 라벨 (날짜)
  ctx.textAlign = "center";
  const labelInterval = Math.max(1, Math.floor(chartData.length / 8));
  for (let i = 0; i < chartData.length; i += labelInterval) {
    const x = getX(i);
    const date = new Date(chartData[i].date);
    const label = `${date.getMonth() + 1}/${date.getDate()}`;
    ctx.fillText(label, x, padding + chartHeight + 20);
  }

  // 볼륨 Y축 라벨
  volumeCtx.fillStyle = "#666666";
  volumeCtx.font = "10px sans-serif";
  volumeCtx.textAlign = "right";
  for (let i = 0; i <= 3; i++) {
    const volume = (maxVolume / 3) * i;
    const y = volumeHeight - (volumeHeight / 3) * i;
    const label = volume > 1000000 ? `${(volume / 1000000).toFixed(1)}M` : `${(volume / 1000).toFixed(0)}K`;
    volumeCtx.fillText(label, 50, y + 4);
  }
};
