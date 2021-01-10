import React, { Component } from 'react'
import { ScrollView, Image, TextInput, View, Text, StyleSheet, TouchableHighlight, ImageBackground } from 'react-native';
import DatePicker from 'react-native-datepicker';
import PushNotification from "react-native-push-notification";
import { Api } from '../../Components/api';
import { observer, inject } from 'mobx-react'
@inject("TimeingStore")
@observer
export default class StudentRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FirstName: '',
      LastName: '',
      Email: '',
      Password: '',
      Telephone: '',
      BirthDate: '02/12/1993',
      Sex: '',
      Address: '',
      City: '',
      Token: '',
      date: "2016-05-15",
    };
  }
  push = () => {
    PushNotification.configure({
      onRegister: (Token) => {
        this.setState({ Token: Token });
      },
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }
  componentDidMount = async () => {
    this.push
  }
  txtchgFirstName = (FirstName) => this.setState({ FirstName });
  txtchgLastName = (LastName) => this.setState({ LastName });
  txtchgEmail = (Email) => this.setState({ Email });
  txtchgPassword = (Password) => this.setState({ Password });
  txtchgTelephone = (Telephone) => this.setState({ Telephone });
  txtchgBirthDate = (BirthDate) => this.setState({ BirthDate });
  txtchgSex = (Sex) => this.setState({ Sex });
  txtchgAddress = (Address) => this.setState({ Address });
  txtchgCity = (City) => this.setState({ City });

  btnAddStudent = async () => {
    let s = await this.AddStudent(this.state.FirstName, this.state.LastName, this.state.Email, this.state.Password,
      this.state.Telephone, this.state.BirthDate, this.state.Sex, this.state.Address, this.state.City, this.state.Token.token);
    if (s === null)
      alert("Register Faild");
    else
      this.props.navigation.navigate('Login', { user: s });
  }
  AddStudent = async (FirstName, LastName, Email, Password, Telephone, BirthDate, Sex, Address, City, Token) => {
    let obj2Send = {
      "StudentID": 0,
      "FirstName": FirstName,
      "LastName": LastName,
      "Email": Email,
      "Password": Password,
      "Telephone": Telephone,
      "BirthDate": BirthDate,
      "Sex": Sex,
      "Address": Address,
      "City": City,
      "Token": Token
    }
    const { TimeingStore } = this.props
    const res = await Api("addStudent", "POST", obj2Send)
    return res;
  }
  render() {
    const { FirstName, LastName, Email, Password, Telephone, BirthDate, Sex, Address, City, Token } = this.state
    return (
      <ImageBackground style={styles.container} >
        <View >
          <Image style={{ margin: 20, marginTop: 50, width: 190, height: 120 }} />
          <Text style={styles.Topic}>הרשמה</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              value={FirstName}
              onChangeText={(text) => { this.txtchgFirstName(text) }}
              placeholder="שם פרטי "
              placeholderTextColor="#000000">
            </TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              value={LastName}
              onChangeText={(text) => { this.txtchgLastName(text) }}
              placeholder="שם משפחה "
              placeholderTextColor="#000000">
            </TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              value={Email}
              onChangeText={(text) => { this.txtchgEmail(text) }}
              placeholder="דואר אלקטרוני "
              placeholderTextColor="#000000">
            </TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              value={Password}
              onChangeText={(text) => { this.txtchgPassword(text) }}
              placeholder="סיסמא "
              placeholderTextColor="#000000">
            </TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              value={Telephone}
              onChangeText={(text) => { this.txtchgTelephone(text) }}
              placeholder="טלפון "
              placeholderTextColor="#000000">
            </TextInput>
          </View>
          <View style={styles.inputContainer}>
            <DatePicker
              style={{ width: 200 }}
              date={BirthDate}
              mode="date"
              placeholder="select date"
              format="DD/MM/YYYY"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: { marginLeft: 36 }
              }}
              onDateChange={(BirthDate) => { this.setState({ BirthDate }) }}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              value={Sex}
              onChangeText={(text) => { this.txtchgSex(text) }}
              placeholder="מין "
              placeholderTextColor="#000000">
            </TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              value={Address}
              onChangeText={(text) => { this.txtchgAddress(text) }}
              placeholder="כתובת : "
              placeholderTextColor="#000000">
            </TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              value={City}
              onChangeText={(text) => { this.txtchgCity(text) }}
              placeholder="עיר מגורים "
              placeholderTextColor="#000000">
            </TextInput>
          </View>

        </ScrollView>

        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={this.btnAddStudent}>
          <Text style={styles.loginText}>הירשם</Text>
        </TouchableHighlight>
      </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: "center",
    paddingBottom: 60
  },
  Topic: {
    textAlign: 'center',
    margin: 20,
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold'
  }
});