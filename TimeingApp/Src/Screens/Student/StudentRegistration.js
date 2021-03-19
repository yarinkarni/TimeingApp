import React, { Component } from 'react'
import { ScrollView, Image, TextInput, View, Text, StyleSheet, TouchableHighlight, ImageBackground, KeyboardAvoidingView } from 'react-native';
import InputOutline from 'react-native-input-outline';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
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
      RegistartionData: '',
    };
  }
  push = () => {
    PushNotification.configure({
      onRegister: (Token) => {
        this.setState({ Token: Token });
        console.log(Token, 'Token')
      },
      onNotification: function (notification) {
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    PushNotification.popInitialNotification((NOTIFICATION) => {

    });
    PushNotification.createChannel(
      {
        channelId: "channel-id", // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.getChannels(function (channel_ids) {
      console.log(channel_ids, 'channel_ids'); // ['channel_id_1']
    });
    //PushNotification.getDeliveredNotifications(callback);
  }
  // testPush = () => {

  //   PushNotification.localNotification({
  //     title: "My Notification Title", // (optional)
  //     message: "My Notification Message", // (required)
  //   });
  // }
  // testSchedule = () => {
  //   PushNotification.localNotificationSchedule({
  //     message: "My Notification Massege",
  //     data: new Date(Date.now() + 15 * 1000)
  //   });
  // }
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
    const { FirstName, LastName, Email, Password, Telephone, BirthDate, Sex, Address, City, Token } = this.state
    const { navigation } = this.props
    if (FirstName, LastName, Email, Password, Telephone, BirthDate, Sex, Address, City !== '') {
      let s = await this.AddStudent(FirstName, LastName, Email, Password, Telephone, BirthDate, Sex, Address, City, Token.token);
      if (s === null)
        alert("Register Faild");
      else
        navigation.navigate('Login', { user: s });
    }
    else
      alert('לא מילאת את כל השדות')
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
  componentDidMount = async () => {
    const getCurrentDate = () => {
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      return date + '-' + month + '-' + year;
    }
    var CurrentDate = getCurrentDate();
    this.setState({ RegistartionData: CurrentDate })
    this.push()
    this.testPush()
  }
  btnAddUser = async () => {
    const { FirstName, LastName, Email, Password, RegistartionData, Telephone } = this.state
    let s;
    if (FirstName && LastName && Email && Password && RegistartionData && Telephone !== '') {
      s = await this.AddUser(FirstName, LastName, Email, Password, RegistartionData, Telephone);
      if (s === null)
        alert("Register Faild");
      else
        this.props.navigation.navigate('Login', { user: s });
    }
    else
      alert('לא מילאת את כל השדות')
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
    const { TimeingStore } = this.props
    const { FirstName, LastName, Email, Password, Telephone, BirthDate, Sex, Address, City, Token } = this.state
    return (
      TimeingStore.picker == 'סטודנט' ?
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <ImageBackground source={require('../../images/blur.jpg')} style={styles.container} >
            {/* <KeyboardAvoidingView behavior="padding" > */}
            <View >
              <Text style={styles.Topic}>הרשמה</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                value={FirstName}
                onChangeText={(text) => { this.txtchgFirstName(text) }}
                placeholder="שם פרטי "
                placeholderTextColor="#8D8F8D">
              </TextInput>
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                value={LastName}
                onChangeText={(text) => { this.txtchgLastName(text) }}
                placeholder="שם משפחה "
                placeholderTextColor="#8D8F8D">
              </TextInput>
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                value={Email}
                onChangeText={(text) => { this.txtchgEmail(text) }}
                placeholder="דואר אלקטרוני "
                placeholderTextColor="#8D8F8D">
              </TextInput>
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                value={Password}
                onChangeText={(text) => { this.txtchgPassword(text) }}
                placeholder="סיסמא "
                secureTextEntry={true}
                placeholderTextColor="#8D8F8D">
              </TextInput>
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                value={Telephone}
                onChangeText={(text) => { this.txtchgTelephone(text) }}
                placeholder="טלפון "
                placeholderTextColor="#8D8F8D">
              </TextInput>
            </View>
            <View style={styles.inputContainer}>
              <DatePicker
                style={styles.pick}
                date={BirthDate}
                mode="date"
                androidMode='spinner'
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
                  dateInput: {
                    borderWidth: 0
                  }
                }}
                onDateChange={(BirthDate) => { this.setState({ BirthDate }) }}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                value={Sex}
                onChangeText={(text) => { this.txtchgSex(text) }}
                placeholder="מין "
                placeholderTextColor="#8D8F8D">
              </TextInput>
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                value={Address}
                onChangeText={(text) => { this.txtchgAddress(text) }}
                placeholder="כתובת  "
                placeholderTextColor="#8D8F8D">
              </TextInput>
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                value={City}
                onChangeText={(text) => { this.txtchgCity(text) }}
                placeholder="עיר מגורים "
                placeholderTextColor="#8D8F8D">
              </TextInput>
            </View>
            {/* </KeyboardAvoidingView> */}
            <TouchableHighlight
              style={[styles.buttonContainer, styles.loginButton]}
              onPress={this.btnAddStudent}>
              <Text style={styles.loginText}>הירשם</Text>
            </TouchableHighlight>
            {/* </KeyboardAvoidingView> */}
          </ImageBackground>
        </ScrollView>

        :
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
        >
          <ImageBackground source={require('../../images/blur.jpg')} style={styles.container} >
            <View >
              <Text style={styles.Topic}>הרשמה</Text>
            </View>
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
              secureTextEntry={true}
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
    //flex: 1,
    height: '120%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: '70%',
    height: 45,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    textAlign: 'right',
    height: 45,
    width: '100%',
    //marginRight: 16,
    paddingHorizontal: 20,
    borderBottomColor: '#8D8F8D',
    // flex: 1,
    fontWeight: 'bold',
  },
  buttonContainer: {
    top: '3%',
    height: 45,
    //flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '40%',
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "black",
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  scrollContentContainer: {
    alignItems: "center",
    paddingBottom: 60,
    //paddingTop: 20,
    width: '100%',
    // height: '500%',
    justifyContent: 'center',
    alignItems: 'center'

  },
  Topic: {
    textAlign: 'center',
    margin: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -3, height: 3 },
    textShadowRadius: 20
  },
  img: {
    margin: 20,
    marginTop: 50,
    width: 190,
    height: 120
  },
  pick: {
    width: '100%',
    borderColor: 'white',
    paddingHorizontal: 20,
  }
});