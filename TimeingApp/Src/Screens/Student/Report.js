import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, InteractionManager, ImageBackground } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import DropDownPicker from 'react-native-dropdown-picker';
import { observer, inject } from 'mobx-react'
import { Text, Header } from 'native-base';
import { Api } from '../../Components/api';


@inject("TimeingStore")
@observer
export default class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StudentID: this.props.TimeingStore.getUser.StudentID,
      ScholarshipID: '',
      StartTime: '',
      StartLat: '',
      StartLng: '',
      EndLat: '',
      EndLng: '',
      EndTime: '',
      Approval: false,
      curTime: '',
      scholarshipByStudent: [],
      list2: [],
      selectedScholorships: null,
      scholarships: this.props.TimeingStore.getScholorships
    };
  }
  componentDidMount = async () => {
    //אני משרשר בסטייט את כל הדווחים בדכי שבמידה והמשתמש התנתק מהאפליקציה
    //ונכנס בחזרה אז שהמידע ישמר 
    const { TimeingStore } = this.props
    await this.getScholorshipsByStudent()
    TimeingStore.getReportData && this.setState({ ...TimeingStore.getReportData })
  }
  getScholorshipsByStudent = async () => {
    const { TimeingStore } = this.props
    const res = await Api("GetNameScholarship/" + TimeingStore.getUser.StudentID, "GET")
    if (res)
      this.props.TimeingStore.setScholarshipByStudent(res)
    this.setState({ scholarshipByStudent: res.length ? res : [] });
    return res;
  }
  btnStart = () => {
    let reportData = {}
    Geolocation.getCurrentPosition((info) => {
      reportData = {
        StartLat: info.coords.latitude,
        StartLng: info.coords.longitude,
        StartTime: new Date().toJSON()
      }
      this.props.TimeingStore.setReportData(reportData)
      this.setState({
        StartLat: info.coords.latitude,
        StartLng: info.coords.longitude,
        StartTime:
          // new Date().toJSON()
          new Date().toISOString().slice(0, 19).replace(' ', 'T')
      })
    })
  }
  btnEnd = () => {
    Geolocation.getCurrentPosition((info) => {
      this.props.TimeingStore.setReportData(null)
      this.setState({
        EndLat: info.coords.latitude,
        EndLng: info.coords.longitude,
        EndTime: new Date().toISOString().slice(0, 19).replace(' ', 'T')
        , StartTime: null
      })
      this.AddReport()
    })
    //this.props.TimeingStore.setReportData(null)
  }
  AddReport = async () => {
    const { StudentID, ScholarshipID, StartLat, StartLng, EndLat, EndLng, EndTime, Approval } = this.state
    InteractionManager.runAfterInteractions(async () => {
      let obj2Send = {
        "StudentID": StudentID,
        "ScholarshipID": ScholarshipID,
        "StartLat": StartLat,
        "StartLng": StartLng,
        "EndLat": EndLat,
        "EndLng": EndLng,
        "EndTime": EndTime,
        "Approval": Approval
      }
      const res = await Api("addReport", "POST", obj2Send)
      if (res) {
        alert("הדווח נוסף בהצלחה :)")
        this.props.navigation.navigate('Menu');
      } else {
        alert("ההוספה נכשלה :(")
      }
      return res;
    })
  }
  //פונקציה שמכניסה למערך את הערכים בשביל הפיקר
  filterScholarshipsByStudentID = (scholarships) => {
    const { scholarshipByStudent } = this.state
    let newScholarshipByStudent = []
    scholarshipByStudent.forEach(item => {
      let FilterScholatships = item
      FilterScholatships["label"] = item.NameOfTheScholarship
      newScholarshipByStudent.push(FilterScholatships)
    })
    // scholarships.forEach(s => {
    //   if (scholarshipByStudent.findIndex(a => a.ScholarshipID == s.ScholarshipID) != -1) {
    //     let FilterScholatships = s
    //     FilterScholatships["label"] = s.NameOfTheScholarship
    //     newScholarshipByStudent.push(FilterScholatships)
    //   }
    // });
    return newScholarshipByStudent
  }

  render() {
    const { EndTime, StartTime, scholarships, scholarshipByStudent, selectedScholorships, curTime } = this.state
    const { TimeingStore, navigation } = this.props
    console.log('EndTime', EndTime)
    const Entrance = StartTime ? <Text style={s.stdTxt}>  כניסה : {StartTime.substring(11, 19)}
    </Text> : <Text style={s.stdTxt}>כניסה :</Text>
    const exit = EndTime ? <Text style={s.stdTxt}>
      יציאה :{EndTime.substring(11, 19)}
    </Text> : <Text style={s.stdTxt}>יציאה :</Text>
    const getActiveScholarships = this.filterScholarshipsByStudentID(scholarships)
    return (
      <ImageBackground source={require('../../images/blur.jpg')} style={s.container}>
        <View style={{ backgroundColor: 'rgba(100,200,200,0.6)', width: '100%' }}>
          <Header style={{ alignItems: 'center', backgroundColor: 'rgb(161, 128, 38)' }}><Text style={{ fontWeight: 'bold', color: 'white' }}>דווח</Text></Header>
        </View>
        <View style={s.Time}>
          <Text>{curTime}</Text>
          <Text style={s.stdTxt}>
            שלום {TimeingStore.getUser.FirstName}
          </Text>
          <View style={[{ padding: 20, height: 200 }, StartTime && { opacity: 0.7 }]}>
            <DropDownPicker
              items={getActiveScholarships}
              disabled={StartTime ? true : false}
              containerStyle={{ height: 40 }}
              placeholder="בחר לאיזו מלגה תרצה לדווח "
              style={s.picker}
              itemStyle={{ justifyContent: 'flex-start' }}
              dropDownStyle={{ backgroundColor: '#fafafa' }}
              onChangeItem={item => { this.setState({ selectedScholorships: item, ScholarshipID: item.ScholarshipID }) }} />

          </View>
        </View>

        {(selectedScholorships || TimeingStore.getReportData) ?
          //בודק  אם יש לסטודנט מלגות מאושרות 
          //במידה וכן מציג לו אותם ורק כאשר הוא בוחר מלגה הוא יוכל לדווח
          //במידה ודווח כניסה הכפתור הופך ליציאה וכל שאר העמוד הופך ללא לחיץ
          //עד שיעשה יציאה מהלגה
          <View >
            <View style={s.button}>
              <TouchableOpacity style={[s.stdBtn, StartTime && { backgroundColor: 'red' }]}
                onPress={StartTime ? this.btnEnd : this.btnStart}>
                <Text style={[s.stdTxt]}>{StartTime ? 'יציאה' : 'כניסה'}</Text>
              </TouchableOpacity>
            </View>
            <View style={s.Time}>
              <Text style={s.stdTxt}>
                {Entrance}
              </Text>
              <Text style={s.stdTxt} >
                {exit}
              </Text>
            </View>
          </View>
          :
          <View style={s.Vtxt}>
            <Text style={s.txt}>
              אנא בחר מילגה.
            </Text>
          </View>
        }
      </ImageBackground>
    )
  }
}
const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    // backgroundColor: '#1E90FF',
    flex: 1
  },
  stdBtn: {
    height: 50,
    width: 150,
    backgroundColor: 'rgb(161, 128, 38)',
    borderRadius: 20,
    alignItems: 'center',
    margin: 20,
    justifyContent: 'center',
  },
  stdTxt: {
    fontSize: 20,
    fontFamily: 'Arial',
    color: 'black',
    textAlign: 'center'
  },
  Time: {
    width: '70%',
    //paddingTop: 40,
    justifyContent: 'space-around'
  },
  Vtxt: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  picker: {
    backgroundColor: '#fafafa',
    width: 250,
    height: 100,
    position: 'relative'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  button: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    flexDirection: 'row'
  }
})