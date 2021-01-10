import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { observer, inject } from 'mobx-react'
import { Api } from '../../Components/api';
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
    const res = await Api('getScholarshipByUserID/' + userID, "GET")
    if (res)
      this.setState({ Scholarship: res });
    return res;
  }
  btnDeleteScholarship = (Scholarship) => {
    console.log('Delete    ' + Scholarship.ScholarshipID)
  }
  render() {
    const { Scholarship } = this.state;
    var cards = [];
    //מציג את כל המלגות של אותו מנהל בכרטיסיות עם תפריט לכל מלגה
    for (let index = 0; index < Scholarship.length; index++) {
      cards.push(
        <Card key={index}>
          <CardImage
            source={{ uri: 'http://bit.ly/2GfzooV' }}
            title={Scholarship[index]?.NameOfTheScholarship}
          />
          <CardTitle
            subtitle={Scholarship[index]?.Conditions}
          />
          <CardContent text={Scholarship[index]?.DueDate} />
          <CardAction
            separator={true}
            inColumn={false}>
            <CardButton
              onPress={() => this.props.navigation.navigate('EditScholarship'
                , { ScholarshipDetails: Scholarship[index] }
              )}
              title="עריכה"
              color="#FEB557"
            />
            <CardButton
              onPress={() => {
                Alert.alert(
                  'האם למחוק את המלגה ?',
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
                      onPress: () => this.btnDeleteScholarship(Scholarship[index])
                    },
                  ],
                  { cancelable: false },
                );
              }}
              title="מחיקה"
              color="#FEB557"
            />
            <CardButton
              onPress={() => this.props.navigation.navigate('ApprovalOfScholarships'
                , { ScholarshipDetails: Scholarship[index] }
              )}
              title="סטודנטים"
              color="#FEB557"
            />
            <CardButton
              onPress={() => this.props.navigation.navigate('ApprovalOfReports'
                , { ScholarshipDetails: Scholarship[index] }
              )}
              title="אישור שעות"
              color="#FEB557"
            />
            <CardButton
              onPress={() => {
                Alert.alert(
                  'האם למחוק את המלגה ?',
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
                      onPress: () => this.btnDeleteScholarship(Scholarship[index])
                    },
                  ],
                  { cancelable: false },
                );
              }}
              title="הודעות"
              color="#FEB557"
            />
          </CardAction>
        </Card>
      )
    }
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {cards}
        </ScrollView>
        <FontAwesome name="user-plus" size={50} style={styles.fab}
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
  },
});
