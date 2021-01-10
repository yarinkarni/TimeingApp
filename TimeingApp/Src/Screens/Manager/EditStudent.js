import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Api } from '../../Components/api';
import { observer, inject } from 'mobx-react'
@inject("TimeingStore")
@observer
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
    const Scholarships = this.props.TimeingStore.getScholorships
  }
  GetStudentByScholarshipID = async () => {
    const { TimeingStore } = this.props
    const res = await Api("getRequestsByScholarshipID/" + TimeingStore.getUser.StudentID, "GET")
  }
  GetStudents = async () => {
    const { TimeingStore } = this.props
    const { studentsRequests, students } = this.state
    for (let index = 0; index < studentsRequests.length; index++) {
      const res = await Api("getStudentByID/" + studentsRequests[index].StudentID, "GET")
      if (res)
        this.setState({ students: [...students, data] });

    }
  }
  btnDeleteStudent = async (studentId) => {
    const { TimeingStore } = this.props
    const res = await Api("DeleteStudent/" + studentId, "DELETE")
    if (res) {
      let newStudents = this.state.students.filter(stu => stu.ID !== studentId);
      this.setState({
        students: newStudents
      });
    }
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
