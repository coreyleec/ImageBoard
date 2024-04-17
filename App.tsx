/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler'
import React, { useState, useEffect, useCallback, useRef, createRef} from 'react';
import type {PropsWithChildren} from 'react';
import {Dimensions, ScrollView, StatusBar, StyleSheet, Text, Image, useColorScheme, View} from 'react-native';
import Header from './src/Containers/Header'
import Grid from './src/Containers/Grid'
import TestGrid from './src/Containers/TestGrid'
import { Colors, DebugInstructions, LearnMoreLinks, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';

import StaggeredList from '@mindinventory/react-native-stagger-view';
import EmptySquare from './src/assets/emptysquare.png';
const DEFAULT_IMAGE = Image.resolveAssetSource(EmptySquare).uri;
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
  GestureDetector
} from "react-native-gesture-handler";



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


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const sortPhotos = (a, b) => a.index - b.index;
// SWITCH DATABASE LOCAL/DEPLOYED
  // const [dbVersion, setDbVersion] = useState(`http://127.0.0.1:3000/api/v1`)
  const [dbVersion, setDbVersion] = useState(`https://image-board-backend.herokuapp.com/api/v1`)
// ANNOUNCE WHEN PROFILE IS CALLED
const [loaded, setLoaded] = useState(false)
// APP
const [siteHeader, setSiteHeader] = useState("ImageBoard")


  // LOGIN
const [currentUserId, setCurrentUserId] = useState< number | string>(0);
const [userId, setUserId] = useState(null);
// EDIT USER INFO
// const [userEmail, setUserEmail] = useState("");
const [about, setAbout] = useState({title:"", about:"", publish: false});
const [userName, setUserName] = useState("");
// LINKS //
const [userLinks, setUserLinks] = useState< ILink[]>([]);
// PHOTOS
const [photos, setPhotos] = useState<any | IPhoto>([]);
// FOLDERS //
// const [folderDescription, setFolderDetails] = useState();
const [folders, setFolders] = useState([]);
const [folderDetails, setFolderDetails] = useState<IDetails>()
// FAVORITES / SAVED PHOTOS <- later distinguish from liked
const [favorites, setFavorites] = useState(null)

// CURRENT DATA
const [collabs, setCollabs] = useState([]);
const [details, setDetails] = useState<any[] | [IDetails]>([])
const gridRef = useRef()

const setFolderPhotos = useCallback((folder, type) => {
  console.log('callback details', folder, type)
  setFolderArray(folder, type);
}, [folders, collabs, favorites]);

const setFolderArray = (object, type) => {
    console.log('setFolder details', object, type)
    let index = object.index
    // console.log('details', object, index, type, details, root)
    const setFunc = type?.charAt(0)?.toUpperCase() + type.slice(1, -1)
    const folder = eval(type).find(folder => folder.index === object.index)
    // // eval(`set${setFunc}Shown(${index})`)
    // // setShown(index)
    
    console.log("setFolder", folder, folder.creative, type, object)

    if(type !== 'favorites'){
      // SHOWN, TYPE, PRIVACY, COLLABORATORS
      if(type === 'folders'){
        eval(`set${setFunc}Privacy(${object.public})`)
        eval(`set${setFunc}Type(${object.creative})`)
      }
      
      setPhotos(folder.photos)
      setFolderDetails(object)
    }
    else {
      setFolderDetails(object)
      setPhotos(folder.favorite_photos)}
      // navigate(`/${root}/${type}/${object.index}`)
}

const mapDetails = (groups) => {
  if (!!groups){
    const detailArr = []
    console.log("details", detailArr)
  
    for (const i of Object.keys(groups)) {
      const key = Object.keys(groups[i]);
  
      if(key[0] === 'favorites'){  
        const detail = eval(`groups[i].${key}`).map((folder, i) => (`{"name": "${folder.name}", "id": ${folder.id}, "index": ${folder.index}}`))
        let jsonDetail = detail.map(d => JSON.parse(d))
        let jsonKey = eval(key as any)[0]
    
        let obj = {}
        obj[jsonKey] = [jsonDetail]

        detailArr.push(obj)
      
      }
      else if (key[0] !== 'favorites'){

        const detail = eval(`groups[i].${key}`).map((folder, i) => {
          let d = JSON.parse(`{"name": "${folder.name}", "id": ${folder.id}, "index": ${folder.index}, "creative": ${folder.creative}}`)
          d.collaborators = folder.collaborators
          return d
          })

        let obj = {}
        let jsonKey = eval(key as any)[0]
        obj[jsonKey] = [detail]
        // console.log("[jsonDetail]", detail, obj)
        detailArr.push(obj)
        // console.log("key", key[0], key[0] === 'favorites', detail)
      }

      
      
  
      
    }
    setDetails(detailArr)  
  }
}
  const landingFetch = () => {
    fetch(`${dbVersion}/landing_page`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
      })
      .then((res) => res.json())
      .then((user) => {
        const groups = user?.user?.all_groups
        console.log("user", user, groups, user.user.about)
        // console.log("folder photos", groups[0]?.folders[0].photos)
        setPhotos(groups[0]?.folders[0].photos)
        setAbout(user.user.about)
        setUserId(user.user.id)
        setSiteHeader(user.user.name);
        setUserLinks(user.user.links);
        setFolderArray(groups[0]?.folders[0], 'folders')
        mapDetails(groups)
        // setDemo(user.user.demo)
       
        // navigate('/by_Corey_Lee/folders/0')
        setLoaded(true)
      //  if(!!groups){ 
        for (const i of Object.keys(groups)) {
          const key = Object.keys(groups[i])[0];
          const value = Object.values(groups[i])[0]
          // const value = JSON.stringify(eval(`groups[i].${key}`))
          console.log(i, groups, key, value)
          
          
          const string = JSON.stringify(key).replace(/^"(.+)"$/,'$1')
          const setFunc = string.charAt(0).toUpperCase() + string.slice(1)
          console.log(`set${setFunc}(${value})`)
          eval(`set${setFunc}(${value})`)
          
        }
        
      // }
  
        
        
    })
  }
