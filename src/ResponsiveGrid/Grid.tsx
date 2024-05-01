/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// PROJECT ROADMAP
// ISOLATE GRID MAP FUNCTION AND SAVE POSITIONS 
// THEN MAKE A UNIQUE FUNC THAT IS USED TO SET POSITIONS AND FOR SCROLLING
// THEN A THURD FUNC THAT ENLARGES AND SHIFTS


import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, Image, ScrollView, Text, useWindowDimensions, Animated  } from 'react-native';
import type { ResponsiveGridProps, TileItem } from './types';
import { calcResponsiveGrid } from './calc-responsive-grid';
import { adjustGridFunc } from './adjust-grid-func';
import { scrollListener } from './scroll-listener';
// import
// import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
// import useThrottle from '../hooks/use-throttle';
// import { renderPropComponent } from '../libs/render-prop-component';
const styles = StyleSheet.create({
  leftSide: (item)=>({left: item.left,}),
  rightSide: (item)=>({right: item.right,}),
  shift: (item)=>({right: item.right,}),
  photo: (item)=>({
    position: 'absolute',
    top: item.top,
    width: item.width,
    height: item.height,
  }),

})





export const Grid: React.FC<ResponsiveGridProps> = ({
  data = [],
  maxItemsPerColumn = 3,
  virtualizedBufferFactor = 5,
  x = 0,
  y = 0,
  centerX,
  centerY,
  setPhotos,
  setCentered,
  centered,
  renderItem,
  scrollEventInterval = 100, // milliseconds
  virtualization = true,
  showScrollIndicator = true,
  style = {},
  itemContainerStyle = {},
  itemUnitHeight,
  onEndReached,
  onEndReachedThreshold = 0.5, // default to 50% of the container height
  keyExtractor = (_, index) => String(index), // default to item index if no keyExtractor is provided
  HeaderComponent = null,
  FooterComponent = null,
}) => {
  const [visibleItems, setVisibleItems] = useState<TileItem[]>([]);

  // const {height, width} = useWindowDimensions();
  const { height, width } = Dimensions.get('screen');
  
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
// console.log("x", x, "y", y)
  const onEndReachedCalled = useRef<boolean>(false);

  const scrollYPosition = useRef<number>(0);
  const scrollXPosition = useRef<number>(0);
  // const bumperWidth = useRef<number>(0);
  const bumperWidth = 300;

  const [xYPos, setXYPos] = useState([x, y]);
  const [gridItems, setGridItems] = useState(["x"]);
  const [shiftItems, setShiftItems] = useState([]);
  const [gridViewHeight, setGridViewHeight] = useState([x, y]);

// LATER SET MIN/MAX WIDTH BASED ON SCREEN
const containerWidth = (maxItemsPerColumn * 110)
  // console.log("containerWidth", containerWidth)

useMemo(async () =>{
      const {items, gridHeight } = await adjustGridFunc(
        data,
        maxItemsPerColumn,
        containerWidth,
        itemUnitHeight,
        bumperWidth,
      )
      setGridItems(items)
      setGridViewHeight(gridHeight)
    },
    [data, maxItemsPerColumn, containerSize]
  );
  
useEffect(() => {
  // console.log("SCROLL USEEFFECT", 
          // maxItemsPerColumn,itemUnitHeight, containerWidth, bumperWidth, x, y, centered)
  const {items, shiftPhotos} = scrollListener(
          gridItems,
          shiftItems,
          maxItemsPerColumn,
          itemUnitHeight,
          containerWidth,
          bumperWidth,
          x,
          y,
          centered
        )
        // console.log("items", items)
        
        setShiftItems(shiftPhotos)
        setGridItems(items)
      }, [centered])
      const renderedItems = virtualization ? visibleItems : gridItems;
      
      // console.log("GRID shiftPhotos", shiftItems)

  
  const updateVisibleItems = () => {
    if (!virtualization) return;

    // Buffer to add outside visible range
    const buffer = containerSize.height * virtualizedBufferFactor;

    // Define the range of items that are visible based on scroll position
    const visibleStart = Math.max(0, scrollYPosition.current - buffer);
    const visibleEnd = scrollYPosition.current + containerSize.height + buffer;

    const vItems = gridItems.filter((item: TileItem) => {
      const itemBottom = item.top + item.height;
      const itemTop = item.top;

      return itemBottom > visibleStart && itemTop < visibleEnd;
    });

    setVisibleItems(vItems);
    return vItems;
  };

  

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = y;
    const currentScrollX = x;
    scrollYPosition.current = currentScrollY;
    scrollXPosition.current = currentScrollX;

    // Calculate the position to check against the threshold
    
    const scrollViewHeight = containerSize.height;
    const threshold = onEndReachedThreshold * scrollViewHeight;

    // Check if we've reached the threshold for calling onEndReached
    if (
      !onEndReachedCalled.current &&
      currentScrollY + scrollViewHeight + threshold >= gridViewHeight
    ) {
      onEndReachedCalled.current = true; // Marked as called to prevent subsequent calls
      onEndReached?.(); // call the onEndReached function if it exists
    }

    // Reset the flag when scrolled away from the bottom
    if (currentScrollY + scrollViewHeight + threshold * 2 < gridViewHeight) {
      onEndReachedCalled.current = false;
    }

    // Update visible items for virtualization
    if (virtualization) {
      throttledUpdateVisibleItems();
    }
  };

  useEffect(() => {
    if (virtualization) {
      updateVisibleItems();
    }

    // Reset onEndReachedCalled to false when data changes, allowing onEndReached to be called again
    onEndReachedCalled.current = false;
  }, [gridItems, containerSize, virtualization]);

  const inRange = (pos, center, value, item) => {
    // half height or width of item
    const centerVal = item.centered ? 3 : 5
    const rangeVal = value/centerVal
    if(pos <= (center+(rangeVal)) && pos >= (center-(rangeVal))) return pos <= (center+(rangeVal)) && pos >= (center-(rangeVal))
  }


  useEffect(() => {
    
    gridItems.map((item) => {

      const xPos = (item.colNum>2) ? (item.xOffset + (item.width/2) + (x)) : (item.xOffset + (item.width/2) + (x))
      
      const yPos = item.top + (item.height/2)+ (y)

      const isCenter = inRange(xPos, centerX, item.width, item) && 
      inRange(yPos, centerY, item.height, item)
      const itemIndex = gridItems.indexOf(item)
      if (isCenter){
        item.centered = true;
          setCentered(itemIndex)
          console.log("INDEX", item)
          // return item
      }
      else if (centered === itemIndex && !isCenter){
        console.log("INDEX", centered, itemIndex, !isCenter)

        item.centered = false
        setCentered('x')
      }
      // else {
      //   item.centered = false
      //   // return item
      // }
      
    })
      // if (centered !== item.index){
      // }

  }, [x, y])


  // useEffect(() => {
  //   setPhotos(gridItems)
    
  // }, [gridItems])

