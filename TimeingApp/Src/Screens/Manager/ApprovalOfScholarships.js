import React, { Component } from 'react'
import { TextInput, Text, View, Button, StyleSheet, Alert, TouchableHighlight, ScrollView } from 'react-native'
import { Api } from '../../Components/api'
import { observer, inject } from 'mobx-react'
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



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
    console.log("ASFASAFS")
    const { content, title } = this.state;
    const { params } = this.props.route
    try {
      const data = {
        ScholarshipID:1|| params.ScholarshipDetails.ScholarshipID,
        DateAndTime: new Date().toISOString().slice(0, 19).replace(' ', 'T'),
        Title: title,
        Text: content
      }
      console.log(data, 'data')
      let res = await Api("addMessages", "POST", data)
      console.log(res, 'res')
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
        (1 || params.ScholarshipDetails.ScholarshipID) + "/false", "GET")
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
        (1 || params.ScholarshipDetails.ScholarshipID) + "/true", "GET")
    } catch (error) {
      console.log("GetStudentByScholarshipIDFalse -- ERROR - ", error)
    }
    //  }
    getStudentByScholarshipIDTrue.map(item => {
      this.setState({
        getStudentByScholarshipIDTrueOrFalse: [...this.state.getStudentByScholarshipIDFalse, item]
      })
    })
    //console.log(this.state.getStudentByScholarshipIDTrueOrFalse, 'ssss')
    // this.setState({ listScholarships })
    //this.props.route.params.ScholarshipDetails.ScholarshipID,
    let getStudentHours = []
    try {
      getStudentHours = await Api("GetRequestsByStudentIDAndScholarshipID/1/1"
        //  +
        //   (1 || params.ScholarshipDetails.ScholarshipID) + "/1"
        , "GET")
    } catch (error) {
      console.log("GetStudentByScholarshipIDFalse -- ERROR - ", error)
    }
    this.setState({
      getStudentHours
    })
    //console.log(this.state.getStudentHours, 'getStudentHours')
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
    // console.log(StudentID, 'StudentID')

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
                console.log('yarin')
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
    return this.state.getStudentHours.map((item, index) => {
      return (
        <TouchableHighlight key={index} style={styles.modalContainer}>
          <View style={styles.container}>
            <Text style={{ fontSize: 25, color: 'white', marginLeft: '50%' }}>{item.StudentID + ' ' + item.StartTime}</Text>
            <MaterialCommunityIcons
              name="card-account-details-star-outline"
              size={30}
              style={{ position: 'absolute', margin: 16, left: 40, }}
              onPress={() => {
                console.log('yarin')
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
  btnApprovalOfScholarships = () => {
    return this.state.getStudentByScholarshipIDTrueOrFalse.map((item, index) => {
      return (
        <TouchableHighlight key={index} style={styles.modalContainer}>
          <View style={styles.container}>
            <Text style={{ fontSize: 25, color: 'white', marginLeft: '50%' }}>{item.FirstName + ' ' + item.LastName}</Text>
            <MaterialCommunityIcons
              name="card-account-details-star-outline"
              size={30}
              style={{ position: 'absolute', margin: 16, left: 40, }}
              onPress={() => {
                console.log('yarin')
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
  render() {
    const { route } = this.props
    const { isModalVisible1, isModalVisible2, isModalVisible3 } = this.state


    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(20,40,50,0.2)', alignItems: 'center' }}>
        <View style={{ marginTop: 20, height: 60, backgroundColor: 'rgba(100,200,200,0.6)', width: '100%', alignItems: 'center' }}>
          <Text>שם מילגה : { }</Text>
        </View>
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
          <View style={[styles.buttonContainer, styles.loginButton]}>
            <Text>
              כתוב משהו לסטודנטים יא גבר על :)
          </Text>
            <TextInput
              style={{ width: '100%', height: 10, borderWidth: 1 }}
              value={this.state.title}
              onChangeText={title => this.setState({ title })}
              multiline={true}
              underlineColorAndroid='transparent'
            />
            <TextInput
              style={styles.input}
              value={this.state.content}
              onChangeText={content => this.setState({ content })}
              multiline={true}
              underlineColorAndroid='transparent'
            />
            <TouchableHighlight
              onPress={() => this.sendPush()}>
              <Text style={styles.loginText}>שלח הודעה</Text>
            </TouchableHighlight>
          </View>
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
            <View style={{ backgroundColor: 'white', width: '100%', height: '85%', alignItems: 'center' }}>
              {this.btnApprovalOfScholarships()}
            </View>
            <Button
              title="סגור"
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
    //backgroundColor: 'rgba(20,40,50,0.2)',
    //opacity: 0.7,
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
    flex: 0.2,
    top: 20,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  },
  input: {
    flex: 1,
    //height:100,
    width: "100%",
    borderColor: 'red',
    borderWidth: 1,
  },
});

