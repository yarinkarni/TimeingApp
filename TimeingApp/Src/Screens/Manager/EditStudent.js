import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
let url = 'http://site04.up2app.co.il/';
export default class EditStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentsRequests: [],
      ScholarshipID: '',
      students: [],
      x: 0
    }
  }
  componentDidMount() {
    this.GetStudentByScholarshipID();
    this.GetStudents();
  }
  GetStudentByScholarshipID() {
    fetch('http://site04.up2app.co.il/getRequestsByScholarshipID/1',
      // url + 'getRequestsByScholarshipID/1',//לא לשכוחחחחח
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
      })
      .then((resp) => {
        if (resp.status === 200)
          return resp.json();
        else
          console.log("could not get all the students!");
      }
      )
      .then((data) => {
        if (!data.toString().includes("could not get all the students!")) {
          this.setState({ studentsRequests: data });
          //console.log(data[1].StudentID + ' not')
          //console.log(this.state.studentsRequests[1].StudentID + '   yes')
        }
        else
          console.log('didnt inserted!');

      })
      .catch(function (err) {
        alert(err);
      });
  }
  GetStudents() {
    //console.log(this.state.studentsRequests.length + 'this.state.studentsRequests.length')
    for (let index = 0; index < this.state.studentsRequests.length; index++) {
      //console.log(this.state.studentsRequests[index].StudentID + '.state.studentsRequests[index].StudentID')
      fetch(url + 'getStudentByID/' + this.state.studentsRequests[index].StudentID,
        {
          method: 'GET', // 'GET', 'POST', 'PUT', 'DELETE', etc.
          headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }),
        }) // Call the fetch function passing the url of the API as a parameter
        .then((resp) => {
          if (resp.status === 200) {
            return resp.json();
          }
          else
            return "could not get all the students!";
        }
        ) // Transform the data into json
        .then((data) => {
          if (!data.toString().includes("could not get all the students!")) {
            this.setState({ students: [...this.state.students, data] });
            //console.log(this.state.students.StudentID+'feth')
          }
          else {
            console.log('didnt inserted!');
          }
        })
        .catch(function (err) {
          alert(err);
        });
    }
  }
  btnDeleteStudent = (studentId) => {
    fetch(url + `DeleteStudent/` + studentId,
      {
        method: 'DELETE', // 'GET', 'POST', 'PUT', 'DELETE', etc.
        headers: new Headers({
          // 'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
      }) // Call the fetch function passing the url of the API as a parameter
      .then((resp) => {
        console.log(resp);
        if (resp.status === 200) {
          //console.log(200);
          let newStudents = this.state.students.filter(stu => stu.ID !== studentId);
          //console.log(newStudents);
          this.setState({
            students: newStudents
          });
        }
        else if (resp.status === 400) {
          console.log("BadRequest");
        }
        else {
          console.log("NotFound");
        }
      }
      ) // Transform the data into json
      .catch(function (err) {
        alert(err);
      });
  }
  btnEditStudent = (student) => {
    this.props.history.push({
      pathname: '/editstudent/',
      state: { student }
    });
  }
  render() {
    if (this.state.studentsRequests.length !== 0
      && this.state.x === 0
    ) {
      this.setState({ x: 1 })
      this.GetStudents();
    }
    //console.log(this.state.studentsRequests[1]?.StudentID + '   yes')
    //console.log(this.state.students + '   students')
    let students2Show = <Text style={{ fontSize: 40 }}>loading...</Text>;
    if (this.state.students.length !== 0) {
      students2Show = this.state.students.map((student) => {
        //console.log(student[0].FirstName + '   lol');
        return (
          <View
            // style={styles.container}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text key={student[0].StudentID}>
              <Text>{student[0].StudentID}</Text>
              <Text>{student[0].FirstName}</Text>
              <Text>{student[0].LastName}</Text>
              <Text>{student[0].Email}</Text>
              {/* <Text>{student[0].Password}</Text>
              <Text>{student[0].Telephone}</Text>
              <Text>{student[0].BirthDate}</Text>
              <Text>{student[0].Sex}</Text>
              <Text>{student[0].Address}</Text>
              <Text>{student[0].City}</Text> */}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <MaterialIcons name='edit' size={20} style={styles.fab}
                onPress={() => this.props.navigation.navigate('AddScholarshipPage')}
              />
              <MaterialIcons name='delete' size={20} style={styles.fab}
                onPress={() => this.props.navigation.navigate('AddScholarshipPage')}
              />
            </View>
          </View>
        );
      });
    }
    return (
      <View>
        <Text >Students</Text>
        <View>
          <Text>
            <Text scope="col">ID</Text>
            <Text scope="col">Name</Text>
            <Text scope="col">Email</Text>
            <Text scope="col">Pass</Text>
            <Text scope="col">Grade</Text>
            <Text scope="col">Pass</Text>
            {'\n'}
          </Text>
          <View>
            {students2Show}
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#1E90FF',
    //opacity: 0.7,
    //backgroundColor: '#DCDCDC',
    //height: "100%",
    //width: "100%"
  },
  fixedView: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  fab: {
    //position: 'absolute',
    color: 'rgb(128, 0, 0)',
    margin: 8,
    right: 0,
    bottom: 0,
  },
});



//         <Fab color="primary" aria-label="add" onClick={() => {
//           this.props.history.push({
//             pathname: '/addstudent/'
//           });
//         }}>
//           <AddIcon />
//         </Fab> */}
//       </View>
//     )
//   }
// }