useEffect(() => {
  landingFetch()
}, [])


useEffect(() => {
  // console.log("photos", photos)
}, [photos])
const halfWidth = (696+200)/2
const halfHeight = (1060+200)/2

const [startXy, setStartXy] = useState([0,0])
const [posXy, setPosXy] = useState([0,50])
const [xY, setXY] = useState([0,0])

useEffect(() => {
  console.log("startXy", startXy)
}, [startXy])

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

      
const scrollRef = createRef();
// const { width } = Dimensions.get('window')

  return (

        <View
          style={{
            backgroundColor: 'black',
            width: '100%', height: '100%'
            // margin: 100,
            // Dimensions.get('screen').width
          }}

          >
          <Header 
          style={{position: 'relative', zIndex: 1}} siteHeader={siteHeader} />
          
          {/* <TestGrid style={{width: '100%', height: '100%'}}/> */}

          <Grid 
          style={{position: 'relative', zIndex: -1}}
          collabs={folderDetails?.collaborators?.filter((collaber) => collaber.name !== userName)}
          // hightlighted={hightlighted}
          // colorArr={colorArr}
          folderDetails={folderDetails}
              photos={photos}
              userId={userId}
              currentUserId={currentUserId}
          //     // updateFavorites={updateFavorites}
              dbVersion={dbVersion}
              />
              
    
        </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1, // the number of columns you want to devide the screen into
    // marginHorizontal: "auto",
    // width: "100%",
    backgroundColor: "red"
  },
  row: {
    flexDirection: "row"
  },
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
    backgroundColor: 'orange',
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

    width: 696,
    height: 1060, 
    // paddingHorizontal: 0,
    // alignSelf: 'stretch',
  },
});

export default App;




// return (

//   <View
//     style={{
//       backgroundColor: 'black',
//       width: '100%', height: '100%'
//       // margin: 100,
//       // Dimensions.get('screen').width
//     }}
//     onTouchStart={(e) => setXY([Math.ceil(e.nativeEvent.pageX), Math.ceil(e.nativeEvent.pageY)])}

//     onTouchMove={(e) => onScrollFunc(Math.ceil(e.nativeEvent.pageX), Math.ceil(e.nativeEvent.pageY))}

//     onTouchEnd={(e) => setXY([0, 0])}
//     >
//     <Header siteHeader={siteHeader} />
    
//     {/* <Grid 
//     // collabs={folderDetails?.collaborators?.filter((collaber) => collaber.name !== userName)}
//     //     // hightlighted={hightlighted}
//     //     // colorArr={colorArr}
//     //     folderDetails={folderDetails}
//     //     photos={photos}
//     //     userId={userId}
//     //     currentUserId={currentUserId}
//     //     // updateFavorites={updateFavorites}
//     //     dbVersion={dbVersion}
//         /> */}
        
//     <ScrollView 
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
//     <ScrollView
    
//     scrollEnabled={false}
//       directionalLockEnabled={false}
//       decelerationRate={18}
//       snapToInterval={1} 
//       horizontal
//       // contentContainerStyle={{ padding: 100
//       // }}
//     >
//     <StaggeredList
//       data={photos.sort(sortPhotos)}
//       style={styles.contentContainer}
//       showsVerticalScrollIndicator={false}
//       scrollEnabled={false}
//       numColumns={6}
//       renderItem={((photo, index) =>{
//         return (
//         <View 
//         style={{
//           justifyContent: 'center',
//           alignItems: 'center',
//           margin: 5,
//           backgroundColor: '#0001',
//         }}
        
//         >
//         {/* <Text>{photo.index}</Text> */}
//             <Image 
//             style={(photo.item.orientation) ? styles.landscape : styles.portrait}
//             orientation={photo.item.orientation}
//             photo={photo}
//             source={(!!photo.item.thumbnail_url)
//               ? {uri: photo.item.thumbnail_url}
//               : {uri: DEFAULT_IMAGE}} />   
//           </View>
// )
//     })}
//     />
// </ScrollView>
// </ScrollView>
//   </View>
// );