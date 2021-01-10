import React, { Component } from 'react'
import { Alert, Text, View, TouchableHighlight, ImageBackground, StyleSheet, TextInput, Image, InteractionManager } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-community/async-storage';
import { create } from 'mobx-persist';
import TimeingStore from '../Stores/TimeingStore';
import { observer, inject } from 'mobx-react'
import { Api } from '../Components/api';



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
  btnSignUp = () => this.props.navigation.navigate('Register');
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
        navigation.navigate('menu');
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
      <ImageBackground style={styles.container}>
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
              onChangeItem={item => {
                this.props.TimeingStore.setPicker(item.value)
                this.setState({ picker: item.value })
              }} />
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