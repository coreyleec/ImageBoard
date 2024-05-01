// import * as React from 'react';
import React, { createRef, useRef, useEffect,useState } from 'react';
import { Dimensions, StyleSheet, View, Image, ScrollView, Text, Animated } from 'react-native';
// import { ResponsiveGrid } from 'react-native-flexible-grid';
import {Grid} from '../ResponsiveGrid/Grid';
// import BottomNav from '../components/insta-bottom-nav';
import EmptySquare from '../assets/emptysquare.png';
const DEFAULT_IMAGE = Image.resolveAssetSource(EmptySquare).uri;


export default function TestGridTwo(props) {
  interface IPhoto {
    widthRatio?: number;
    heightRatio?: number;
    id: number;
    folder_id: number;
    u_id: string;
    url: string;
    thumbnail_url: string;
    name: string;
    creative: boolean;
    index: number;
    details: string;
    // collaborators: [ICollaborator];
    color: undefined | string;
  }
  const [centered, setCentered] = useState(0)
  const [photos, setPhotos] = useState()

  const sortPhotos = (a, b) => a.index - b.index;

  const { height, width } = Dimensions.get('screen');

useEffect(() => {
    const clonedPhotos = [...props.photos]
    clonedPhotos.map((photo) =>{
      
      photo.centered = false
       if (photo.orientation){
            photo.widthRatio = 1
            photo.heightRatio = 1
        }
        else {
            photo.widthRatio = 1
            photo.heightRatio = 2
        }
    })
    setPhotos(clonedPhotos)
    // console.log(clonedPhotos)
}, [props.photos])


  const [posXy, setPosXy] = useState([0,50])
  const [xY, setXY] = useState([0,0])
  
const onScrollFunc = (x, y) => {
    // PASS X, Y TOUCH COORDINATES 
  
  // MEASURE EACH MOVEMENT FROM LAST POINT
    const xDiff = -(xY[0] - x) 
    const yDiff = -(xY[1] - y) 

    // SET LAST POINT 
    setXY([x, y])
  
  // ADJUST THE GRID COORDINATES X, Y
    setPosXy([(posXy[0] + (xDiff)), (posXy[1] + (yDiff))])
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  
  
  return (
    <View
    scrollEnabled={false}
    translateY={-100}
    style={{
        position: 'relative', 
      backgroundColor: 'black',
      width: '100%', height: '100%', zIndex: 1,
    }}
        onTouchStart={(e) => setXY([Math.ceil(e.nativeEvent.pageX), Math.ceil(e.nativeEvent.pageY)])}

        onTouchMove={(e) => onScrollFunc(Math.ceil(e.nativeEvent.pageX), Math.ceil(e.nativeEvent.pageY))}

        onTouchEnd={() => setXY([0, 0])}
    >
      <View style={{position: 'absolute', top: height/5, left: width/2, backgroundColor: 'red', zIndex: 9}}><Text>O</Text></View>

        <ScrollView 
        
        scrollEnabled={false}
        style={{
        width: width,
        overflow: 'hidden',
        position: 'absolute',
        zIndex: -1,
        overflow: 'hidden',
        // paddingInline: 100,
        // backgroundColor: 'gainsboro',
        // top: posXy[1],
        // left: posXy[0],
        }}
        >
          <Grid
           style={{
            width: width,
          overflow: 'visible'}}
          centered={centered}
          setCentered={setCentered}
          setPhotos={setPhotos}
          scrollEnabled={false}
            maxItemsPerColumn={6}
            itemUnitHeight={100}
            x={posXy[0]}
            y={posXy[1]}
            centerX={width/2}
            centerY={height/5}
            data={photos?.sort(sortPhotos)}
            showScrollIndicator={false}
        //  (photo.rowNum*6) + (photo.colNum)
            keyExtractor={(photo: IPhoto) => (photo.index).toString()}
            renderItem={((photo, index) =>{
              // console.log(photo)
                return (
                <View 
                // ref={gridRef}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 5,
                  backgroundColor: 'transparent',
                }}
                
                >
             {/* <Text>{photo.index}</Text> */}
                     <Animated.Image 
                    //  <Image 
                    style={(photo.item.orientation) ? styles.landscape : styles.portrait}
                    orientation={photo.item.orientation}
                    photo={photo}
                    source={(!!photo.item.thumbnail_url)
                      ? {uri: photo.item.thumbnail_url}
                      : {uri: DEFAULT_IMAGE}} 
                      
                      />   
                  </View>
            )
            })}/>
   
</ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
    portrait: {
        // flex: 1,
        borderRadius: 13,
        overflow: 'hidden',
        resizeMode: 'cover',
        // margin: 3,
        backgroundColor: 'blue',
        width: '100%',
        height: '100%',
        // justifyContent: 'center',
        // alignItems: 'center',
        // margin: 5,
      },
      landscape: {
        borderRadius: 13,
        overflow: 'hidden',
        // flex: 1,
        resizeMode: 'cover',
        // margin: 3,
        backgroundColor: 'orange',
        width: '100%',
        height: '100%',
        // justifyContent: 'center',
        // alignItems: 'center',
        // margin: 5,
      },
  boxContainer: {
    flex: 1,
    margin: 1,
  },
  image: {
    width: 100,
    height: 100,
  },
  box: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    color: 'white',
    fontSize: 10,
    position: 'absolute',
    bottom: 10,
  },
});