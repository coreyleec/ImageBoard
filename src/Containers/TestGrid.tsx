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

const Col = ({ numRows, children }) => {
    return  (
      <View style={styles[`${numRows}col`]}>{children}</View>
    )
  }
  
  const Row = ({ children }) => (
    <View style={styles.row}>{children}</View>
  )

const TestGrid: React.FC<IProps> = (props) => {
  


    return (
        <View style={styles.app}>
          <Row>
            <Col numRows={2}>
              <Text>First column</Text>
            </Col>
            <Col numRows={2}>
              <Text>Second column</Text>
            </Col>
          </Row>
          <Row>
            <Col numRows={1}>
              <Text>First column</Text>
            </Col>
            <Col numRows={3}>
              <Text>Second Column</Text>
            </Col>
          </Row>
          <Row>
            <Col numRows={2}>
              <Text>First column</Text>
            </Col>
            <Col numRows={2}>
              <Text>Second column</Text>
            </Col>
          </Row>
          <Row>
            <Col numRows={1}>
              <Text>First column</Text>
            </Col>
            <Col numRows={3}>
              <Text>Second Column</Text>
            </Col>
          </Row>
          <Row>
            <Col numRows={2}>
              <Text>First column</Text>
            </Col>
            <Col numRows={2}>
              <Text>Second column</Text>
            </Col>
            <Col numRows={3}>
              <Text>Second Column</Text>
            </Col>
          </Row>
          <Row>
            <Col numRows={1}>
              <Text>First column</Text>
            </Col>
          </Row>
        </View>);
}

const styles = StyleSheet.create({
  app: {
    flex: 4, // the number of columns you want to devide the screen into
    marginHorizontal: "auto",
    width: 400,
    backgroundColor: "red"
  },
  row: {
    flexDirection: "row"
  },
  "1col":  {
    backgroundColor:  "lightblue",
    borderColor:  "#fff",
    borderWidth:  1,
    flex:  1
  },
  "2col":  {
    backgroundColor:  "green",
    borderColor:  "#fff",
    borderWidth:  1,
    flex:  2
  },
  "3col":  {
    backgroundColor:  "orange",
    borderColor:  "#fff",
    borderWidth:  1,
    flex:  3
  },
  "4col":  {
    flex:  4
  }
});

export default TestGrid;


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