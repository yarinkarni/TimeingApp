import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Button, Text, YellowBox } from 'react-native'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { SearchBar } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import { create } from 'mobx-persist';
import TimeingStore from '../Stores/TimeingStore';
import { Api } from '../Components/api';

const hydrate = create({
  storage: AsyncStorage,
});
const GetHydrate = () => {
  hydrate('userData', TimeingStore).then(() =>
    console.log('Get data from store'),
  );
}
YellowBox.ignoreWarnings(['Remote debugger']);
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
      index: 0
    }
    // this.getScholarships = getScholarships.bind(this);
  }

  toggleModal = (index) => {
    this.setState({ isModalVisible: !this.state.isModalVisible, index });
    //console.log(this.state.index + 'this.state.index')
  };
  updateSearch = (search) => {
    //console.log(search + 'search')
    this.setState({ search });
  };
  componentDidMount = async () => {
    const x = await Api("getAllScholarships", "GET")
    console.log("API", x)
    this.setState({ listScholarships: x })
    await GetHydrate()
  }
  render() {
    const { search, listScholarships, isModalVisible, index } = this.state;
    const { navigation, TimeingStore } = this.props;
    var cards = [];
    for (let index = 0; index < listScholarships.length; index++) {
      cards.push(
        <Card key={listScholarships[index]?.ScholarshipID}>
          <CardImage
            source={{ uri: 'http://bit.ly/2GfzooV' }}
            title={listScholarships[index]?.NameOfTheScholarship}
          />
          <CardTitle
            subtitle={listScholarships[index]?.Conditions}
          />
          <CardContent text={listScholarships[index]?.DueDate} />
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
        <FontAwesome
          name="user-plus"
          size={50}
          style={styles.fab}
          onPress={() => navigation.navigate('Login')}
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
                      title={"שם ה​מ​​לגה : \n" + listScholarships[index]?.NameOfTheScholarship}
                    />
                    <CardTitle
                      style={styles.loginText}
                      subtitle={"תנאים : \n" + listScholarships[index]?.Conditions}
                    />
                    <CardContent
                      text={"​מועד הגשה : \n" + listScholarships[index]?.DueDate} />
                    <CardContent
                      text={"הערות : \n" + listScholarships[index]?.Remarks} />
                    <CardAction
                      separator={true}
                      inColumn={false}>
                      <CardButton
                        onPress={() => {
                          navigation.navigate('Login',);
                          this.toggleModal();
                          TimeingStore.setScholarshipDetails(listScholarships[index])
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