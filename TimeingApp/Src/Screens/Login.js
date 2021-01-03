import React, { Component } from 'react'
import { Alert, Text, View, TouchableHighlight, ImageBackground, StyleSheet, TextInput, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';

let url = 'http://site04.up2app.co.il/';
import { observer, inject } from 'mobx-react'
@inject("TimeingStore")
@observer
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'g@g.com',
      password: '1234',
      picker: 'סטודנט',
    }
  }

  txtchgEmail = (email) => this.setState({ email });
  txtchgPass = (password) => this.setState({ password });
  btnSignUp = () => this.props.navigation.navigate('Register');
  btnLogin = async () => {
    //consot
    if (this.state.picker === 'מנהל מלגה') {
      let s = await this.checkStudentDetilsForUser(this.state.email, this.state.password);
      if (s !== null) {
        this.props.TimeingStore.setUser(s)
        this.props.navigation.navigate('ManagementPage');
      }
      else
        Alert.alert('האימייל או הסיסמא שגויים');
    }
    else {
      let s = await this.checkStudentDetilsForStudnet(this.state.email, this.state.password);
      if (s !== null) {
        this.props.TimeingStore.setUser(s)
        console.log(this.props.TimeingStore.getUser,'this.props.TimeingStore.getUser')
        this.props.navigation.navigate('menu');
      }
      else
        Alert.alert('האימייל או הסיסמא שגויים');
    }
  }
  checkStudentDetilsForStudnet = async (email, password) => {
    if (email == '' || password == '') return null;
    let returnedObj = null;
    await fetch(url + `api/Students?email=${email}&password=${password}`,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
      })
      .then((resp) => resp.json())
      .then(function (data) {
        if (data != null) {
          returnedObj = data;
        }
        else {
          returnedObj = null;
        }
      })
      .catch(function (err) {
        alert(err);
      });
    return returnedObj;
  }
  checkStudentDetilsForUser = async (email, password) => {
    if (email == '' || password == '') return null;
    let returnedObj = null;
    await fetch(url + `api/Users?email=${email}&password=${password}`,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
      })
      .then((resp) => resp.json())
      .then(function (data) {
        if (data != null) {
          returnedObj = data;
        }
        else {
          returnedObj = null;
        }
      })
      .catch(function (err) {
        alert(err);
      });
    return returnedObj;
  }
  render() {
    const { picker, email, password } = this.state;
    return (
      <ImageBackground
        style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.SecondTopic}>כניסה</Text>

          <View style={{ padding: 20 }}>
            <DropDownPicker
              items={[
                { label: 'סטודנט', value: 'סטודנט', icon: () => <Icon name="flag" size={18} color="#900" />, hidden: true },
                { label: 'מנהל מלגה', value: 'מנהל מלגה', icon: () => <Icon name="flag" size={18} color="#900" /> },
              ]}
              defaultValue={picker}
              containerStyle={{ height: 50 }}
              style={{
                backgroundColor: '#fafafa',
                width: 270,
                position: 'relative',
              }}
              itemStyle={{
                justifyContent: 'flex-start',

              }}
              dropDownStyle={{ backgroundColor: '#fafafa' }}
              onChangeItem={item => this.setState({ picker: item.value })} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              placeholderTextColor="#000000"
              value={email}
              onChangeText={(text) => { this.txtchgEmail(text) }}
              placeholder='אימייל' />
            <Fontisto name="email" size={25} color="#900" />
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              placeholderTextColor="#000000"
              value={password}
              onChangeText={(text) => { this.txtchgPass(text) }}
              placeholder='סיסמא'
              secureTextEntry={true}
            />

          </View>
          <View>
            <TouchableHighlight
              style={[styles.MainButton, styles.loginButton]}
              onPress={this.btnLogin}>
              <Text style={styles.loginText}>היכנס</Text>
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight
              style={[styles.MainButton, styles.loginButton]}
              onPress={this.btnSignUp}>
              <Text style={styles.loginText}>הירשם</Text>
            </TouchableHighlight>
          </View>
          <View>
          </View>
        </View>
      </ImageBackground >
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
    alignItems: 'center',
    paddingRight: 20
  },
  inputs: {
    height: 45,
    marginRight: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Gill Sans',
    fontSize: 20
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
    fontSize: 30,
    flex: 1,
    textAlign: 'center'

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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    width: 250,
    borderRadius: 30,
  },
});