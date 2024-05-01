import type { GridItem, TileItem } from './types';

export const calcResponsiveGrid = (
  data: TileItem[],
  maxItemsPerColumn: number,
  containerWidth: number,
  itemUnitHeight?: number,
  bumperWidth: number,
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  centered: number,
  // isCenterX: boolean,
  // isCenterY: boolean,
): {
  items: GridItem[];
  gridHeight: number;
} => {
  const items: GridItem[] = [];
  const itemSizeUnit = 110; // Determine TileSize based on container width and max number of columns

  let columnHeights: number[] = new Array(maxItemsPerColumn).fill(0); // Track the height of each column end.

  
data.forEach((item) => {

  const isCenter = (centered === item.index)
    
    // console.log("item.centered", data)
  
    const xGrow = item?.centered ? 1 : 0
    const yGrow = item?.centered ? 1 : 0
    const widthRatio = (item.widthRatio || 1) + xGrow;
    const heightRatio = (item.heightRatio || 1) + yGrow;
    // console.log(isCenterX, "widthRatio", widthRatio, xGrow, isCenterY, "heightRatio", heightRatio, yGrow)
    let itemWidth = widthRatio * itemSizeUnit;

    let itemHeight = itemUnitHeight * heightRatio
    if(isCenter){
      item.centered = true
    //  console.log("centered", (itemWidth/2))
    }
    else {
      item.centered = false
      // return centered
    }
    // const itemHeight = itemUnitHeight
      // ? itemUnitHeight * heightRatio
      // : heightRatio * itemSizeUnit; 
      // Use itemUnitHeight if provided, else fallback to itemSizeUnit

    // Find the column where the item should be placed.
    let columnIndex = findColumnForItem(
      columnHeights,
      widthRatio,
      maxItemsPerColumn
    );

// 0 1 2 | 3 4 5  
// 3 2 1 | 1 2 3 
// 0 1 2 | 2 1 0 

// 0 1 2 | 2 1 0 
// 0 110 220 | 220 110 0 
// 3*110= 330
// 6*110= 660
// IF PHOTO IS 220 LEFT
// PHOTO IS 110 WIDTH
// PHOTO RIGHT SIDE IS AT 330
// IF PHOTO IS 330 LEFT
// PHOTO IS 110 WIDTH
// PHOTO RIGHT SIDE IS AT 440

    // Calculate item's top and left positions.
    const top = columnHeights[columnIndex]!;
    // STATE FIND PHOTO OF REMAINGING INDEXS
    // USING "COLUMNINDEX" 
    // IS INDEX LEFT OR RIGHT IE INDEX/6 > 3
    // SHIFT DIRECTION
    
    // console.log(columnHeights[columnIndex]!, "+", y, "=", top)
    const left = (columnIndex * itemSizeUnit)-itemSizeUnit/2 
    const right = (containerWidth - (left + 110)) 
    const leftPlusX = ((left) + (x));
    if(columnIndex>2){
      // console.log("RIGHT", columnIndex, left)
      items.push({
        ...item,
        top: top,
        left: left,
        xOffset: left,
        width: itemWidth,
        height: itemHeight,
        colNum: columnIndex,
      });
    }
    if(columnIndex<3){
      // console.log("LEFT", columnIndex, right)
      // console.log("containerWidth - (left - 110)", containerWidth, left, 110)
      items.push({
        ...item,
        top: top,
        right: right,
        xOffset: left,
        width: itemWidth,
        height: itemHeight,
        colNum: columnIndex,
      });
    }
const topPlusY = (top + (y))



    // Place the item.
    // gridItems.push({
    //   ...item,
    //   // top: topPlusY,
    //   // left: leftPlusX,
    //   top: top,
    //   left: left,
    //   right: right,
    //   xOffset: left,
    //   width: itemWidth,
    //   height: itemHeight,
    //   colNum: columnIndex,
    // });

    // Update the column heights for the columns that the item spans.
    // This needs to accommodate the actual height used (itemHeight).
    for (let i = columnIndex; i < columnIndex + widthRatio; i++) {
      columnHeights[i] = top + itemHeight; // Update to use itemHeight
    }
  });

  // Calculate the total height of the grid.
  const gridHeight = Math.max(...columnHeights);

  return {
    items,
    gridHeight,
  };
};

const shiftColumnOfItems = (
  index: number, 
  columnHeights: number[],
  widthRatio: number,
  maxItemsPerColumn: number
) => {
  // FIND ITEMS ON ROW
  // FIND ITEMS ON ROWS BELOW
  // SHIFT ITEMS 55 IN EITHER DIRECTION

  // If the item spans only one column, find the shortest column.
  if (widthRatio === 1) {
    return columnHeights.indexOf(Math.min(...columnHeights));
  }

  // If the item spans multiple columns, find the first place it can fit.
  let minHeight = Math.min(...columnHeights);
  let columnIndex = columnHeights.indexOf(minHeight);

  for (let i = 0; i <= maxItemsPerColumn + widthRatio; i++) {
    // Check if the item can fit in the next 'widthRatio' columns.
    const columnsToCheck = columnHeights.slice(i, i + widthRatio);
    if (columnsToCheck.every((height) => height === minHeight)) {
      columnIndex = i;
      break;
    }

    // Find the next set of columns where the item can fit.
    minHeight = Math.min(...columnsToCheck);
  }

  return columnIndex;
};

const findColumnForItem = (
  columnHeights: number[],
  widthRatio: number,
  maxItemsPerColumn: number
) => {
  console.log("SHift")
  // If the item spans only one column, find the shortest column.
  if (widthRatio === 1) {
    return columnHeights.indexOf(Math.min(...columnHeights));
  }

  // If the item spans multiple columns, find the first place it can fit.
  let minHeight = Math.min(...columnHeights);
  let columnIndex = columnHeights.indexOf(minHeight);

  for (let i = 0; i <= maxItemsPerColumn + widthRatio; i++) {
    // Check if the item can fit in the next 'widthRatio' columns.
    const columnsToCheck = columnHeights.slice(i, i + widthRatio);
    if (columnsToCheck.every((height) => height === minHeight)) {
      columnIndex = i;
      break;
    }

    // Find the next set of columns where the item can fit.
    minHeight = Math.min(...columnsToCheck);
  }

  return columnIndex;
};


