import React from 'react';
import {NativeModules, Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';

const styles = StyleSheet.create({
    container: {
        height: 100,
        overflow: 'visible',
        flexDirection: 'row',
        justifyContent: 'flex-end',  
        // justifyContent: 'space-between',  
        backgroundColor: 'transparent',
        // borderTopColor: 'orange', //'#FBFAFA',
        // borderTopWidth: 10,
        // shadowColor: '#099FD7',
        // shadowOffset: {
        // width: 0,
        // height: -10 
        // },
        // shadowRadius: 10,
        // shadowOpacity: 100
        // boxShadow: 'rgb(0, 0, 0) 0px 0px 55px 55px',
        position: 'fixed',
        zIndex: 99,
        // display: 'flex',
    },
    siteHeader: {
        fontSize: 50,
        fontFamily: 'HelveticaNeue-Light',
        textAlign: 'right',
        float: 'right',
        // lineHeight: .75,
        // width: 'fit-content',
        fontWeight: 'normal',
        // cursor: 'default',
        paddingRight: 5,
        // paddingTop: 2%, 
        // color: 'black'
        color: 'white',
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
      },
});

interface IProps {
    siteHeader: string;
    
  
  }

  const Header: React.FC<IProps> = (props) => {
    // const isDarkMode = useColorScheme() === 'dark';
  
    // const backgroundStyle = {
    //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    // };
  
    const onMenuButtonClick = () => {
        NativeModules.DevMenu.show();
       }

    return (
   <View style={styles.container}>
    <LinearGradient colors={['black', 'transparent']} 
    // start={{x: 0, y: 0}} end={{x: 0, y: 1}}
    style={styles.linearGradient}>
    {/* <Button
    title="Dev Menu"
    onPress={() => onMenuButtonClick()}
    /> */}
    <Text style={styles.siteHeader}>{props.siteHeader}</Text>
    </LinearGradient>
   </View>
    );
  }

  export default Header;