export function drawCircleUtil(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, lineWidth: number) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}
