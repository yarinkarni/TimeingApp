import React, { Component } from 'react'
import { TextInput, View, StyleSheet, Alert, TouchableHighlight, ScrollView } from 'react-native'
import { Api } from '../../Components/api'
import { observer, inject } from 'mobx-react'
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Header, Content, Textarea, Form, Card, CardItem, Body, List, ListItem, Left, Thumbnail, Right, Button, Text } from "native-base";
@inject("TimeingStore")
@observer
export default class ApprovalOfScholarships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getStudentByScholarshipIDFalse: [],
      getStudentByScholarshipIDTrueOrFalse: [],
      getStudentHours: [],
      isModalVisible1: false,
      isModalVisible2: false,
      isModalVisible3: false,
      title: '',
      content: '',
    }
  }
  sendPush = async () => {
    const { content, title } = this.state;
    const { params } = this.props.route
    try {
      const data = {
        ScholarshipID:  params.ScholarshipDetails.ScholarshipID,
        DateAndTime: new Date().toISOString().slice(0, 19).replace(' ', 'T'),
        Title: title,
        Text: content
      }
      let res = await Api("addMessages", "POST", data)
    } catch (error) {
      console.log("GetStudentByScholarshipIDFalse -- ERROR - ", error)
    }
  }
  componentDidMount = async () => {
    const { params } = this.props.route
    let getStudentByScholarshipIDFalse = []
    let getStudentByScholarshipIDTrue = ''
    //   if(params&&params.ScholarshipDetails){
    try {
      getStudentByScholarshipIDFalse = await Api("GetStudentByScholarshipID/" +
         params.ScholarshipDetails.ScholarshipID + "/false", "GET")
    } catch (error) {
      console.log("GetStudentByScholarshipIDFalse -- ERROR - ", error)
    }
    //  }
    this.setState({
      getStudentByScholarshipIDFalse,
      getStudentByScholarshipIDTrueOrFalse: getStudentByScholarshipIDFalse
    })
    try {
      getStudentByScholarshipIDTrue = await Api("GetStudentByScholarshipID/" +
         params.ScholarshipDetails.ScholarshipID + "/true", "GET")
    } catch (error) {
      console.log("GetStudentByScholarshipIDFalse -- ERROR - ", error)
    }
    //  }
    getStudentByScholarshipIDTrue.map(item => {
      this.setState({
        getStudentByScholarshipIDTrueOrFalse: [...this.state.getStudentByScholarshipIDFalse, item]
      })
    })
    let getStudentHours = []
    try {
      getStudentHours = await Api("GetStudentToAprroval/" + params.ScholarshipDetails.ScholarshipID
        , "GET")
    } catch (error) {
      console.log("GetStudentByScholarshipIDFalse -- ERROR - ", error)
    }
    this.setState({
      getStudentHours
    })
  }
  toggleModal1 = (index) => {
    this.setState({ isModalVisible1: !this.state.isModalVisible1, index });
  };
  toggleModal2 = (index) => {
    this.setState({ isModalVisible2: !this.state.isModalVisible2, index });
  };
  toggleModal3 = (index) => {
    this.setState({ isModalVisible3: !this.state.isModalVisible3, index });
  };
  btnApprovelStudent = (StudentID) => {

  }
  deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }
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


  AllStudents = () => {
    {
      return this.state.getStudentByScholarshipIDFalse.map((item, index) => {
        return (
          <TouchableHighlight key={index} style={[styles.buttonContainer, styles.loginButton]}>
            <View style={styles.container}>
              <Text style={{ fontSize: 25, color: 'white', marginLeft: '50%' }}>{item.FirstName + ' ' + item.LastName}</Text>
            </View>
          </TouchableHighlight>
        )
      }
      )
    }
  }
  studentsToAprroval = () => {
    return this.state.getStudentByScholarshipIDFalse.map((item, index) => {
      return (
        <TouchableHighlight key={index} style={styles.modalContainer}>
          <View style={styles.container}>
            <Text style={{ fontSize: 25, color: 'white', marginLeft: '50%' }}>{item.FirstName + ' ' + item.LastName}</Text>
            <MaterialCommunityIcons
              name="card-account-details-star-outline"
              size={30}
              style={{ position: 'absolute', margin: 16, left: 40, }}
              onPress={() => {
              }} />
            <MaterialIcons
              name="check-box"
              size={30}
              style={styles.fab}
              onPress={() => {
                Alert.alert(
                  'בטוח שאתה רוצה לאשר את הסטודנט ?',
                  '',
                  //My Alert Msg
                  [
                    {
                      text: '',
                      //Ask me later
                      onPress: () => console.log('Ask me later pressed')
                    },
                    {
                      text: 'לא',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'כן',
                      onPress: () => this.btnApprovelStudent(item.StudentID)
                    },
                  ],
                  { cancelable: false },
                );
              }}
            />
          </View>
        </TouchableHighlight>
      )
    }
    )
  }
  ApprovalOfReports = () => {
    const { getStudentHours } = this.state
    console.log("🚀 ~ file: ApprovalOfScholarships.js ~ line 174 ~ getStudentHours", getStudentHours)
    return getStudentHours && getStudentHours.map((item, index) => {
      return (
        <TouchableHighlight key={index} style={styles.modalContainer}>
          <View style={styles.container}>
            <Text style={{ fontSize: 15, color: 'white', marginLeft: '50%' }}>
              {item.FirstName + ' ' + item.LastName}
            </Text>
            <View>
              <Text style={{ fontSize: 15, color: 'white' }}>
                כניסה :{item.StartTime.substring(11, 19)}  בתאריך : {item.StartTime.substring(8, 10) + '-' + item.StartTime.substring(5, 7) + '-' + item.StartTime.substring(0, 4)}
              </Text>
              <Text style={{ fontSize: 15, color: 'white' }}>
                היה במרחק של {this.getDistanceFromLatLonInKm("32.405861", "34.924580", "32.329369", "34.856541")} ק"מ מהמלגה
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 15, color: 'white' }}>
                יציאה :{item.EndTime.substring(11, 19)}   בתאריך : {item.EndTime.substring(8, 10) + '-' + item.EndTime.substring(5, 7) + '-' + item.EndTime.substring(0, 4)}
              </Text>
              <Text style={{ fontSize: 15, color: 'white' }}>
                היה במרחק של {this.getDistanceFromLatLonInKm("32.405861", "34.924580", "32.329369", "34.856541")} ק"מ מהמלגה
              </Text>
            </View>
            <MaterialIcons
              name="check-box"
              size={30}
              style={styles.fab}
              onPress={() => {
                Alert.alert(
                  'בטוח שאתה רוצה לאשר את השעות ?',
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
                      onPress: () => this.btnApprovelStudent(item.StudentID)
                    },
                  ],
                  { cancelable: false },
                );
              }}
            />
          </View>
        </TouchableHighlight>
      )
    }
    )
  }
  btnApprovalOfScholarships = () => {
    return this.state.getStudentByScholarshipIDTrueOrFalse.map((item, index) => {
      return (
        <Container>
          <Header />
          <Content>
            <List>
              <ListItem thumbnail>
                {/* <Left>
                  <Thumbnail square source={{ uri: 'Image URL' }} />
                </Left> */}
                <Body style={{ alignItems: 'center' }}>
                  <Text>{item.FirstName + ' ' + item.LastName}</Text>
                </Body>
                <Right>
                  {/* <Button > */}
                  <Button transparent>
                    <Text>View</Text>
                  </Button>
                </Right>
              </ListItem>
            </List>
          </Content>
        </Container>

      )
    }
    )
  }
  render() {
    const { isModalVisible1, isModalVisible2, isModalVisible3, getStudentHours } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(20,40,50,0.2)', alignItems: 'center' }}>
        <Header style={{ width: 380, height: 60, backgroundColor: 'rgba(100,200,200,0.6)', alignItems: 'center' }}>
          <Text>שם מילגה : { }</Text>
        </Header>
        <View>
          <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]}
            onPress={() => this.toggleModal1()}>
            <Text style={styles.loginText}>אישור שעות</Text>
          </TouchableHighlight>
          <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]}
            onPress={() => this.toggleModal2()}>
            <Text style={styles.loginText}>אישור סטודנטים למגלה</Text>
          </TouchableHighlight>
          <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]}
            onPress={() => this.toggleModal3()}>
            <Text style={styles.loginText}>צפייה בנתוני סטודנטים</Text>
          </TouchableHighlight>
          <Container>
            <Content padder>
              <Form>
                <Textarea rowSpan={5} bordered placeholder="שלח הודעה לסטודנטים" />
              </Form>
            </Content>
          </Container>
          <TouchableHighlight
            onPress={() => this.sendPush()}>
            <Text style={styles.loginText}>שלח הודעה</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.container}>
          <Modal
            animationType='fade'
            transparent={true}
            isVisible={isModalVisible1}>
            <View style={{ height: '10%', backgroundColor: 'rgba(100,200,200,0.6)', width: '100%' }}>
              <Text>אישור שעות התנדבות</Text>
            </View>
            <View style={{ backgroundColor: 'white', width: '100%', height: '85%', alignItems: 'center' }}>
              {this.ApprovalOfReports()}
            </View>
            <Button
              title="סגור"
              onPress={() => this.toggleModal1()}
            />
          </Modal>
        </View>
        <View style={styles.container}>
          <Modal
            isVisible={isModalVisible2}>
            <View style={{ height: '10%', backgroundColor: 'rgba(100,200,200,0.6)', width: '100%' }}>
              <Text>אישור סטודנטים למלגה</Text>
            </View>
            <View style={{ backgroundColor: 'white', width: '100%', height: '85%', alignItems: 'center' }}>
              {this.studentsToAprroval()}
            </View>
            <Button
              title="סגור"
              onPress={() => this.toggleModal2()} />
          </Modal>
        </View>
        <View style={styles.container}>
          <Modal
            isVisible={isModalVisible3}>
            <View style={{ height: '10%', backgroundColor: 'rgba(100,200,200,0.6)', width: '100%' }}>
              <Text>צפייה בנתוני סטודנטים</Text>
            </View>
            <View style={{ width: '100%', height: '85%' }}>
              {this.btnApprovalOfScholarships()}
            </View>
            <Button style={{ width: '100%', height: '10%', backgroundColor: "black" }}
              onPress={() => this.toggleModal3()} />
          </Modal>
        </View>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 0.2,
    top: 20,
    height: 45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 380,
    borderRadius: 30,
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
  loginButton: {
    backgroundColor: "#0000FF",
  },
  loginText: {
    color: '#FFFFFF',
  },
  fab: {
    backgroundColor: 'white',
    color: '	rgb(34,139,34)',
    position: 'absolute',
    margin: 16,
    left: 0,
    top: 110
  },
  input: {
    flex: 1,
    width: "100%",
    borderColor: 'red',
    borderWidth: 1,
  },
});