//  console.log("style index", height, width)
 const headerVal = 100
 return (
  <View
  // translateY={100}
  // translateX={width/-3} 
    style={[{ flexGrow: 1,
      overflow: 'visible', width: 660 }, ]}
    onLayout={(event) => {
      
      const { width, height } = event.nativeEvent.layout;
      // console.log("style layout", width)
      setContainerSize({ width, height });
    }}
  >
    <View style={{position: 'absolute', top: height/5, left: width/2, backgroundColor: 'yellow', zIndex: 9}}><Text>O</Text></View>
    {/* <View style={{position: 'absolute', top: (height/5 - (y)), left: (width/2 - (x)), backgroundColor: 'yellow', zIndex: 9}}><Text>O</Text></View> */}
    
    <ScrollView
    
      // onScroll={onScroll}
      scrollEventThrottle={1}
      contentContainerStyle={{
        height: gridViewHeight || '100%',
        width: containerSize.width,
      }}
      showsVerticalScrollIndicator={showScrollIndicator}
    >
     

      <View
      // translateX={width/-3} 
        style={{
          flex: 1,
        }}
      >
        {renderedItems.map((item, index) => (
          
          <View
          translateX={x} translateY={y}
          // isCenter={centered === index}
          // inRange((item.left + (item.width/2)), centerX, item.width, item) && 
          // inRange((item.top + (item.height/2)), centerY, item.height, item)
            key={keyExtractor(item, index)}
            // {}
            style={[
              item.colNum>2 ? styles.leftSide(item) : styles.rightSide(item),
                styles.photo(item)
              ,
              itemContainerStyle,
            ]}
          >
            {renderItem({ item, index })}
          </View>
        ))}
      </View>

      

    </ScrollView>
  </View>
);
};
