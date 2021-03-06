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
 *     2018/3/16.
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
  ActivityIndicator,
} from 'react-native';


export default class HomePageSwiperItem extends PureComponent{
  render() {
    const {image,onPress}=this.props;
    return(
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={styles.TouchView}
            >
            {
                this.props.image
                ?
                    <Image
                        source={{uri: image}}
                        style={styles.Images}
                        resizeMethod={'resize'}
                    />
                :
                    <ActivityIndicator/>
            }

        </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
    Images:{
        height:210,
        width:'100%'
    },
    TouchView:{
        height:210,
        width:'100%'
    }
});
