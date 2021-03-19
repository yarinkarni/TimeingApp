import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Button, Text, LogBox, Alert, TouchableOpacity, Keyboard } from 'react-native'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { SearchBar } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import { Api } from '../Components/api';
import { observer, inject } from 'mobx-react'
@inject("TimeingStore")
@observer
export default class ScholarshipList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      listScholarships: [],
      isModalVisible: false,
      index: 0,
      ScholarshipIDState: 1,
      StudentID: this.props.TimeingStore.getUser.StudentID,
      Date: new Date().toISOString().slice(0, 19).replace(' ', 'T'),
      Approval: false,
      listScholarshipsAfterSearch: [],

    }
  }

  toggleModal = (index) => {
    this.setState({ isModalVisible: !this.state.isModalVisible, index });
  };
  //מפלטר לפי מה שנכתב את השמות של המלגות
  updateSearch = (search) => {
    // Keyboard.dismiss();
    if (search.length > 2) {
      let listScholarshipsAfterSearch = this.state.listScholarships.filter(l => l.NameOfTheScholarship.includes(search))
      this.setState({ listScholarshipsAfterSearch, search });
    } else {
      this.setState({ listScholarshipsAfterSearch: this.state.listScholarships, search });
    }

  };
  componentDidMount = async () => {
    //שמתי await בפונקציה בכדי שהסטייט יתאכלס עם מידע תקין
    //עשיתי api כללי שאני קורא לו פה 
    const listScholarships = await Api("getAllScholarships", "GET")
    this.setState({ listScholarships, listScholarshipsAfterSearch: listScholarships })
    //מכניס את כל המלגות לחנות
    this.props.TimeingStore.setScholarship(listScholarships)
  }
  AddRequest = async () => {
    const { ScholarshipIDState, StudentID, Date, Approval } = this.state
    let obj2Send = {
      "ScholarshipID": ScholarshipIDState,
      "StudentID": StudentID,
      "Date": Date,
      "Approval": Approval,
    }
    console.log('obj2SendaddRequests', obj2Send)
    const res = await Api("addRequests", "POST", obj2Send)
    if (res) {
      console.log(res, 'success')
      alert("נשלחה בקשה למלגה :)")
      //this.props.navigation.navigate('Menu');
    } else {
      alert("לא ניתן להגיש בקשה למלגה זו :(")
    }
    return res;
  }
  render() {
    //מציג את כל המלגות עם מודל על כל מלגה עם יותר פרטים
    //לכל מלגה יש כפתור של הגשת מועמדות לאותה מלגה
    const { search, listScholarships, isModalVisible, index, listScholarshipsAfterSearch } = this.state;
    const { navigation, TimeingStore } = this.props;
    var cards = [];
    for (let index = 0; index < listScholarshipsAfterSearch.length; index++) {
      cards.push(
        <TouchableOpacity onPress={() => { this.toggleModal(index) }}>
          <Card key={listScholarshipsAfterSearch[index]?.ScholarshipID}>
            <CardImage
              source={{ uri: 'http://site04.up2app.co.il/images/Ex/' + listScholarshipsAfterSearch[index].NameOfTheScholarship + '.jpg' }}
              title={listScholarshipsAfterSearch[index]?.NameOfTheScholarship}
            />
            <CardTitle
              subtitle={listScholarshipsAfterSearch[index]?.Conditions}
            />
            <CardContent text={listScholarshipsAfterSearch[index]?.DueDate} />
            <CardAction
              separator={true}
              inColumn={false}>
              <View style={styles.cardStyle}>
                <TouchableOpacity style={styles.touchableopacity} onPress={
                  () => { this.toggleModal(index) }
                }>
                  <Text style={styles.txt}>פרטים</Text>
                </TouchableOpacity>
              </View>
            </CardAction>
          </Card>
        </TouchableOpacity>
      )
    }
    return (
      <View style={styles.container} onPress={() => Keyboard.dismiss()}>
        <SearchBar
          placeholder="חפש מלגה"
          onChangeText={this.updateSearch}
          value={search}
        />
        <ScrollView>
          {cards}
        </ScrollView>
        <View style={styles.container}>
          <Modal
            isVisible={isModalVisible}>
            <View style={styles.container}>
              <ScrollView>
                <View style={styles.ScrollListScholarships}>
                  <Card
                    style={styles.card}>
                    <CardImage
                      source={{ uri: 'http://bit.ly/2GfzooV' }}
                      title={"שם ה​מ​​לגה : \n" + listScholarshipsAfterSearch[index]?.NameOfTheScholarship}
                    />
                    <CardTitle
                      style={styles.loginText}
                      subtitle={"תנאים : \n" + listScholarshipsAfterSearch[index]?.Conditions}
                    />
                    <CardContent
                      text={"​מועד הגשה : \n" + listScholarshipsAfterSearch[index]?.DueDate} />
                    <CardContent
                      text={"הערות : \n" + listScholarshipsAfterSearch[index]?.Remarks} />
                    <CardAction
                      separator={true}
                      inColumn={false}>
                      <CardButton
                        onPress={() => {
                          Alert.alert(
                            'האם להגיש מועמדות ?',
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
                                text: 'בטח !',
                                onPress: () => {
                                  Alert.alert("נשלחה בקשה להצטרפות למלגה !")
                                  this.toggleModal();
                                  const temp = listScholarshipsAfterSearch[index].ScholarshipID;
                                  this.setState({ ScholarshipIDState: temp }), () =>
                                    TimeingStore.setScholarshipDetails(listScholarshipsAfterSearch[index])
                                  //navigation.navigate('Menu',);
                                  this.AddRequest()
                                }
                              },
                            ],
                            { cancelable: false },
                          );
                        }}
                        title="הגש מועמדות"
                        color="#09090A"
                      />
                    </CardAction>
                  </Card>
                </View>
              </ScrollView>
              <AntDesign
                name="closecircle"
                size={30}
                style={styles.closecircle}
                onPress={this.toggleModal} />

              {/* <Button
                title="Hide modal"
                onPress={this.toggleModal} /> */}
            </View>
          </Modal>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  txt: {
    color: 'white'
  },
  touchableopacity: {
    borderRadius: 10,
    backgroundColor: 'black',
    width: '50%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardStyle: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1
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
  card: {
    fontWeight: 'bold',
    fontSize: 30
  },
  ScrollListScholarships: {
    height: "100%",
    width: "100%"
  },
  closecircle: {
    position: 'absolute',
    margin: 16,
    top: 0,
    right: 0,
    bottom: 0,
  }
});