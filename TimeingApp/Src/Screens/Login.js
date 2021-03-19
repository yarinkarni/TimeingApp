import React, { Component } from 'react'
import { Alert, View, TouchableHighlight, ImageBackground, StyleSheet, TextInput, Image, InteractionManager, Keyboard } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-community/async-storage';
import { create } from 'mobx-persist';
import TimeingStore from '../Stores/TimeingStore';
import { observer, inject } from 'mobx-react'
import { Api } from '../Components/api';
import { Container, Header, Content, Button, Text, Form, Item, Input, Label, Icon } from 'native-base';

import PasswordInputText from 'react-native-hide-show-password-input';
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from 'react-native-material-textfield';

const hydrate = create({
  storage: AsyncStorage,
});
//הפונקציה מתרחשת בעליה הראשונה לאפליקציה 
//בעליה לאפקליקציה הפונקציה לוקחת את המידע שנשמר לוקאלית על המכשיר ושומרת בחנות 
//בכדי שהמשתמש לא יצטרך להיכנס שוב ועוד נתונים שאצטרך ממנו
//מספיק פרמטר אחד בכדי להביא את כל החנות
const GetHydrate = async () => {
  await hydrate('userData', TimeingStore).then(() =>
    console.log('Get data from store'),
  );
}

@inject("TimeingStore")
@observer
export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      picker: '',
    }
  }
  componentDidMount = async () => {

    //קורא לפונקציה
    await GetHydrate()
    InteractionManager.runAfterInteractions(() => {
      const { TimeingStore } = this.props
      if (TimeingStore.getUser) {
        this.setState({ email: TimeingStore.getUser.Email, password: TimeingStore.getUser.Password, picker: TimeingStore.getPicker })
        this.btnLogin()
      }
    })

  }
  txtchgEmail = (email) => this.setState({ email });
  txtchgPass = (password) => this.setState({ password });
  btnSignUp = () => this.props.navigation.navigate('StudentRegistration');
  btnLogin = async () => {
    const { email, password, picker } = this.state;
    const { TimeingStore, navigation } = this.props;
    if (picker === 'מנהל מלגה') {
      let s = await this.checkStudentDetilsForUser(email, password, 'Users');
      if (s !== null) {
        TimeingStore.setUser(s)
        navigation.navigate('ManagementPage');
      }
      else
        Alert.alert('האימייל או הסיסמא שגויים');
    }
    else {
      let s = await this.checkStudentDetilsForUser(email, password, 'Students');
      if (s !== null) {
        TimeingStore.setUser(s)
        navigation.navigate('Menu');
      }
      else
        Alert.alert('האימייל או הסיסמא שגויים');
    }
  }
  checkStudentDetilsForUser = async (email, password, Pick) => {
    if (email == '' || password == '') return null;
    const res = await Api(`api/${Pick}?email=${email}&password=${password}`, "GET")
    return res;
  }
  render() {
    const { picker, email, password } = this.state;
    return (
      <ImageBackground source={require('../images/blur.jpg')} style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.SecondTopic}>כניסה</Text>
          <View style={styles.picker}>
            <DropDownPicker
              items={[
                { label: 'סטודנט', value: 'סטודנט', icon: () => <Icon name="flag" size={18} color="#900" />, hidden: true },
                { label: 'מנהל מלגה', value: 'מנהל מלגה', icon: () => <Icon name="flag" size={18} color="#900" /> },
              ]}
              defaultValue={picker}
              containerStyle={{ height: 30 }}
              style={{
                backgroundColor: '',
                width: 200,
                //position: 'relative',
              }}
              itemStyle={{
                justifyContent: 'flex-start',
              }}
              dropDownStyle={{ backgroundColor: '' }}
              onChangeItem={item => {
                this.props.TimeingStore.setPicker(item.value)
                this.setState({ picker: item.value })
              }}
              placeholder="בחר איזה משתמש אתה "
            />
          </View>{picker ?
            <View>
              <View style={styles.inputContainer}>
                {/* <Item floatingLabel style={{ textAlign: 'right', flexDirection: 'row-reverse' }}>
                  <Icon active name='mail'/>
                  <Label style={{ float: 'right', position: 'absolute', right: 0 }}>Email
                  </Label>
                  <Input style={{ textAlign: 'right' }} />
                </Item> */}

                <TextInput style={styles.inputs}
                  placeholderTextColor="#000000"
                  value={email}
                  onChangeText={(text) => { this.txtchgEmail(text) }}
                  placeholder='אימייל' />
                <Fontisto name="email" size={25} color="#900" />
              </View>
              <View style={styles.inputContainer}>
                <PasswordInputText
                  iconColor='black'
                  getRef={input => this.input = input}
                  value={password}
                  onChangeText={(password) => this.setState({ password })}
                />
              </View>
              <View >
                <Button rounded style={[styles.MainButton]}
                  onPress={this.btnLogin}>

                  <Text style={styles.loginText}>היכנס</Text>
                </Button>
              </View>
              <View>
                <Button rounded style={[styles.MainButton]}
                  onPress={this.btnSignUp}>
                  <Text style={styles.loginText}>הירשם</Text>
                </Button>
              </View>
            </View>
            :
            <Text></Text>}
        </View>
      </ImageBackground >
    )
  }
}
const styles = StyleSheet.create({
  picker: {
    //padding: 20,
    height: '30%',
    //width:'5%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#B0A59E',
    height: "100%",
    width: "100%"
  },
  inputContainer: {
    //backgroundColor: '#FFFFFF',
    //borderRadius: 30,
    marginBottom: 10,
    //flexDirection: 'row',
    //alignItems: 'center',
    //paddingRight: 20,
    width: 250,
    height: 70,
    color: 'black',
    paddingHorizontal: 10,

  },
  inputs: {
    height: 45,
    //marginRight: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    textAlign: 'right',
    //fontFamily: 'rubik-regular',
    fontSize: 15
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
    fontSize: 20,
    //flex: 1,

  },
  inner: {
    width: '90%',
    //height: '90%',
    //backgroundColor: 'rgba(92, 91, 91,0.3)',
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
    fontSize: 40,
    paddingBottom: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -3, height: 3 },
    textShadowRadius: 20
  },
  MainButton: {
    // borderWidth: 2,
    // height: 50,
    // //flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginBottom: 30,
    // width: 250,
    // //borderRadius: 30,

    borderRadius: 30,
    marginBottom: 10,
    width: '40%',
    alignSelf: 'center',
    backgroundColor: '#396F47',
    elevation: 4,
    justifyContent: 'center'
  },
});