export function calculateCellSize(strings: string[]) {
  let maxSize = 72;
  const padding = 6;

  const totalRows = strings.length;
  const totalCols = Math.max(...strings.map(str => str.length));

  const cellWidth = maxSize;
  const cellHeight = maxSize;

  let gridSize = {
    width: totalCols * cellWidth + (totalCols - 1) * padding,
    height: totalRows * cellHeight + (totalRows - 1) * padding,
  };

  let offsetY = Array.from({ length: totalRows }, (_, i) => {
    let strWidth = strings[i].length * 12; // Assuming a font size of 12 per character
    return (cellHeight - strWidth) / 2;
  });

  while (gridSize.width > 600 || gridSize.height > 600) {
    maxSize -= 1;

    const cellWidth = maxSize;
    const cellHeight = maxSize;

    gridSize = {
      width: totalCols * cellWidth + (totalCols - 1) * padding,
      height: totalRows * cellHeight + (totalRows - 1) * padding,
    };
  }

  return { width: maxSize, height: maxSize, offsetY };
}
