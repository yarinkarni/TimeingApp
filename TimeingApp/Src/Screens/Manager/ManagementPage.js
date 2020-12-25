import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { observer, inject } from 'mobx-react'

let url = 'http://site04.up2app.co.il/';
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
    await this.setState({ userID: this.props.TimeingStore.getUser.UserID })
    this.getAllScholarships();
  }
  getAllScholarships = async () => {
    let returnedObj = null;
    await fetch(url + 'getScholarshipByUserID/' + this.state.userID,
      // 'http://site04.up2app.co.il/getScholarshipByUserID/1'
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
      })
      .then((resp) => resp.json())
      .then((data) => {
        if (data != null) {
          returnedObj = data;
          this.setState({ Scholarship: data });
        }
        else {
          returnedObj = null;
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  btnDeleteScholarship = (Scholarship) => {
    //console.log('Delete    ' + Scholarship.ScholarshipID)
    fetch(url + 'DeleteScholarship/' + Scholarship.ScholarshipID,
      {
        method: 'DELETE',
        headers: new Headers({
          'Accept': 'application/json'
        }),
      })
      .then((resp) => {
        if (resp.status === 200) {
          let newStudents = this.state.Scholarship.filter(stu => stu.ID !== Scholarship.ScholarshipID);
          this.setState({
            Scholarship: newStudents
          });
        }
        else if (resp.status === 400)
          console.log("BadRequest");
        else
          console.log("NotFound");

      }
      )
      .catch(function (err) {
        alert(err);
      });
  }
  render() {
    //    console.log(this.props.TimeingStore.getUser.UserID + 'this.props.TimeingStore.getUser.UserID,')
    const { Scholarship } = this.state;
    // console.log(Scholarship + 'Scholarship      manager')
    // for (let i = 0; i < Scholarship.length; i++) {
    //   console.log(Scholarship[i].ScholarshipID+ 'Scholarship['+i+'].ScholarshipID')
    //   console.log(Scholarship[i].IsActive+ 'Scholarship['+i+'].IsActive')
    //   console.log(Scholarship[i].UserID+ 'Scholarship['+i+'].UserID')
    //   console.log(Scholarship[i].Conditions+ 'Scholarship['+i+'].Conditions')
    //   console.log(Scholarship[i].NameOfTheScholarship+ 'Scholarship['+i+'].NameOfTheScholarship')
    //   console.log(Scholarship[i].DueDate+ 'Scholarship['+i+'].DueDate')
    //   console.log(Scholarship[i].Remarks+ 'Scholarship['+i+'].Remarks')
    // }
    var cards = [];
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
            {/* <DeleteForeverTwoTone /> */}

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
              onPress={() => {
                Alert.alert(
                  'האם למחוק את המלגה ?',
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
                      onPress: () => this.btnDeleteScholarship(Scholarship[index])
                    },
                  ],
                  { cancelable: false },
                );
              }}
              title="סטודנטים"
              color="#FEB557"
            />
            <CardButton
              onPress={() => {
                Alert.alert(
                  'האם למחוק את המלגה ?',
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
                      onPress: () => this.btnDeleteScholarship(Scholarship[index])
                    },
                  ],
                  { cancelable: false },
                );
              }}
              title="אישור שעות"
              color="#FEB557"
            />
            <CardButton
              onPress={() => {
                Alert.alert(
                  'האם למחוק את המלגה ?',
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
