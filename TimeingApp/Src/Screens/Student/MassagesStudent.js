import React, { Component } from 'react'
import { View, StyleSheet, ImageBackground } from 'react-native'
import { Container, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Header } from 'native-base';
import { Api } from '../../Components/api';
import { observer, inject } from 'mobx-react'

@inject("TimeingStore")
@observer
export default class MassagesStudent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      GetMessages: []
    }
  }
  componentDidMount = async () => {
    const { TimeingStore } = this.props
    let scholarshipByStudent = TimeingStore.getScholarshipByStudent
    const GetMessages = await Api("GetMessagesByStudentID/" + TimeingStore.getUser.StudentID, "GET")
    this.setState({ GetMessages })
  }
  getMessages = () => {
    return this.state.GetMessages.map((item, index) => {
      return (
        <List key={item.Title}>
          <ListItem thumbnail>
            <Body>
              <Text style={{ fontWeight: 'bold', color: 'black' }}>{item.Title}</Text>
              <Text note numberOfLines={1} style={{ fontWeight: 'bold', color: 'black' }}>{item.Text}</Text>
            </Body>
            {/* <Right>
              <Button transparent>
                <Text>View</Text>
              </Button>
            </Right> */}
          </ListItem>
        </List>
      )
    }
    )
  }
  render() {
    return (
      <ImageBackground source={require('../../images/blur.jpg')} style={styles.container} >
        <Container style={{ backgroundColor: 'transparent', right: 0 }}>
          <Content>
            <View style={styles.headerView}>
              <Header style={{ alignItems: 'center', backgroundColor: 'rgb(161, 128, 38)' }}><Text style={{ fontWeight: 'bold', color: 'white' }}>הודעות</Text></Header>
            </View>
            <List>
              {this.getMessages()}
            </List>
          </Content>
        </Container>
      </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    // backgroundColor: '#1E90FF',
    flex: 1
  },
  headerView: {
    //height: '20%',
    backgroundColor: 'rgb(100,200,200)',
    width: '100%'
  },
  header: {
    alignItems: 'center'
  }
})