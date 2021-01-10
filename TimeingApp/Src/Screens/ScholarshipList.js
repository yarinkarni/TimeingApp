import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Button, Text, YellowBox } from 'react-native'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { SearchBar } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
// import AsyncStorage from '@react-native-community/async-storage';
// import { create } from 'mobx-persist';
// import TimeingStore from '../Stores/TimeingStore';
import { Api } from '../Components/api';
YellowBox.ignoreWarnings(['Remote debugger']);

// const hydrate = create({
//   storage: AsyncStorage,
// });
// //הפונקציה מתרחשת בעליה הראשונה לאפליקציה 
// //בעליה לאפקליקציה הפונקציה לוקחת את המידע שנשמר לוקאלית על המכשיר ושומרת בחנות 
// //בכדי שהמשתמש לא יצטרך להיכנס שוב ועוד נתונים שאצטרך ממנו
// //מספיק פרמטר אחד בכדי להביא את כל החנות
// const GetHydrate = () => {
//   hydrate('userData', TimeingStore).then(() =>
//     console.log('Get data from store'),
//   );
// }
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
      listScholarshipsAfterSearch:[],

    }
  }

  toggleModal = (index) => {
    this.setState({ isModalVisible: !this.state.isModalVisible, index });
  };
  updateSearch = (search) => {
    if(search.length >2){
      let listScholarshipsAfterSearch = this.state.listScholarships.filter(l=>l.NameOfTheScholarship.includes(search))
      this.setState({ listScholarshipsAfterSearch,search });
    }else{
      this.setState({ listScholarshipsAfterSearch:this.state.listScholarships,search });

    }
  
  };
  componentDidMount = async () => {
    //שמתי await בפונקציה בכדי שהסטייט יתאכלס עם מידע תקין
    //עשיתי api כללי שאני קורא לו פה 
    const listScholarships = await Api("getAllScholarships", "GET")
    this.setState({ listScholarships ,listScholarshipsAfterSearch:listScholarships})
    //מכניס את כל המלגות לחנות
    this.props.TimeingStore.setScholarship(listScholarships)
    // //קורא לפונקציה
    // await GetHydrate()
  }
  AddRequest = async () => {
    const { ScholarshipIDState, StudentID, Date, Approval } = this.state
    let obj2Send = {
      "ScholarshipID": ScholarshipIDState,
      "StudentID": StudentID,
      "Date": Date,
      "Approval": Approval,
    }
    console.log("obj2Send", obj2Send)
    const res = await Api("addRequests", "POST", obj2Send)
    console.log(res, 'res')
    if (res) {
      console.log(res, 'res')
      alert("נשלחה בקשה למלגה :)")
      this.props.navigation.navigate('menu');
    } else {
      alert("לא ניתן להגיש בקשה למלגה זו :(")
    }
    //console.log("res  - - - -  ?", JSON.stringify(res))
    return res;
  }
  render() {
    //console.log(new Date().toISOString().slice(0, 19).replace(' ', 'T'),'new Date()')
    //מציג את כל המלגות עם מודל על כל מלגה עם יותר פרטים
    //לכל מלגה יש כפתור של הגשת מועמדות לאותה מלגה
    const { search, listScholarships, isModalVisible, index,listScholarshipsAfterSearch } = this.state;
    const { navigation, TimeingStore } = this.props;
    var cards = [];
    for (let index = 0; index < listScholarshipsAfterSearch.length; index++) {
      cards.push(
        <Card key={listScholarshipsAfterSearch[index]?.ScholarshipID}>
          <CardImage
            source={{ uri: 'http://bit.ly/2GfzooV' }}
            title={listScholarshipsAfterSearch[index]?.NameOfTheScholarship}
          />
          <CardTitle
            subtitle={listScholarshipsAfterSearch[index]?.Conditions}
          />
          <CardContent text={listScholarshipsAfterSearch[index]?.DueDate} />
          <CardAction
            separator={true}
            inColumn={false}>
            <CardButton
              onPress={
                () => { this.toggleModal(index) }
              }
              title="פרטים"
              color="#FEB557"
            />
          </CardAction>
        </Card>
      )
    }
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          value={search}
        />
        <ScrollView>
          {cards}
        </ScrollView>
        <Ionicons
          name="arrow-back-circle"
          size={50}
          style={styles.fab}
          onPress={() => navigation.navigate('menu')}
        />
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
                          alert("נשלחה בקשה להצטרפות למלגה !")
                          this.toggleModal();
                          const temp = listScholarshipsAfterSearch[index].ScholarshipID;
                          console.log(temp,'temp')

                          this.setState({ ScholarshipIDState: temp }),()=>

                         
                          TimeingStore.setScholarshipDetails(listScholarshipsAfterSearch[index])
                          navigation.navigate('menu',);
                          this.AddRequest()
                        }}
                        title="הגש מועמדות"
                        color="#FEB557"
                      />
                    </CardAction>
                  </Card>
                </View>
              </ScrollView>
              <Button
                title="Hide modal"
                onPress={this.toggleModal} />
            </View>
          </Modal>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
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
  }
});