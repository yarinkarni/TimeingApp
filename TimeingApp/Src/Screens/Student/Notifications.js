import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class ViewUpdates extends Component {
  render() {
    return (
      <View style={s.container}>
        <FontAwesome
          name="user-plus"
          size={50}
          style={s.fab}
          onPress={() => this.props.navigation.navigate('menu')}
        />
      </View>
    )
  }
}
const s = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    opacity: 0.7,
    height: "100%",
    width: "100%"
  },
  stdBtn: {
    height: 50,
    width: 150,
    backgroundColor: '#00BFFF',
    //  'gray',
    borderRadius: 20,
    alignItems: 'center',
    margin: 20,
    justifyContent: 'center',
  },
  stdTxt: {
    fontSize: 20,
    fontFamily: 'Arial',
    color: 'white'
  },
  Time: {
    width: '70%',
    paddingTop: 40,
    justifyContent: 'space-around'
  },
  Vtxt: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  picker: {
    backgroundColor: '#fafafa',
    width: 250,
    height: 100,
    position: 'relative'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})