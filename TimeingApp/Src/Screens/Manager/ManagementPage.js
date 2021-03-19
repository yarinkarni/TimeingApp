import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text, LogBox } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { observer, inject } from 'mobx-react'
import { Api } from '../../Components/api';

// Ignore log notification by message:
//LogBox.ignoreLogs(['Warning: ...']);

// Ignore all log notifications:
//LogBox.ignoreAllLogs();
@inject("TimeingStore")
@observer
export default class ManagementPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Scholarship: [],
      userID: ''
    }
  }
  componentDidMount = async () => {
    const { TimeingStore } = this.props
    await this.setState({ userID: TimeingStore.getUser.UserID })

    this.getAllScholarships();
  }
  getAllScholarships = async () => {
    const { TimeingStore } = this.props
    const { userID } = this.state
    const res = await Api("getScholarshipByUserID/" + userID, "GET")
    if (res)
      this.setState({ Scholarship: res });
    //console.log(res[0], 'Scholarship')

    return res;
  }
  btnDeleteScholarship = (Scholarship) => {
    console.log('Delete    ' + Scholarship.ScholarshipID)
  }
  render() {
    const { Scholarship } = this.state;
    const { TimeingStore, navigation } = this.props;
    var cards = [];
    //מציג את כל המלגות של אותו מנהל בכרטיסיות עם תפריט לכל מלגה
    for (let index = 0; index < Scholarship.length; index++) {
      cards.push(
        <Card key={index}>
          <CardImage
            source={{ uri: 'http://site04.up2app.co.il/images/Ex/' + Scholarship[index].NameOfTheScholarship + '.jpg' }}
            title={Scholarship[index]?.NameOfTheScholarship}
          />
          <CardTitle
            subtitle={Scholarship[index]?.Conditions}
          />
          <CardContent text={Scholarship[index]?.DueDate} />
          <CardAction
            separator={true}
            inColumn={false}>
            <View style={{ width: '100%', height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity style={{ borderRadius: 10, backgroundColor: 'black', width: '50%', height: 30, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  this.props.navigation.navigate('ConfirmationOfHours'
                    , { ScholarshipDetails: Scholarship[index] }
                  ),
                    TimeingStore.setScholarshipDetails(Scholarship[index])
                }} >
                <Text style={{ color: 'white' }}>סטודנטים</Text>
              </TouchableOpacity>
            </View>
          </CardAction>
        </Card>
      )
    }
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {cards}
        </ScrollView>
        <AntDesign name="pluscircle" size={50} style={styles.fab}
          onPress={() => this.props.navigation.navigate('AddScholarshipPage')}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    opacity: 0.7,
    //backgroundColor: '#DCDCDC',
    height: "100%",
    width: "100%"
  },
  fixedView: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    color: '#0E30C1'
  },
});
