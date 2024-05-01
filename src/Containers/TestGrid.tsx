import React, { useEffect,useState } from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  ScrollView,
  View,
} from 'react-native';
import { IPhotos } from "../../App";


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

  const TestGrid: React.FC<IProps> = (props) => {
const { height, width } = Dimensions.get('window');
// const width = (696)
// const height = (1060+200)
const COLUMN_WIDTH = width / 3;
// const COLUMN_WIDTH = 110;
const IMAGE_SPACING = COLUMN_WIDTH * 0.01;
const BLOCK_WIDTH = COLUMN_WIDTH - (IMAGE_SPACING / 2); // W1

// dimensionConstants
const W3 = 'W3'; // wide
const W1 = 'W1'; // square
const H3 = 'H3'; // 3w lengthwise & 2w
const H2 = 'H2'; // 2w lenghtwise & 2w
const photos = props.photos.filter((photo) => photo.thumbnail_url !== null).map((thumbnail_url, id) => ({ id, thumbnail_url }));
console.log("images", photos)

const images = [
  'https://i.pinimg.com/originals/0e/9e/88/0e9e8812f01f82650833264673bf51ed.jpg',
  'https://wallpaperaccess.com/full/7281.jpg',
  'https://images-na.ssl-images-amazon.com/images/I/71Tq9OsjO7L._SY879_.jpg',
  'https://free4kwallpapers.com/uploads/originals/2019/07/14/ultra-hd-ocean-s-wallpaper.jpg',
  'https://cdn.wallpapersafari.com/24/3/ZlgUc6.jpg',
  'https://www.dayglo.com/media/1212/bokeh-3249883_1280.png',
  'https://wallpaperplay.com/walls/full/b/5/e/159585.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/e/e0/Long_March_2D_launching_VRSS-1.jpg',
  'https://cosmos-production-assets.s3.amazonaws.com/file/spina/photo/6597/180716_fluorescent_P.jpg',
  'https://c.gitcoin.co/grants/4e0e1e6de351af46fe9482b35840d3bd/logo.png',
  'https://images-na.ssl-images-amazon.com/images/I/81wajOO6mLL._SX355_.jpg',
  'https://www.melbourneairport.com.au/getattachment/Passengers/Parking/long-term-car-park/new-banner-homepage_02.png',
  'https://images.unsplash.com/photo-1490907452017-eccf91f84cf9',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSoI7Yah5HYzaOn2tnpdBGdXgLL5Ka3ElFjYJPM7zZ91_WHw0TO',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ5UU83l1w0Zd1aZpb2Huo9B0YVzKPbKsCPvL4ZqaZVxXJQYrLi',
].map((url, id) => ({ id, url }));



const processImages = async images => {
  const processedImages = [...images];
  for (const i in images) {
    const image = processedImages[i];

    const whRatioScreen = width / height;
    // 
    const w3Threshold = whRatioScreen * 6;
    const h2Threshold = whRatioScreen * 2;
    const h3Threshold = whRatioScreen;



    await Image.getSize(image.url, (wd, ht) => {
      const whRatio = wd / ht;

      let dimension = 'W1';
      if (whRatio > w3Threshold) dimension = 'W3';
      else if (whRatio < h3Threshold) dimension = 'H3';
      else if (whRatio < h2Threshold) dimension = 'H2';

      processedImages[i] = { ...image, width: wd, height: ht, dimension };
    });
  }
  return processedImages;
}

const renderItem = ({ url }, ht, wd, imageSpacing = 0) => (
  <Image
    source={{ uri: url }}
    style={{ width: wd, height: ht, marginBottom: imageSpacing }}
    resizeMode="cover"
  />
);


  const [rows, setRows] = useState([]);

  const layoutBricks = (images) => {
    const { w1Array, blocksArray } = images.reduce((acc, cur) => {
      const out = { ...acc };
      if (cur.dimension === W1) out.w1Array = [...out.w1Array, cur];
      else out.blocksArray = [...out.blocksArray, cur];
      return out;
    }, { w1Array: [], blocksArray: [] });

    const blockRows = blocksArray.map(image => {
      if (image.dimension === W3) {
        const widthReductionFactor = width / image.width;
        const ht = image.height * widthReductionFactor;
        return renderItem(image, ht, width);
      }

      const maybeInterchange = Math.random() > 0.5;

      if (image.dimension === H2) {
        if (w1Array.length >= 2) {
          const w1Element1 = w1Array.pop();
          const w1Element2 = w1Array.pop();
          
          const elements = [
            renderItem(image, BLOCK_WIDTH * 2 + IMAGE_SPACING, BLOCK_WIDTH * 2, IMAGE_SPACING),
            <View style={{ flexDirection: 'column' }}>
              {renderItem(w1Element1, BLOCK_WIDTH, BLOCK_WIDTH, IMAGE_SPACING)}
              {renderItem(w1Element2, BLOCK_WIDTH, BLOCK_WIDTH, IMAGE_SPACING)}
            </View>
          ];

          if (maybeInterchange) elements.reverse();

          return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {elements}
            </View>
          );
        } else {
          w1Array.push({ ...image, width: BLOCK_WIDTH, height: BLOCK_WIDTH });
        }
      }

      if (image.dimension === H3) {
        if (w1Array.length >= 3) {
          const w1Element1 = w1Array.pop();
          const w1Element2 = w1Array.pop();
          const w1Element3 = w1Array.pop();

          const elements = [
            renderItem(image, BLOCK_WIDTH * 3 + (IMAGE_SPACING * 2), BLOCK_WIDTH * 2, IMAGE_SPACING),
            <View style={{ flexDirection: 'column' }}>
              {renderItem(w1Element1, BLOCK_WIDTH, BLOCK_WIDTH, IMAGE_SPACING)}
              {renderItem(w1Element2, BLOCK_WIDTH, BLOCK_WIDTH, IMAGE_SPACING)}
              {renderItem(w1Element3, BLOCK_WIDTH, BLOCK_WIDTH, IMAGE_SPACING)}
            </View>
          ];

          if (maybeInterchange) elements.reverse();

          return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {elements}
            </View>
          );
        } else {
          w1Array.push({ ...image, width: BLOCK_WIDTH, height: BLOCK_WIDTH });
        }
      }
    });

    const w1Rows = (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {w1Array.map(image => renderItem(image, BLOCK_WIDTH, BLOCK_WIDTH, IMAGE_SPACING))}
      </View>
    )
    
    setRows([...rows, ...blockRows, w1Rows]);
  }

  const layout = async () => {
    const processedImages = await processImages(images);
    layoutBricks(processedImages);
  }

  useEffect(() => { layout() }, []);

  return (
    <>
      <StatusBar hidden />
      <ScrollView
        style={{ flex: 1 }}
        removeClippedSubviews
      >
        {rows}
      </ScrollView>
    </>
  );
}

export default TestGrid;