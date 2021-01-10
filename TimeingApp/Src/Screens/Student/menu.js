import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
export default class menu extends Component {
  render() {
    return (
      //תפריט מעבר לסטודנט בין כל האפשרויות שלו
      <View style={styles.container}>
        <Text style={styles.txt}> תפריט </Text>
        <Icon name="vcard-o" size={100} color="#900" style={{ flex: 1.5, marginTop: 30 }} />
        <TouchableOpacity
          style={[styles.MainButton, styles.loginButton]}
          onPress={() => this.props.navigation.navigate('Report')}>
          <Text
            style={styles.loginText}
          >
            דווח על שעות</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.MainButton, styles.loginButton]}
          onPress={() => this.props.navigation.navigate('MassagesStudent')}>
          <Text
            style={styles.loginText}
          >
            עידכונים</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.MainButton, styles.loginButton]}
          onPress={() => this.props.navigation.navigate('WatchingHours')}>
          <Text
            style={styles.loginText}
          >
            דוח שעות</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.MainButton, styles.loginButton]}
          onPress={() => this.props.navigation.navigate('ScholarshipList')}>
          <Text
            style={styles.loginText}
          >
            מלגות</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    opacity: 0.7,
    height: "100%",
    width: "100%"
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    marginBottom: 20,
    flexDirection: 'row',
  },
  inputs: {
    height: 45,
    marginRight: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    textAlign: 'right'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 120,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25
  },
  inner: {
    width: '70%',
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: "center",
    justifyContent: "center"
  },
  Topic: {
    paddingBottom: 50,
    fontWeight: 'bold',
    fontSize: 30,
    color: '#66FFFF'
  },
  MyButtons: {
    flexDirection: 'row',

  },
  SecondTopic: {
    fontSize: 50,
    paddingBottom: 30,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  MainButton: {
    flex: 1,
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 20,

  },
  txt: {
    flex: 1,
    fontSize: 80,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 50
  }
});