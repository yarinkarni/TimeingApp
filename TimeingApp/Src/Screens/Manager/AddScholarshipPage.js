import React, { Component } from 'react'
import { View, StyleSheet, Keyboard, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import InputOutline from 'react-native-input-outline';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { observer, inject } from 'mobx-react'
import { Api } from '../../Components/api';
import { Text, Header } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


@inject("TimeingStore")
@observer
export default class AddScholarshipPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'http://bit.ly/2GfzooV',
      ScholarshipID: 0,
      IsActive: true,
      UserID: this.props.TimeingStore.getUser.UserID,
      Conditions: '',
      NameOfTheScholarship: '',
      DueDate: '',
      Remarks: '',
      location: '',
      uploadedPicUri: ''
    };
    this.uploadedPicPath = 'http://site04.up2app.co.il/images/Ex/';
  }
  goToPickImage = () => {
    ImagePicker.openPicker({
      includeBase64: true,
      quantity: 0.7,
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      this.setState({ image: image })
    });
  }
  btnUploadPic = () => {
    let img = this.state.image.data;
    let imgName = this.state.NameOfTheScholarship
    this.imageUpload(img, imgName);
  }
  imageUpload = async (img, imgName) => {
    let obj2Send = {
      "base64string": img,
      "name": imgName,
      "path": "Ex"
    }
    const res = await Api("api/Upload", "POST", obj2Send)
    if (res) {
      console.log('yes', res.status)
    } else {
      console.log('no', res.status)
    }
    return res;
  }
  txtchgConditions = (Conditions) => this.setState({ Conditions });
  txtchgNameOfTheScholarship = (NameOfTheScholarship) => this.setState({ NameOfTheScholarship });
  txtchgDueDate = (DueDate) => this.setState({ DueDate });
  txtchgRemarks = (Remarks) => this.setState({ Remarks });
  AddScholarship = async () => {
    Keyboard.dismiss();
    const { ScholarshipID, IsActive, UserID, Conditions, NameOfTheScholarship, DueDate, Remarks, location } = this.state
    if (Conditions && NameOfTheScholarship && DueDate && Remarks && location !== '') {
      let obj2Send = {
        "ScholarshipID": ScholarshipID,
        "IsActive": IsActive,
        "UserID": UserID,
        "Conditions": Conditions,
        "NameOfTheScholarship": NameOfTheScholarship,
        "DueDate": DueDate,
        "Remarks": Remarks,
        "Lat": location.lat,
        "Lng": location.lng
      }
      const res = await Api("addScholarship", "POST", obj2Send)
      if (res) {
        this.btnUploadPic()
        alert("המלגה נוספה בהצלחה :)")
        this.props.navigation.navigate('ManagementPage');
      }
      else
        alert("ההוספה נכשלה :(")
      return res;
    }
    else
      alert('לא מילאת את כל השדות')

  }
  render() {
    const { Conditions, NameOfTheScholarship, DueDate, Remarks, image, location } = this.state
    return (
      <View style={{ flex: 1 }}>
        <Header style={styles.header}><Text style={styles.headerText}>הוסף מלגה</Text></Header>
        {/* <TouchableOpacity style={styles.container}
          //onPress={() => Keyboard.dismiss()}
        > */}
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps='always' style={styles.inputContainer}>
            <TouchableOpacity style={{ height: 220, width: '100%' }}
              onPress={() => this.goToPickImage()} >
              {image.path === undefined ?
                <Image
                  source={{ uri: image }}
                  style={styles.img} />
                :
                <Image
                  source={{ uri: image.path }}
                  style={styles.img} />
              }
            </TouchableOpacity>
            <KeyboardAvoidingView behavior="padding" >
              <View style={{ flex: 1, flexGrow: 1 }}>
                <GooglePlacesAutocomplete
                  placeholder='חפש/י מיקום'
                  minLength={2} // minimum length of text to search
                  returnKeyType={'search'} // Can be left out for default returnh key 
                  listViewDisplayed={false}    // true/false/undefined
                  fetchDetails={true}
                  autoFocus={true}
                  onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details, 'data, details');
                    this.setState({ location: details.geometry.location })
                  }}
                  query={{
                    key: 'AIzaSyCutu8burmtxDFV1OxruFPkOsALRoWwWC8',
                    language: 'he',
                  }}
                  currentLocation={true}
                  currentLocationLabel='Current location'
                  nearbyPlacesAPI='GooglePlacesSearch'
                  debounce={300}
                  GooglePlacesDetailsQuery={{
                    //fields: 'address_component'
                    //fields: 'formatted_address'
                  }}
                  styles={{
                    paddingHorizontal: 20,
                    textInputContainer: {
                      backgroundColor: 'white',
                      paddingHorizontal: 20,
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: 'grey',
                      height: 60,
                      fontSize: 20,
                      alignItems: 'center'
                      //backgroundColor: 'grey',
                    },
                    textInput: {
                      height: 38,
                      color: '#5d5d5d',
                      fontSize: 20,
                      textAlign: 'right'
                    },
                    predefinedPlacesDescription: {
                      color: '#1faadb',
                    },
                  }}
                />

              </View>
              <InputOutline
                placeholder="תנאים"
                focusedColor='blue'
                defaultColor='grey'
                value={Conditions}
                onChangeText={(text) => { this.txtchgConditions(text) }}
              />
              <InputOutline
                placeholder="שם המלגה"
                focusedColor='blue'
                defaultColor='grey'
                value={NameOfTheScholarship}
                onChangeText={(text) => { this.txtchgNameOfTheScholarship(text) }}
              />
              <InputOutline
                placeholder="תאריך להגשה"
                focusedColor='blue'
                defaultColor='grey'
                value={DueDate}
                onChangeText={(text) => { this.txtchgDueDate(text) }}
              />
              <InputOutline
                placeholder="הערות"
                focusedColor='blue'
                defaultColor='black'
                value={Remarks}
                onChangeText={(text) => { this.txtchgRemarks(text) }}
              />
              <View style={{ height: '5%' }}>
                <FontAwesome name="user-plus" size={50} style={styles.fab}
                  onPress={this.AddScholarship}
                />
              </View>
            </KeyboardAvoidingView >
          </ScrollView>
        </View >
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: '100%'
  },
  inputContainer: {
    width: '100%',
    flex: 1,
    flexGrow: 1
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
    position: 'relative',
    margin: 16,
    alignSelf: 'center',
    bottom: 0,
  },
  headerView: {
    height: '10%',
    backgroundColor: 'rgba(100,200,200,0.6)',
    width: '100%',
    // flex: 1
  },
  header: {
    backgroundColor: '#09394B',
    alignItems: 'center'
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white'
  },
  touchableOpacityImg: {
    height: 200,
    width: '100%',
    borderRadius: 100,
    backgroundColor: 'green',
  },
  img: {
    height: 200,
    width: '100%',
    // borderRadius: 100
  }


});
