import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native'
import InputOutline from 'react-native-input-outline';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
let url = 'http://site04.up2app.co.il/';

export default class EditScholarship extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ScholarshipID: this.props.route.params.ScholarshipDetails.ScholarshipID,
      IsActive: this.props.route.params.ScholarshipDetails.IsActive,
      UserID: this.props.route.params.ScholarshipDetails.UserID,
      Conditions: this.props.route.params.ScholarshipDetails.Conditions,
      NameOfTheScholarship: this.props.route.params.ScholarshipDetails.NameOfTheScholarship,
      DueDate: this.props.route.params.ScholarshipDetails.DueDate,
      Remarks: this.props.route.params.ScholarshipDetails.Remarks
    };
  }
  txtchgConditions = (Conditions) => this.setState({ Conditions });
  txtchgNameOfTheScholarship = (NameOfTheScholarship) => this.setState({ NameOfTheScholarship });
  txtchgDueDate = (DueDate) => this.setState({ DueDate });
  txtchgRemarks = (Remarks) => this.setState({ Remarks });

  btnEditScholarship = async () => {
    let s = await this.EditScholarship(this.state.ScholarshipID, this.state.IsActive, this.state.UserID, this.state.Conditions, this.state.NameOfTheScholarship, this.state.DueDate, this.state.Remarks);
    if (s == null) {
      alert('didnt inserted into db!');
    }
    else {
      this.props.navigation.navigate('ManagementPage');
    }
  }
  EditScholarship = async (ScholarshipID, IsActive, UserID, Conditions, NameOfTheScholarship, DueDate, Remarks) => {
    let returnedObj = null;
    let obj2Send = {
      "ScholarshipID": ScholarshipID,
      "IsActive": IsActive,
      "UserID": UserID,
      "Conditions": Conditions,
      "NameOfTheScholarship": NameOfTheScholarship,
      "DueDate": DueDate,
      "Remarks": Remarks
    }
    await fetch(url + 'updateScholarship',
      {
        method: 'PUT',
        body: JSON.stringify(obj2Send),
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
      })
      .then((resp) => resp.json())
      .then(function (data) {
        if (!data.toString().includes("could not insert")) {
          returnedObj = data;
        }
        else {
          returnedObj = null;
        }
      })
      .catch(function (err) {
        alert(err);
      });

    return returnedObj;
  }
  render() {
    // console.log(this.state.ScholarshipID + 'this.props.route.params.ScholarshipDetails.ScholarshipID')
    // console.log(this.state.IsActive + 'this.props.route.params.ScholarshipDetails.IsActive')
    // console.log(this.state.UserID + 'this.props.route.params.ScholarshipDetails.UserID')
    // console.log(this.state.Conditions + 'this.props.route.params.ScholarshipDetails.Conditions')
    // console.log(this.state.NameOfTheScholarship + 'this.props.route.params.ScholarshipDetails.NameOfTheScholarship')
    // console.log(this.state.DueDate + 'this.props.route.params.ScholarshipDetails.DueDate')
    // console.log(this.state.Remarks + 'this.props.route.params.ScholarshipDetails.Remarks')
    //const { ScholarshipDetails } = this.props.route.params;
    return (
      <View style={styles.container}>
        {/* <ScrollView contentContainerStyle={styles.scrollContentContainer}> */}
          <View>
            <Text>edit Scholarship</Text>
          </View>
          <TextInput
            style={styles.inputContainer}
            placeholder="תנאים"
            focusedColor='blue'
            defaultColor='grey'
            value={this.state.Conditions}
            onChangeText={(text) => { this.txtchgConditions(text) }}
          />
          <TextInput
            style={styles.inputContainer}
            placeholder="שם המלגה"
            focusedColor='blue'
            defaultColor='grey'
            value={this.state.NameOfTheScholarship}
            onChangeText={(text) => { this.txtchgNameOfTheScholarship(text) }}
          />
          <TextInput
            style={styles.inputContainer}
            placeholder="תאריך להגשה"
            focusedColor='blue'
            defaultColor='grey'
            value={this.state.DueDate}
            onChangeText={(text) => { this.txtchgDueDate(text) }}
          />
          <TextInput
            style={styles.inputContainer}
            placeholder="הערות"
            focusedColor='blue'
            defaultColor='black'
            // 'grey'
            value={this.state.Remarks}
            onChangeText={(text) => { this.txtchgRemarks(text) }}
          />
          <FontAwesome name="user-plus" size={120} style={styles.fab}
            onPress={this.btnEditScholarship}
          />
        {/* </ScrollView> */}
      </View>
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
    
    //backgroundColor: '#DCDCDC',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    //borderRadius: 30,
    //borderBottomWidth: 1,
    width: 300,
    height: 80,
    marginBottom: 20,
    //flexDirection: 'row-reverse',
    //alignItems: 'center',
    fontSize: 14
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
    alignItems: "flex-start",
    paddingBottom: 60
  },
  Topic: {
    textAlign: 'center',
    margin: 20,
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    alignSelf: 'center',
    bottom: 0,
  },
});
