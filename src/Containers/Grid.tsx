/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Component, useState, useEffect, useCallback, useRef} from 'react';

import {Dimensions, StyleProp, ViewStyle, StyleSheet, Text, Image, useColorScheme, View, Animated, ScrollView} from 'react-native';



import StaggeredList from '@mindinventory/react-native-stagger-view';
import EmptySquare from '../assets/emptysquare.png';
const DEFAULT_IMAGE = Image.resolveAssetSource(EmptySquare).uri;


interface ICollaborator {
  uuid: string;
  name: string;
  color: undefined | string;
  prevState: undefined;
}
interface IPhoto {
  id: number;
  folder_id: number;
  u_id: string;
  url: string;
  thumbnail_url: string;
  name: string;
  creative: boolean;
  index: number;
  details: string;
  collaborators: [ICollaborator];
  color: undefined | string;
}

interface IProps {
    loggedIn: boolean;
    folderDetails: undefined | IDetails;
    photos:  [IPhoto] 
    setPhotos: React.Dispatch<React.SetStateAction< any[] | [IPhoto]>>;
    // openModal: boolean
    // setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    colorArr: [IColor];
    userId: string;
    userName: string;
    currentUserId: string | number;
    tutorial: boolean;
    demo: boolean;
    reorderedPhotos: any[] | [IPhoto];
    setReorderedPhotos: React.Dispatch<React.SetStateAction<any[] | [IPhoto]>>;
    updateFavorites: (photo: object) => void;
    removePhoto: (photo: object) => void;
    enableDelete: boolean;
    edit: boolean; 
    dbVersion: string;
    // root: string;
  }
interface IDetails {
  id: number;
  name: string;
  creative: boolean;
  index: number;
  collaborators: [ICollaborator];
}
interface IFolder {
  id: number;
  u_id: string;
  name: string;
  details: string;
  creative: boolean;
  index: number;
  photos: [IPhoto]
  collaborators: [ICollaborator];
  orientation: boolean;
}
interface ILink {
  name: string;
  url: string;
  id: number;
  index: number;
}


const Grid: React.FC<IProps> = (props) => {
  
  const sortPhotos = (a, b) => a.index - b.index;

// PHOTOS
    const [photos, setPhotos] = useState<any | IPhoto>([]);
// FOLDERS //


// const { width } = Dimensions.get('window')
const halfWidth = (696+200)/2
const halfHeight = (1060+200)/2
const [startXy, setStartXy] = useState([0,0])
const [posXy, setPosXy] = useState([0,50])
const [xY, setXY] = useState([0,0])

useEffect(() => {
  console.log("startXy", startXy)
}, [startXy])
console.log("photos", props.photos)

const onScrollFunc = (x, y) => {
  // PASS X, Y TOUCH COORDINATES 

// MEASURE EACH MOVEMENT FROM LAST POINT
  const xDiff = -(xY[0] - x) 
  const yDiff = -(xY[1] - y) 

  console.log(xY[0], "-", x, xY[1], "-", y)
  console.log("xDiff", xDiff, "yDiff", yDiff)

  // SET LAST POINT 
  setXY([x, y])

// ADJUST THE GRID COORDINATES X, Y
  setPosXy([(posXy[0] + (xDiff)), (posXy[1] + (yDiff))])

};

  return (

    <View
    style={{
        position: 'relative', 
      backgroundColor: 'black',
      width: '100%', height: '100%', zIndex: 1,
      // Dimensions.get('screen').width
    }}
        onTouchStart={(e) => setXY([Math.ceil(e.nativeEvent.pageX), Math.ceil(e.nativeEvent.pageY)])}

        onTouchMove={(e) => onScrollFunc(Math.ceil(e.nativeEvent.pageX), Math.ceil(e.nativeEvent.pageY))}

        onTouchEnd={(e) => setXY([0, 0])}
    >
    <ScrollView 
    
        scrollEnabled={false}
        translateX={posXy[0]} translateY={posXy[1]}
        style={{
        width: 900,
        position: 'absolute',
        zIndex: -1,
        padding: 100,
        // backgroundColor: 'gainsboro',
        // top: posXy[1],
        // left: posXy[0],
        }}
        >
    <ScrollView
    
        scrollEnabled={false}
          directionalLockEnabled={false}
          decelerationRate={18}
          snapToInterval={1} 
          horizontal
    //       // contentContainerStyle={{ padding: 100
    //       // }}
        >
       
    </ScrollView>
     <StaggeredList
      data={props.photos.sort(sortPhotos)}
      style={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      numColumns={6}
      renderItem={((photo, index) =>{
        return (
        <View 
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          margin: 5,
          backgroundColor: 'transparent',
        }}
        
        >
     {/* <Text>{photo.index}</Text> */}
             <Image 
            style={(photo.item.orientation) ? styles.landscape : styles.portrait}
            orientation={photo.item.orientation}
            photo={photo}
            source={(!!photo.item.thumbnail_url)
              ? {uri: photo.item.thumbnail_url}
              : {uri: DEFAULT_IMAGE}} />   
          </View>
    )
    })}
    />
    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  
  grid: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 600,
  },
  test: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  portrait: {
    // flex: 1,
    borderRadius: 13,
    overflow: 'hidden',
    resizeMode: 'cover',
    // margin: 3,
    backgroundColor: 'blue',
    height: 210,
    width: 110,
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
    height: 100,
    width: 110,
    // justifyContent: 'center',
    // alignItems: 'center',
    // margin: 5,
  },
  activityIndicatorWrapper: {
    width: 110,
    height: 100,

    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    // backgroundColor: 'gainsboro',
    position: 'relative',
    zIndex: -1,
    width: 696,
    height: 1060, 
    // paddingHorizontal: 0,
    // alignSelf: 'stretch',
  },
  wrapper: {
    flex: 1
  },
});

export default Grid;


// <ScrollView 
//     scrollEnabled={false}
//     translateX={posXy[0]} translateY={posXy[1]}
//     ref={scrollRef}
//     style={{
//       width: 900,
//       position: 'absolute',
//       zIndex: -1,
//       padding: 100,
//       // backgroundColor: 'gainsboro',
//       // top: posXy[1],
//       // left: posXy[0],
//     }}
//     >
//     {/* <ScrollView
    
//     scrollEnabled={false}
//       directionalLockEnabled={false}
//       decelerationRate={18}
//       snapToInterval={1} 
//       horizontal
//       // contentContainerStyle={{ padding: 100
//       // }}
//     > */}
   
// {/* </ScrollView> */}
// </ScrollView>