import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, InteractionManager, ActivityIndicator, TouchableHighlight, Alert, Image, ImageBackground } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Container, Header, Content, Textarea, Form, Card, CardItem, Body, List, ListItem, Left, Thumbnail, Right, Button, Text, Icon } from "native-base";
import { Api } from '../../Components/api'
import { observer, inject } from 'mobx-react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { color } from 'react-native-reanimated';
//אייקונים
const getTabBarIcon = (props) => {
  const { route } = props
  if (route.key === 'first') {
    return <View style={{
      height: 35,
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <Ionicons
        name="hourglass-outline"
        size={25}
      /><Text style={{
        fontSize: 13,
        color: "black"
      }}> שעות</Text>
    </View>
  } else if (route.key === 'second') {
    return <View style={{
      height: 35,
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <MaterialCommunityIcons
        name="account-details"
        size={25}
      /><Text style={{
        fontSize: 13,
        color: "black"
      }}>נתונים</Text>
    </View>
  }
  else if (route.key === 'three') {
    return <View style={{
      height: 35,
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <MaterialCommunityIcons
        name="account-multiple-check-outline"
        size={25}
      /><Text style={{
        fontSize: 13,
        color: "black"
      }}>סטודנטים</Text>
    </View>
  }
  else if (route.key === 'four') {
    return <View style={{
      height: 35,
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <MaterialCommunityIcons
        name="android-messages"
        size={25}
      /><Text style={{
        fontSize: 13,
        color: "black"
      }}>הודעות</Text>
    </View>
  }
}
const initialLayout = { width: Dimensions.get('window').width };

@inject("TimeingStore")
@observer
export default class ConfirmationOfHours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getStudentByScholarshipIDFalse: null,
      getStudentByScholarshipIDTrueOrFalse: null,
      getStudentHours: null,
      update: null,
      index: 0,
      Student: '',
      details: '',
      routes: [{ key: 'first', title: 'אישורי שעות' },
      { key: 'second', title: 'צפייה בנתוני סטודנט' },
      { key: 'three', title: 'אישורי סטודנטים למלגה' },
      { key: 'four', title: 'שלח הודעה' },
      ],
      isModalVisible: false,
      isModalVisible2: false,
      title: '',
      content: '',
      newTokensOfStudents: [],
      item: '',
      isChange: false
    }
  }
  componentDidMount = async () => {
    this.FetchingData()
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextState.isChange || nextState.getStudentHours != this.state.getStudentHours) {
      this.setState({ isChange: false })
    }
    return true

  }
  FetchingData = async () => {
    const { TimeingStore } = this.props;
    let getStudentByScholarshipIDTrueOrFalse = []
    InteractionManager.runAfterInteractions(async () => {
      try {
        getStudentByScholarshipIDTrueOrFalse = await Api("GetStudentByScholarshipID/" + TimeingStore.getScholarshipDetails.ScholarshipID, "GET")
        console.log(getStudentByScholarshipIDTrueOrFalse, 'getStudentByScholarshipIDTrueOrFalse')
      } catch (error) {
        console.log("GetStudentByScholarshipID -- ERROR - ", error)
      }
      this.setState({
        getStudentByScholarshipIDTrueOrFalse,
        isChange: true
      })
    })
    let getStudentHours = []
    try {
      getStudentHours = await Api("GetStudentToAprroval/" + TimeingStore.getScholarshipDetails.ScholarshipID
        , "GET")
    } catch (error) {
      console.log("GetStudentToAprroval -- ERROR - ", error)
    }
    this.setState({
      getStudentHours,
      isChange: true
    })
  }
  //פונקציה שמציגה את נתוני הסטודנט
  btnShowStudentDetails = (student) => {
    const { isModalVisible } = this.state;
    return (
      < View style={styles.container} >
        <Text>שם פרטי : {student.FirstName}</Text>
        <Text>שם משפחה : {student.LastName}</Text>
        <Text>אימייל : {student.Email}</Text>
        <Text>מין : {student.Sex}</Text>
        <Text>טלפון : {student.Telephone}</Text>
        <Text>עיר : {student.City}</Text>
        <Text>כתובת : {student.Address}</Text>
        <Text>תאריך יום הולדת : {student.BirthDate}</Text>
      </View >
    )
  }
  //
  toggleModal = (index) => {
    this.setState({ isModalVisible: !this.state.isModalVisible, index });
  };
  toggleModal2 = (index) => {
    this.setState({ isModalVisible2: !this.state.isModalVisible2, index });
  };
  btnApprovalOfScholarships = () => {
    return this.state.getStudentByScholarshipIDTrueOrFalse.map((item, index) => {
      return (
        <ListItem thumbnail key={index} >
          <Body style={{ alignItems: 'center' }}>
            <Text>{item.FirstName + ' ' + item.LastName}</Text>
          </Body>
          <Right>
            <Button transparent>
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={30}
                // style={styles.fab}
                onPress={() => {
                  this.btnShowStudentDetails(item), this.toggleModal(),
                    this.setState({ Student: item })
                }}
              />
            </Button>
          </Right>
        </ListItem>
      )
    }
    )
  }
  ApprovalOfReports = () => {
    const { getStudentHours } = this.state
    console.log(getStudentHours, 'getStudentHours')
    return getStudentHours && getStudentHours.map((item, index) => {
      return (
        <ListItem thumbnail key={index}>
          <Left>
            <Button transparent>
              <Ionicons
                name="information-circle-outline"
                size={30}
                onPress={() => {
                  this.setState({ details: item }), this.toggleModal2()
                }} />
            </Button>

          </Left>
          <Body style={{ alignItems: 'center', justifyContent: 'center', height: 79 }}>
            <Text>{item.FirstName + ' ' + item.LastName + '    ' + item.StartTime.substring(8, 10) + '-' + item.StartTime.substring(5, 7) + '-' + item.StartTime.substring(0, 4)}</Text>

          </Body>
          <Right>
            <FontAwesome5 name='trash' size={25}
              onPress={() => {
                Alert.alert(
                  'בטוח שאתה רוצה למחוק את השעות ?', '',
                  [{ text: '', onPress: () => console.log('Ask me later pressed') },
                  {
                    text: 'לא',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'כן',
                    onPress: () => this.btnDeleteReport(item)

                  },], { cancelable: false });
              }}
            />
          </Right>
          <Right>
            < Button transparent >
              <MaterialCommunityIcons
                name="clock-check-outline"
                size={30}
                onPress={() => {
                  Alert.alert(
                    'בטוח שאתה רוצה לאשר את השעות ?', '',
                    [{ text: '', onPress: () => console.log('Ask me later pressed') },
                    {
                      text: 'לא',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'כן',
                      onPress: () => {
                        const temp = this.btnApprovalOfReports(item)
                      }
                    },], { cancelable: false });
                }} />
            </Button>
          </Right>
        </ListItem>
      )
    })
  }
  btnDeleteRequests = async (request) => {
    const { TimeingStore } = this.props
    try {
      InteractionManager.runAfterInteractions(async () => {
        let obj2Send = {
          "ScholarshipID": TimeingStore.getScholarshipDetails.ScholarshipID,
          "StudentID": request.StudentID,
          "Date": request.Date,
          "Approval": request.Approval,
          "RequestsDelete": true
        }
        console.log('Are you sure', obj2Send)
        console.log('Are you sure2', request)

        const update = await Api("updateRequests", "PUT", obj2Send)
        if (update) {
          console.log('yes', update)
          await this.FetchingData()
        }
        else
          console.log('no', update)
      })
    } catch (error) {
      console.log("updateRequests -- ERROR - ", error)
    }
  }
  btnDeleteReport = async (item) => {
    const { TimeingStore } = this.props
    try {
      InteractionManager.runAfterInteractions(async () => {
        let obj2Send = {
          "StudentID": item.StudentID,
          "ScholarshipID": TimeingStore.getScholarshipDetails.ScholarshipID,
          "StartTime": item.StartTime,
          "StartLat": item.StartLat,
          "StartLng": item.StartLng,
          "EndLat": item.EndLat,
          "EndLng": item.EndLng,
          "EndTime": item.EndTime,
          "Approval": item.Approval,
          "ReportDelete": true
        }
        const update = await Api("updateReport", "PUT", obj2Send)
        if (update) {
          console.log('yes', update)
          await this.FetchingData()
        }
        else
          console.log('no', update)
      })
    } catch (error) {
      console.log("updateReports -- ERROR - ", error)
    }
  }
  btnApprovalOfReports = async (item) => {
    const { TimeingStore } = this.props
    try {
      InteractionManager.runAfterInteractions(async () => {
        let obj2Send = {
          "StudentID": item.StudentID,
          "ScholarshipID": TimeingStore.getScholarshipDetails.ScholarshipID,
          "StartTime": item.StartTime,
          "StartLat": item.StartLat,
          "StartLng": item.StartLng,
          "EndLat": item.EndLat,
          "EndLng": item.EndLng,
          "EndTime": item.EndTime,
          "Approval": true,
          "ReportDelete": item.ReportDelete
        }
        const update = await Api("updateReport", "PUT", obj2Send)
        if (update) {
          console.log('yes', update)
          await this.FetchingData()
        }
        else
          console.log('no', update)
      })
    } catch (error) {
      console.log("updateReports -- ERROR - ", error)
    }
  }
  deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }
  //Math.sqrt -- מחזיר את השורש הריבועי
  getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    d = d.toFixed(2);
    return d;
  }
  btnApprovelStudent = async (Student) => {
    const { TimeingStore } = this.props
    try {
      InteractionManager.runAfterInteractions(async () => {
        let obj2Send = {
          "StudentID": Student.StudentID,
          "ScholarshipID": TimeingStore.getScholarshipDetails.ScholarshipID,
          "Date": Student.Date,
          "Approval": true,
          "RequestsDelete": Student.RequestsDelete
        }
        console.log('obj2Send22222222222222222', obj2Send)
        const update = await Api("updateRequests", "PUT", obj2Send)
        console.log('update', update)
        if (update) {
          console.log('yes', update)
          await this.FetchingData()
        }
        else
          console.log('no', update)
      })
    } catch (error) {
      console.log("updateRequests -- ERROR - ", error)
    }
  }
  studentsToAprroval = () => {
    return this.state.getStudentByScholarshipIDTrueOrFalse.map((item, index) => {
      if (item.Approval != true) {
        console.log(item, 'item.RequestsDelete')
        return (
          <ListItem thumbnail key={index}>
            <Body style={{ alignItems: 'center' }}>
              <Text>{item.FirstName + ' ' + item.LastName}</Text>
            </Body>
            <Right>
              <FontAwesome5 name='trash' size={30}
                onPress={() => {
                  Alert.alert(
                    'בטוח שאתה רוצה למחוק את הסטודנט ?', '',
                    [{ text: '', onPress: () => console.log('Ask me later pressed') },
                    {
                      text: 'לא',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'כן',
                      onPress: () => this.btnDeleteRequests(item)

                    },], { cancelable: false });
                }}
              />
            </Right>
            <Right>
              <Button transparent>
                <MaterialIcons
                  name="check-box"
                  size={30}
                  onPress={() => {
                    Alert.alert(
                      'בטוח שאתה רוצה לאשר את הסטודנט ?',
                      '',
                      [
                        {
                          text: '',
                          onPress: () => console.log('Ask me later pressed')
                        },
                        {
                          text: 'לא',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'כן',
                          onPress: () => this.btnApprovelStudent(item)
                        },
                      ],
                      { cancelable: false },
                    );
                  }}
                />
              </Button>
            </Right>
          </ListItem>
        )
      }
    }
    )
  }
  sendPush = async () => {
    const { content, title, newTokensOfStudents } = this.state;
    const { params } = this.props.route
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "key=AAAAQlzw-xY:APA91bE7tjVqkCpGBxtkTCRMz6QO5Gti5B_SIroRWLemHZKPr8pRcigoxoQ8yvbWpCkFNAUapiO-T4OZhhYRbqJbpKncDvC2BAvRoYLennBcZUq6BxFB9UUn4aG-xmOSYBNVJ-kDE7ws");
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(
      {
        //to: "efTPLrMsRlO2paEFH9_yYm:APA91bGN7uEWUIYVF5SGyrtIF2wDPxJ4ieSsE8hxvc2GkAmKNttGCNa29FMjTrHgwAB8gPHrjtu3IpmY7DAD5biAY34cVDCVETI0Iq2TYJGh5N7j84n8zFbHyyZzgCcn9cR0EdWanR-6",
        //registration_ids: newTokensOfStudents
        registration_ids: ["dtg8MDyVQhCKbiwv4J5qX-:APA91bHgNQuKBHLH9-1WHgv5tO9Ur83xzJyxSWsAbMr0qGTFg3ft8tIQbT3Nf8dxUwn4VRL6RDdX0iQyeuBQJixyy4rwEjnQxgw8PvJTwsMNkvb8c8JKGk--MROgMs6B-ZXm287R5Oye"
          , "cd76wqzkSZ2qUArvrj7QYk:APA91bEMSN-ISu65LfQiWYitSNdx42GQ1TPA0ojq31ADolvjn7jQo0Jzj30x-0sENBBTcGcSUKjqp5jsdjwR9tfekGb-TW3UDItwA5C8F3QaFT_tusCnd-SfMG7NtTOek4Fh1rodupO1"]
        ,//registration_ids: ["efTPLrMsRlO2paEFH9_yYm:APA91bGN7uEWUIYVF5SGyrtIF2wDPxJ4ieSsE8hxvc2GkAmKNttGCNa29FMjTrHgwAB8gPHrjtu3IpmY7DAD5biAY34cVDCVETI0Iq2TYJGh5N7j84n8zFbHyyZzgCcn9cR0EdWanR-6"],
        collapse_key: "type_a",
        notification: {
          body: content,
          title: title
        },
        data: {
          body: content,
          title: title
        }
      });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

    try {
      const data = {
        ScholarshipID: params.ScholarshipDetails.ScholarshipID,
        DateAndTime: new Date().toISOString().slice(0, 19).replace(' ', 'T'),
        Title: title,
        Text: content
      }
      let res = await Api("addMessages", "POST", data)
      if (res) {
        alert("ההודעה נשלחה :)")
        this.setState({ isChange: true })
      } else
        alert("שליחת ההודעה נכשלה :(")
    } catch (error) {
      console.log("addMessages -- ERROR - ", error)
    }
  }
  renderScene = () => SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute,
    three: this.ThreeRoute,
    four: this.FourRoute,
  });
  FirstRoute = () => (
    <ImageBackground source={require('../../images/blur.jpg')} style={styles.scene}>
      <View style={{ backgroundColor: 'transparent' }}>
        <View style={{ height: '10%', width: '100%' }}>
          <Header style={{ alignItems: 'center', backgroundColor: 'rgb(161, 128, 38)' }}><Text style={{ fontWeight: 'bold', color: 'white' }}>אישור שעות התנדבות</Text></Header>
        </View>
        <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0)' }}>
          <Container style={{ backgroundColor: 'transparent' }}>
            <Content>
              <List>
                {this.ApprovalOfReports()}
              </List>
            </Content>
          </Container>

        </View>
      </View>
    </ImageBackground>
  );
  SecondRoute = () => (
    <ImageBackground source={require('../../images/blur.jpg')} style={styles.scene}>
      <View style={{ backgroundColor: 'transparent' }}>
        <View style={{ height: '10%', width: '100%' }}>
          <Header style={{ alignItems: 'center', backgroundColor: 'rgb(161, 128, 38)' }}><Text style={{ fontWeight: 'bold', color: 'white' }}>צפייה בנתוני סטודנטים</Text></Header>
        </View>
        <View style={{ width: '100%', height: '100%' }}>
          <Container style={{ backgroundColor: 'transparent' }}>
            <Content>
              <List>
                {this.btnApprovalOfScholarships()}
              </List>
            </Content>
          </Container>
        </View>
      </View>
    </ImageBackground>
  );
  ThreeRoute = () => (
    <ImageBackground source={require('../../images/blur.jpg')} style={styles.scene}>
      <View style={{ backgroundColor: 'transparent' }}>
        <View style={{ height: '10%', width: '100%' }}>
          <Header style={{ alignItems: 'center', backgroundColor: 'rgb(161, 128, 38)' }}><Text style={{ fontWeight: 'bold', color: 'white' }}>אישור סטודנטים למלגה</Text></Header>
        </View>
        <View style={{ width: '100%', height: '100%' }}>
          <Container style={{ backgroundColor: 'transparent' }}>
            <Content>
              <List>
                {this.studentsToAprroval()}
              </List>
            </Content>
          </Container>
        </View>
      </View>
    </ImageBackground>
  )
  FourRoute = () => (
    <ImageBackground source={require('../../images/blur.jpg')} style={styles.scene}>
      <View style={{ backgroundColor: 'transparent' }}>
        <View style={{ height: '10%', width: '100%' }}>
          <Header style={{ alignItems: 'center', backgroundColor: 'rgb(161, 128, 38)' }}><Text style={{ fontWeight: 'bold', color: 'white' }}>הודעות</Text></Header>
        </View>
        <View style={{ width: '100%', height: '100%' }}>
          <Container style={{ backgroundColor: 'transparent' }}>
            <Content padder>
              <Form>
                <Header style={{ alignItems: 'center', backgroundColor: 'rgb(161, 128, 38)' }}><Text style={{ fontWeight: 'bold', color: 'white' }}>כתוב כותרת</Text></Header>
                <Textarea style={{ height: 50 }} rowSpan={2} bordered placeholder="שלח הודעה לסטודנטים" onChangeText={(title) => this.setState({ title })} placeholderTextColor={'black'}
                  style={{ borderColor: 'black' }} />
                <Header style={{ alignItems: 'center', backgroundColor: 'rgb(161, 128, 38)' }}><Text style={{ fontWeight: 'bold', color: 'white' }}>כתוב את גוף ההודעה</Text></Header>
                <Textarea rowSpan={5} bordered placeholder="שלח הודעה לסטודנטים" onChangeText={(content) => this.setState({ content })} placeholderTextColor={'black'}
                  style={{ borderColor: 'black' }} />
              </Form>
              <TouchableHighlight style={{ backgroundColor: 'rgb(161, 128, 38)' }}
                onPress={() => this.sendPush()}>
                <Text style={styles.loginText}>שלח הודעה</Text>
              </TouchableHighlight>
            </Content>
          </Container>
        </View>
      </View>
    </ImageBackground>
  )
  filterStudentToken = (getStudentByScholarshipIDTrueOrFalse) => {
    if (getStudentByScholarshipIDTrueOrFalse) {
      let newTokensOfStudents = []
      getStudentByScholarshipIDTrueOrFalse.forEach(item => {
        let FilterScholatships = item
        FilterScholatships = item.Token
        newTokensOfStudents.push(FilterScholatships)
      })
      this.setState({ newTokensOfStudents })
      return newTokensOfStudents
    } else return null
  }
  render() {
    const { index, routes, getStudentByScholarshipIDTrueOrFalse, getStudentHours, Student } = this.state;
    const { isModalVisible, details, isModalVisible2, content, isChange } = this.state;
    const { ScholarshipDetails } = this.props.route.params

    const Entrance = details ? <Text><Text style={{ fontWeight: 'bold' }}>כניסה : </Text> {details.StartTime.substring(11, 19)} <Text>     <Text style={{ fontWeight: 'bold' }}>תאריך : </Text>
      {details.StartTime.substring(8, 10) + '-' + details.StartTime.substring(5, 7)
        + '-' + details.StartTime.substring(0, 4)}</Text>
    </Text> : ''
    const DistanceWhenEntering = details ? <Text><Text style={{ fontWeight: 'bold' }}>מרחק : </Text>{this.getDistanceFromLatLonInKm(details.StartLat, details.StartLng, ScholarshipDetails.Lat, ScholarshipDetails.Lng)} ק"מ מהמלגה</Text > : ''
    const exit = details ? <Text><Text style={{ fontWeight: 'bold' }}>יציאה :  </Text>
      {details.EndTime.substring(11, 19)}      <Text>
        <Text style={{ fontWeight: 'bold' }}>תאריך :</Text> {details.EndTime.substring(8, 10) + '-' + details.EndTime.substring(5, 7) + '-' + details.EndTime.substring(0, 4)}
      </Text>
    </Text> : ''
    const DistanceAtTheExit = details ? <Text>
      <Text style={{ fontWeight: 'bold' }}>מרחק : </Text>{this.getDistanceFromLatLonInKm(details.EndLat, details.EndLng, ScholarshipDetails.Lat, ScholarshipDetails.Lng)} ק"מ מהמלגה
              </Text> : ''

    //const Tokens = this.filterStudentToken(getStudentByScholarshipIDTrueOrFalse)
    //console.log("Tokens", Tokens)
    return (
      getStudentByScholarshipIDTrueOrFalse !== null && getStudentHours !== null ?
        <View style={{ flex: 1 }}>
          {!isChange &&
            <TabView
              navigationState={{ index, routes }}
              renderScene={this.renderScene()}
              onIndexChange={index => {
                this.setState({ index })
              }}
              initialLayout={initialLayout}
              renderTabBar={props =>
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: 'red' }}
                  renderIcon={
                    props => getTabBarIcon(props)
                  }
                  tabStyle={styles.bubble}
                  labelStyle={styles.noLabel}
                />
              }
              tabBarPosition={'bottom'}


            />}
          < View style={styles.container} >
            <Modal
              isVisible={isModalVisible}>
              <View style={{ height: '10%', backgroundColor: 'rgba(100,200,200,0.6)', width: '100%' }}>
                <Text>אישור סטודנטים למלגה</Text>
              </View>
              <View style={{ backgroundColor: 'white', width: '100%', height: '85%', alignItems: 'center' }}>
                <Text>שם פרטי : {Student.FirstName}</Text>
                <Text>שם משפחה : {Student.LastName}</Text>
                <Text>אימייל : {Student.Email}</Text>
                <Text>מין : {Student.Sex}</Text>
                <Text>טלפון : {Student.Telephone}</Text>
                <Text>עיר : {Student.City}</Text>
                <Text>כתובת : {Student.Address}</Text>
                <Text>תאריך יום הולדת : {Student.BirthDate}</Text>
              </View>
              <AntDesign
                name="closecircle"
                size={30}
                style={styles.closecircle}
                onPress={() => this.toggleModal()}
              />
            </Modal>
          </View >
          < View style={{ height: 0, borderWidth: 2 }}>
            <Modal
              isVisible={isModalVisible2}>
              {/* <Container> */}
              <Header style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', alignContent: 'center', justifyContent: 'center' }}>אישור שעות</Text>
                <AntDesign
                  name="closecircle"
                  size={30}
                  style={styles.closecircle}
                  onPress={() => this.toggleModal2()}
                />
              </Header>
              {/* <Content> */}
              <Card >
                <CardItem>
                  <Left>
                    <Thumbnail source={{ uri: 'http://site04.up2app.co.il/images/Ex/' + ScholarshipDetails.NameOfTheScholarship + '.jpg' }} />
                    <Body>
                      <Text style={{ fontWeight: 'bold' }}>{ScholarshipDetails.NameOfTheScholarship}</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem>
                  <Body>
                    {/* <Image source={{ uri: 'http://site04.up2app.co.il/images/Ex/' + ScholarshipDetails.NameOfTheScholarship + '.jpg' }} style={{ height: 200, width: 300, flex: 1 }} /> */}
                    <Text>
                      {Entrance}
                    </Text>
                    <Text>{DistanceWhenEntering}</Text>
                    <Text style={{ paddingTop: 10 }}>{exit}</Text>
                    <Text style={{ height: 80 }}>{DistanceAtTheExit}</Text>
                  </Body>
                </CardItem>
              </Card>
              {/* </Content>
              </Container> */}
              {/* <View style={{ height: '10%', backgroundColor: 'rgba(100,200,200,0.6)', width: '100%' }}>
                <Text>אישור שעות</Text>
              </View>
              <View style={{ backgroundColor: 'white', width: '100%', height: '85%', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, color: 'white' }}>
                  {Entrance}
                </Text>
                <Text>{DistanceWhenEntering}</Text>
                <Text>{exit}</Text>
                <Text>{DistanceAtTheExit}</Text>
              </View> */}

            </Modal>
          </View >
        </View >
        :
        <View>
          <ActivityIndicator style={{ alignContent: 'center', justifyContent: 'center', with: '100%', height: '100%' }} size='large' color="black" />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  modalContainer: {
    flex: 0.4,
    top: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 20,
    width: 340,
    borderRadius: 30,
    backgroundColor: "#0000FF",
  },
  closecircle: {

    position: 'absolute',
    margin: 16,
    //top: 4,
    right: 0,
    bottom: 0,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center'

  },




  noLabel: {
    display: 'none',
    //height: 0
  },
  bubble: {
    backgroundColor: 'rgb(161, 128, 38)',
    //paddingHorizontal: 18,
    //paddingVertical: 12,
    //borderRadius: 10
  },


});