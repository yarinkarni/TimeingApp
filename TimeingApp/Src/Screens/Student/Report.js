import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import { observer, inject } from 'mobx-react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { DateTime } from 'react-datetime'
import { Api } from '../../Components/api';


let url = 'http://site04.up2app.co.il/';
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
    console.log(this.state.scholarships, 'tss')
  }

  getScholorshipsByStudent = async () => {
    //console.log(" this.props.TimeingStore.getUser.StudentID", this.props.TimeingStore.getUser.StudentID)
    await fetch(url + "getRequestsByStudentID/" + this.props.TimeingStore.getUser.StudentID,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
      })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.length) {
          //console.log("data", data)
          this.props.TimeingStore.setScholarshipByStudent(data)
        }
        else {
          console.log("wrong ID!");
        }
        this.setState({ scholarshipByStudent: data.length ? data : [] });
      })
      .catch(function (err) {
        console.log(err);
      });
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
        StartTime: new Date().toJSON()
        //new Date().toISOString().slice(0, 19).replace(' ', 'T')
      })
    })
  }

  btnEnd = () => {
    Geolocation.getCurrentPosition((info) => {
      this.setState({
        EndLat: info.coords.latitude,
        EndLng: info.coords.longitude
      })
    })
    this.setState({
      EndTime: new Date().toISOString().slice(0, 19).replace(' ', 'T')
      , StartTime: null
    });
    this.props.TimeingStore.setReportData(null)
    this.AddReport()
  }
  AddReport = async () => {
    //console.log('addReport')
    const { StudentID, ScholarshipID, StartTime, StartLat, StartLng, EndLat, EndLng, EndTime, Approval } = this.state
    let obj2Send = {
      "StudentID": StudentID,
      "ScholarshipID": ScholarshipID,
      "StartTime": StartTime,
      "StartLat": StartLat,
      "StartLng": StartLng,
      "EndLat": EndLat,
      "EndLng": EndLng,
      "EndTime": EndTime,
      "Approval": Approval
    }
    console.log("obj2Send", obj2Send)
    const res = await Api("addReport", "POST", obj2Send)
    console.log(res, 'res')
    if (res) {
      console.log(res, 'res')
      alert("הדווח נוסף בהצלחה :)")
      this.props.navigation.navigate('menu');
    } else {
      alert("ההוספה נכשלה :(")
    }
    //console.log("res  - - - -  ?", JSON.stringify(res))
    return res;
  }
  filterScholarshipsByStudentID = (scholarships) => {
    const { scholarshipByStudent } = this.state
    let newScholarshipByStudent = []
    scholarships.forEach(s => {
      if (scholarshipByStudent.findIndex(a => a.ScholarshipID == s.ScholarshipID) != -1) {
        let FilterScholatships = s
        FilterScholatships["label"] = s.NameOfTheScholarship
        newScholarshipByStudent.push(FilterScholatships)
      }
    });
    return newScholarshipByStudent
  }

  render() {
    const { EndTime, StartTime, scholarships, scholarshipByStudent, selectedScholorships, curTime } = this.state
    const { TimeingStore, navigation } = this.props
    const getActiveScholarships = this.filterScholarshipsByStudentID(scholarships)
    console.log(getActiveScholarships, 'getActiveScholarships')
    console.log(this.state.StudentID, 'StudentID')
    console.log(this.state.ScholarshipID, 'ScholarshipID')
    console.log(this.state.StartTime, 'StartTime')
    console.log(this.state.StartLat, 'StartLat')
    console.log(this.state.StartLng, 'StartLng')
    console.log(this.state.EndLat, 'EndLat')
    console.log(this.state.EndLng, 'EndLng')
    console.log(this.state.EndTime.toString(), 'EndTime')
    console.log(this.state.Approval, 'Approval')
    //console.log(DateTime.Now.ToString(), 'dddd')
    console.log(new Date().toJSON(), 'date')
    return (
      <View style={[s.container]}>
        <FontAwesome
          name="user-plus"
          size={50}
          style={s.fab}
          onPress={() => this.props.navigation.navigate('menu')}
        />
        <View style={s.Time}>
          <Text>{curTime}</Text>
          <Text style={s.stdTxt}>
            שלום {TimeingStore.getUser.FirstName}
          </Text>
          <View style={[{ padding: 20 }, StartTime && { opacity: 0.7 }]}>
            <DropDownPicker
              items={getActiveScholarships}
              disabled={StartTime ? true : false}
              containerStyle={{ height: 40 }}
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
          <View>
            <View style={{ flexWrap: 'wrap', justifyContent: 'space-around', flexDirection: 'row' }}>
              <TouchableOpacity style={[s.stdBtn, StartTime && { backgroundColor: 'red' }]}
                onPress={StartTime ? this.btnEnd : this.btnStart}>
                <Text style={[s.stdTxt]}>{StartTime ? 'יציאה' : 'כניסה'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.stdBtn} onPress={() => navigation.navigate('WatchingHours')}>
                <Text style={s.stdTxt}>צפייה בשעות </Text>
              </TouchableOpacity>
            </View>
            <View style={s.Time}>
              <Text style={s.stdTxt}>
                שעת כניסה : {StartTime}
              </Text>
              <Text style={s.stdTxt} >
                שעת יציאה :  {EndTime}
              </Text>
              <Text>
                {moment().format('YYYY-MM-DDTHH:mm:ss')}
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
      </View>
    )
  }
}
const s = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    opacity: 0.7,
    height: "100%",
    width: "100%"
  },
  stdBtn: {
    height: 50,
    width: 150,
    backgroundColor: '#00BFFF',
    //  'gray',
    borderRadius: 20,
    alignItems: 'center',
    margin: 20,
    justifyContent: 'center',
  },
  stdTxt: {
    fontSize: 20,
    fontFamily: 'Arial',
    color: 'white'
  },
  Time: {
    width: '70%',
    paddingTop: 40,
    justifyContent: 'space-around'
  },
  Vtxt: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: 24,
    color: 'white',
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
})