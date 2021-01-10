import React, { Component, PureComponent } from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RNCamera } from 'react-native-camera';


export default class Massages extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});




// const UselessTextInput = (props) => {
//   return (
//     <TextInput
//       {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
//       editable
//       maxLength={200}
//       multiline
//       numberOfLines={4}
//     />
//   );
// }
// export default class Massages extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       text: '',
//     }
//   }
//   txtchgtext = (text) => this.setState({ text });
//   render() {
//     return (
//       <View style={s.container}>
//         {/* <View
//           style={{
//             //backgroundColor: value,
//             borderBottomColor: '#000000',
//             //borderBottomWidth: 1,
//             height: 200, borderColor: 'black',
//             borderWidth: 2,
//             width: '100%'

//           }}>
//           <UselessTextInput

//             onChangeText={(text) => { this.txtchgtext(text) }}
//           />
//         </View>
//         <Ionicons
//           name="arrow-back-circle"
//           size={50}
//           style={s.fab}
//           onPress={() => this.props.navigation.navigate('menu')}
//         /> */}
//       </View>
//     )
//   }
// }
// const s = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#1E90FF',
//     opacity: 0.7,
//     height: "100%",
//     width: "100%"
//   },
//   stdBtn: {
//     height: 50,
//     width: 150,
//     backgroundColor: '#00BFFF',
//     //  'gray',
//     borderRadius: 20,
//     alignItems: 'center',
//     margin: 20,
//     justifyContent: 'center',
//   },
//   stdTxt: {
//     fontSize: 20,
//     fontFamily: 'Arial',
//     color: 'white'
//   },
//   Time: {
//     width: '70%',
//     paddingTop: 40,
//     justifyContent: 'space-around'
//   },
//   Vtxt: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   txt: {
//     fontSize: 24,
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center'
//   },
//   picker: {
//     backgroundColor: '#fafafa',
//     width: 250,
//     height: 100,
//     position: 'relative'
//   },
//   fab: {
//     position: 'absolute',
//     margin: 16,
//     right: 0,
//     bottom: 0,
//   },
// })