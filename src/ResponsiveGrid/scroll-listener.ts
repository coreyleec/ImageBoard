import type { GridItem, TileItem } from './types';

export const scrollListener = (
  data: TileItem[],
  shiftItems: number[],
  maxItemsPerColumn: number,
  itemUnitHeight?: number,
  containerWidth: number,
  bumperWidth: number,
  x: number,
  y: number,
  centered: number,
): {
  items: GridItem[];
} => {
  console.log("SCROLL", centered)
  const items: GridItem[] = [];
  const itemSizeUnit = 110; // Determine TileSize based on container width and max number of columns
  
  let columnHeights: number[] = new Array(maxItemsPerColumn).fill(0); // Track the height of each column end.
  const missingItems = (arr, n) => {
    let missingItems = [];
    for (let i = 0; i < n; i++) if (!arr.includes(i)) missingItems.push(i);
    return missingItems;
  }
const shiftPhotos = []
// IF ITEMS WITHIN GROW PARAMS ARE PORTRAIT
// SHIFT UP OR DOWN
const itemShifter = (centeredPhoto) => {
  data.map((item, i) => {
    

  if (item.id !== centeredPhoto.id){
  const itemIndex = data.indexOf(item)
    // SHIFT DOWN
    if(item.colNum === centeredPhoto.colNum && item.rowNum > centeredPhoto.rowNum){
      const shiftDown = 100
      // const shiftDown = (centeredPhoto.heightRatio*100)
      shiftPhotos.push(itemIndex)
      data.splice(itemIndex, 1, {
        ...item,
        top: item.top + shiftDown,
        // colNum: item.colNum - 1,
      })
    } //  IF IN ROW RANGE
   else if ((item.rowNum >= centeredPhoto.rowNum) && (item.rowNum <= (centeredPhoto.rowNum + centeredPhoto.heightRatio))){
    // SHIFT RIGHT
      if ((centeredPhoto.colNum >= 3) && (item.colNum >= centeredPhoto.colNum)){
          shiftPhotos.push(itemIndex)

          data.splice(itemIndex, 1, {
            ...item,
            left: item.left + 110,
            // colNum: item.colNum - 1,
          })
        }  // SHIFT LEFT
      else if ((centeredPhoto.colNum <= 2) && (item.colNum <= centeredPhoto.colNum)){
        shiftPhotos.push(itemIndex)
        data.splice(itemIndex, 1, {
          ...item,
          right: item.right + 110,
          // colNum: item.colNum - 1,
        })
      }
     } //  IF RIGHT SIDE FOR UP
     else if ((centeredPhoto.colNum < 3)){
      if ((item.rowNum === centeredPhoto.rowNum-1) && (item.colNum === centeredPhoto.colNum-1) && !item.orientation){
        // SHIFT UP
        shiftPhotos.push(itemIndex)
        const shiftUp = 100
        data.splice(itemIndex, 1, {
          ...item,
          top: item.top - shiftUp,
          // colNum: item.colNum - 1,
        })
      }
    } // ON LEFT SIDE FOR UP
    else {
      if ((item.rowNum === centeredPhoto.rowNum-1) && (item.colNum === centeredPhoto.colNum+1) && !item.orientation){
        // SHIFT UP
        shiftPhotos.push(itemIndex)
        const shiftUp = 100
        data.splice(itemIndex, 1, {
          ...item,
          top: item.top - shiftUp,
          // colNum: item.colNum - 1,
        })
      }
    }
    }
  })
}
const itemSizer = (item) => {
    // console.log("sizer", item)
  const xGrow = item?.centered ? 1 : 0
  const yGrow = item?.centered ? 1 : 0
  const widthRatio = (item?.widthRatio || 1) + xGrow;
  const heightRatio = (item?.heightRatio || 1) + yGrow;

  let itemWidth = widthRatio * itemSizeUnit;

  let itemHeight = itemUnitHeight * heightRatio
  const itemIndex = data.indexOf(item)
  data.splice(itemIndex, 1, {
    ...item,
    width: itemWidth,
    height: itemHeight,
    colNum: item.colNum,
  })

    for (let i = item.colNum; i < item.colNum + widthRatio; i++) {
      columnHeights[i] = item.top + itemHeight; // Update to use itemHeight
    }
    // itemShifter(item)
  return {data}
  
}

const itemUnshifter = (enlargedPhoto) =>{
  data.map((item) => {
    const top = item.rowNum * 100;
    const left = (item.colNum * itemSizeUnit)-itemSizeUnit/2 
    const right = (containerWidth - (left + 110)) 
    const itemIndex = data.indexOf(item)

    if (item.colNum>2 && (item.top !== top || item.left !== left)){

      data.splice(itemIndex, 1, {
        ...item,
        top: top,
        left: left,
      })
    }
    else if (item.colNum<3 && (item.top !== top || item.right !== right)){
      data.splice(itemIndex, 1, {
        ...item,
        top: top,
        right: right,
      })
    }
      
  })

   


  
  

}
const enlargedPhotos = data.filter((item) => item.width > 110)
// IF ENLARGED PHOTOS INCLUDES THE LAST AND CURRENT PHOTO 

if (!!enlargedPhotos.length){

    const enlargedPhoto = enlargedPhotos[0]
    
    if (typeof centered !== "number"){
      itemSizer(enlargedPhoto)
      itemUnshifter(enlargedPhoto)
  }
}
else {
  if (typeof centered === "number"){
    // console.log("centered number", centered)
     const centeredPhoto = data[centered]
     itemSizer(centeredPhoto)
     itemShifter(centeredPhoto)
  }
}
// const rowPhotos = photos.filter((photo) => photo.rowNum === rowNum)
// const centerPhoto = data.find((item) => centered === item.index)
// const itemIndex = data.indexOf(centeredPhoto)
// const copiedArray = [...data]

// console.log("shiftPhotos", shiftPhotos)
items.push(...data)
  return {
    items, shiftPhotos
  };
};

