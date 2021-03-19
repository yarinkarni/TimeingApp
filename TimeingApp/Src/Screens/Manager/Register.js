import React, { Component } from 'react'
import { ScrollView, Image, View, Text, StyleSheet, TouchableHighlight, ImageBackground } from 'react-native'
import InputOutline from 'react-native-input-outline';
import { Api } from '../../Components/api';


export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FirstName: '',
      LastName: '',
      Email: '',
      Password: '',
      RegistartionData: '',
      Telephone: ''
    };
  }
  txtchgFirstName = (FirstName) => this.setState({ FirstName });
  txtchgLastName = (LastName) => this.setState({ LastName });
  txtchgEmail = (Email) => this.setState({ Email });
  txtchgPassword = (Password) => this.setState({ Password });
  txtchgTelephone = (Telephone) => this.setState({ Telephone });
  componentDidMount = async () => {
    const getCurrentDate = () => {
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      return date + '-' + month + '-' + year;
    }
    var CurrentDate = getCurrentDate();
    this.setState({ RegistartionData: CurrentDate })
  }
  btnAddUser = async () => {
    let s = await this.AddUser(this.state.FirstName, this.state.LastName, this.state.Email, this.state.Password,
      this.state.RegistartionData, this.state.Telephone);
    if (s === null)
      alert("Register Faild");
    else
      this.props.navigation.navigate('Login', { user: s });
  }
  AddUser = async (FirstName, LastName, Email, Password, RegistartionData, Telephone) => {
    let obj2Send = {
      "UserID": 0,
      "FirstName": FirstName,
      "LastName": LastName,
      "Email": Email,
      "Password": Password,
      "RegistartionData": RegistartionData,
      "Telephone": Telephone
    }
    const res = await Api("addUser", "POST", obj2Send)
    return res;
  }
  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
      >
        <ImageBackground style={styles.container} >
          <View >
            <Text style={styles.Topic}>הרשמה</Text>
          </View>
          <ScrollView
            contentContainerStyle={styles.scrollContentContainer}
          >
            <InputOutline
              style={styles.inputContainer}
              placeholder="שם פרטי"
              focusedColor='blue'
              defaultColor='grey'
              value={this.state.firstName}
              onChangeText={(text) => { this.txtchgFirstName(text) }}
            />
            <InputOutline
              style={styles.inputContainer}
              placeholder="שם משפחה"
              focusedColor='blue'
              defaultColor='grey'
              value={this.state.lastName}
              onChangeText={(text) => { this.txtchgLastName(text) }}
            />
            <InputOutline
              style={styles.inputContainer}
              placeholder="אימייל"
              focusedColor='blue'
              defaultColor='grey'
              value={this.state.email}
              onChangeText={(text) => { this.txtchgEmail(text) }}
            />
            <InputOutline
              style={styles.inputContainer}
              placeholder="סיסמא"
              focusedColor='blue'
              defaultColor='grey'
              value={this.state.password}
              onChangeText={(text) => { this.txtchgPassword(text) }}
            />
            <InputOutline
              style={styles.inputContainer}
              placeholder="טלפון"
              value={this.state.telephone}
              onChangeText={(text) => { this.txtchgTelephone(text) }}
            />
          </ScrollView>
          <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this.btnAddUser}>
            <Text style={styles.loginText}>הירשם</Text>
          </TouchableHighlight>
        </ImageBackground>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',

  },
  inputContainer: {
    width: 250,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    color: 'black'
  },
  inputs: {
    height: 45,
    marginRight: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    fontWeight: 'bold'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#0000FF",
  },
  loginText: {
    color: '#FFFFFF',
  },
  scrollContentContainer: {
    width: '100%',
    alignItems: "center",
    paddingBottom: 60,
  },
  Topic: {
    textAlign: 'center',
    margin: 20,
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold'
  }
});