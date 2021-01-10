import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import InputOutline from 'react-native-input-outline';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { observer, inject } from 'mobx-react'
import { Api } from '../../Components/api';
@inject("TimeingStore")
@observer
export default class AddScholarshipPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ScholarshipID: 0,
      IsActive: true,
      UserID: 1 || this.props.TimeingStore.getUser.UserID,
      Conditions: 'ron',
      NameOfTheScholarship: 'ron',
      DueDate: 'ron',
      Remarks: 'ron'
    };
  }

  txtchgConditions = (Conditions) => this.setState({ Conditions });
  txtchgNameOfTheScholarship = (NameOfTheScholarship) => this.setState({ NameOfTheScholarship });
  txtchgDueDate = (DueDate) => this.setState({ DueDate });
  txtchgRemarks = (Remarks) => this.setState({ Remarks });

  AddScholarship = async () => {
    const {ScholarshipID, IsActive, UserID, Conditions, NameOfTheScholarship, DueDate, Remarks}=this.state
    let obj2Send = {
      "ScholarshipID": ScholarshipID,
      "IsActive": IsActive,
      "UserID": UserID,
      "Conditions": Conditions,
      "NameOfTheScholarship": NameOfTheScholarship,
      "DueDate": DueDate,
      "Remarks": Remarks
    }
    const res = await Api("addScholarship", "POST", obj2Send)
    if (res) {
      alert("המלגה נוספה בהצלחה :)")
      this.props.navigation.navigate('ManagementPage');
    } else {
      alert("ההוספה נכשלה :(")
    }
    return res;
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text>Add Scholarship</Text>
        </View>
        <InputOutline
          style={styles.inputContainer}
          placeholder="תנאים"
          focusedColor='blue'
          defaultColor='grey'
          value={this.state.firstName}
          onChangeText={(text) => { this.txtchgConditions(text) }}
        />
        <InputOutline
          style={styles.inputContainer}
          placeholder="שם המלגה"
          focusedColor='blue'
          defaultColor='grey'
          value={this.state.firstName}
          onChangeText={(text) => { this.txtchgNameOfTheScholarship(text) }}
        />
        <InputOutline
          style={styles.inputContainer}
          placeholder="תאריך להגשה"
          focusedColor='blue'
          defaultColor='grey'
          value={this.state.firstName}
          onChangeText={(text) => { this.txtchgDueDate(text) }}
        />
        <InputOutline
          style={styles.inputContainer}
          placeholder="הערות"
          focusedColor='blue'
          defaultColor='black'
          // 'grey'
          value={this.state.firstName}
          onChangeText={(text) => { this.txtchgRemarks(text) }}
        />
        <FontAwesome name="user-plus" size={120} style={styles.fab}
          onPress={this.AddScholarship}
        />
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
    //borderBottomColor: '#F5FCFF',
    //backgroundColor: '#FFFFFF',
    //borderRadius: 30,
    //borderBottomWidth: 1,
    width: 250,
    //height: 45,
    //marginBottom: 20,
    flexDirection: 'row-reverse',
    alignItems: 'center',
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
    alignItems: "center",
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
