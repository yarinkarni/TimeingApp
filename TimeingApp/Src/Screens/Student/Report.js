import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import { observer, inject } from 'mobx-react'
let url = 'http://site04.up2app.co.il/';
@inject("TimeingStore")
@observer
export default class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StudentID: this.props.TimeingStore.getUser.StudentID,
      curTime: '',
      startTime: '',
      endTime: '',
      startlatitude: 'unknown',
      startlongitude: 'unknown',
      endlatitude: 'unknown',
      endlongitude: 'unknown',
      scholarshipByStudent: [],
      list2: [],
      selectedScholorships: null,
      scholarships: this.props.TimeingStore.getScholorships
    };
  }
  componentDidMount = async () => {
    const { TimeingStore } = this.props
    await this.getScholorshipsByStudent()
    //console.log("TimeingStore.getReportData", TimeingStore.getReportData)
    TimeingStore.getReportData && this.setState({ ...TimeingStore.getReportData })

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
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let reportData = {}
    Geolocation.getCurrentPosition((info) => {
      reportData = {
        startlatitude: info.coords.latitude,
        startlongitude: info.coords.longitude,
        startTime: `${hours}:${minutes}:${seconds}`
      }
      this.props.TimeingStore.setReportData(reportData)
      this.setState({
        startlatitude: info.coords.latitude,
        startlongitude: info.coords.longitude,
        startTime: `${hours}:${minutes}:${seconds}`
      })
    })
  }

  btnEnd = () => {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    Geolocation.getCurrentPosition((info) => {
      this.setState({
        endlatitude: info.coords.latitude,
        endlongitude: info.coords.longitude
      })
    })
    this.setState({ endTime: `${hours}:${minutes}:${seconds}`, startTime: null });
    this.props.TimeingStore.setReportData(null)
  }
  filterScholarshipsByStudentID = (scholarships) => {
    const { scholarshipByStudent } = this.state
    let newScholarshipByStudent = []
    scholarships.forEach(s => {
      if (scholarshipByStudent.findIndex(a => a.ScholarshipID == s.ScholarshipID) != -1) {
        let newS = s
        newS["label"] = s.NameOfTheScholarship
        newScholarshipByStudent.push(newS)
      }
    });
    return newScholarshipByStudent
  }

  render() {
    const { endTime, startTime, scholarships, scholarshipByStudent, selectedScholorships, curTime } = this.state
    const { TimeingStore, navigation } = this.props
    const getActiveScholarships = this.filterScholarshipsByStudentID(scholarships)
    return (
      <View style={[s.container]}>
        <View style={s.Time}>
          <Text>{curTime}</Text>
          <Text style={s.stdTxt}>
            שלום {TimeingStore.getUser.FirstName}
          </Text>
          <View style={[{ padding: 20 }, startTime && { opacity: 0.7 }]}>
            <DropDownPicker
              items={getActiveScholarships}
              disabled={startTime ? true : false}
              containerStyle={{ height: 40 }}
              style={s.picker}
              itemStyle={{ justifyContent: 'flex-start' }}
              dropDownStyle={{ backgroundColor: '#fafafa' }}
              onChangeItem={item => { this.setState({ selectedScholorships: item }) }} />
          </View>
        </View>
        {(selectedScholorships || TimeingStore.getReportData) ?
          <View>
            <View style={{ flexWrap: 'wrap', justifyContent: 'space-around', flexDirection: 'row' }}>
              <TouchableOpacity style={[s.stdBtn, startTime && { backgroundColor: 'red' }]}
                onPress={startTime ? this.btnEnd : this.btnStart}>
                <Text style={[s.stdTxt]}>{startTime ? 'יציאה' : 'כניסה'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.stdBtn} onPress={() => navigation.navigate('WatchingHours')}>
                <Text style={s.stdTxt}>צפייה בשעות </Text>
              </TouchableOpacity>
            </View>
            <View style={s.Time}>
              <Text style={s.stdTxt}>
                שעת כניסה : {startTime}
              </Text>
              <Text style={s.stdTxt} >
                שעת יציאה :  {endTime}
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
  }
})