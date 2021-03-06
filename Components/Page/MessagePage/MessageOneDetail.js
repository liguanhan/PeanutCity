/**
 * Sample
 * React
 * Native
 * App
 * https://github.com/facebook/react-native
 * @flow
 * Created
 *     by
 *     Administrator
 *     on
 *     2018/3/20.
 */

import React, { Component,PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  InteractionManager,
  TouchableOpacity,
  Image,
} from 'react-native';


export default class MessageOneDetail extends PureComponent{
  render() {
    return (
      <View
          style={styles.View}>
          <Image
              source={require('../../../Icons/Sad.png')}
              style={styles.SadImage}
          />
          <Text style={styles.SadText}>亲,现在还没有消息哦</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    View:{
        marginTop:40,
        flex:1,
        backgroundColor:'ghostwhite',
        justifyContent:'center',
        alignItems:'center'
    },
    SadImage:{
        width:100,
        height:100
    }
});
