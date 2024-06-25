export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  cornerRadius: number,
  fillColor: string,
  text: string,
  textColor: string,
  fontSize: number,
): void {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(x + cornerRadius, y);
  ctx.lineTo(x + cellSize - cornerRadius, y);
  ctx.arcTo(x + cellSize, y, x + cellSize, y + cornerRadius, cornerRadius);
  ctx.lineTo(x + cellSize, y + cellSize - cornerRadius);
  ctx.arcTo(
    x + cellSize,
    y + cellSize,
    x + cellSize - cornerRadius,
    y + cellSize,
    cornerRadius,
  );
  ctx.lineTo(x + cornerRadius, y + cellSize);
  ctx.arcTo(x, y + cellSize, x, y + cellSize - cornerRadius, cornerRadius);
  ctx.lineTo(x, y + cornerRadius);
  ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = textColor;
  ctx.font = `${fontSize}px VAG World`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + cellSize / 2, y + cellSize / 2);
}