const findColumnForItem = (
  columnHeights: number[],
  widthRatio: number,
  maxItemsPerColumn: number,
  colNum: number,
  index: number,
) => {
  // if (columnIndex>2)
  // else if (columnIndex<3)
    // 
  // console.log("FIND COLUMN", colNum, index)
  // console.log("colNum", colNum, "index", index)
  // console.log("columnHeights", columnHeights)
  // If the item spans only one column, find the shortest column.
  // if (widthRatio === 1) {
  //   return columnHeights.indexOf(Math.min(...columnHeights));
  // }

  // If the item spans multiple columns, find the first place it can fit.
  // items.map((item) => item.xPosition > centered.xPosition && item.yPos >= centered.yPos && item.yPos > (centered.yPos + centered.height) ).forEach(photo.position = prevItem.left+prevItem.)
  
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


const shiftColumnOfItems = (
  index: number, 
  columnHeights: number[],
  widthRatio: number,
  maxItemsPerColumn: number
) => {
  // FIND ITEMS ON ROW
  // FIND ITEMS ON ROWS BELOW
  // SHIFT ITEMS 55 IN EITHER DIRECTION


// PHOTO = PHOTOS.FINDBY(PHOTO => PHOTO.INDEX === CENTERED)
    // const photo = data.find((photo) => photo.index === centered)
    // const rowNum = photo.rowNum
    // const colNum = photo.colNum
    // const rowPhotos = photos.filter((photo) => photo.rowNum === rowNum)
    // const leftSide = colNum % 3 
    // const shiftPhotos = rowPhotos.filter((photo) => photo.rowNum === )
    // const shiftPhotos = rowPhotos.filter((photo) => leftSide ? (photo.colNum < photo.colNum) : (photo.colNum > photo.colNum))
    // shiftPhotos.map((photo) => {
      // let "left" = photo."left"
      // photo."left" = (left - 110)})
    // setShiftIndexs(shiftPhotos.map((photo) => photo.index))
    // PHOTO.WIDTHRATIO = PHOTO.WIDTHRATIO + 1
    // PHOTO.HEIGHTRATIO = PHOTO.HEIGHTRATIO + 1
    // columnHeights/columnIndex => PHOTOS
    // TRANSLATE LEFT - 110 || RIGHT + 110



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