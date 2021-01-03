import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Api } from '../../Components/api'
import { observer, inject } from 'mobx-react'


@inject("TimeingStore")
@observer
export default class ApprovalOfScholarships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getStudentByScholarshipID:[]
    }
  }

  componentDidMount = async () => {
    console.log("PROPS ",this.props.route.params.ScholarshipDetails.ScholarshipID)
   const {params}=this.props.route
   let getStudentByScholarshipID=[]
   if(params&&params.ScholarshipDetails){
     try {
       getStudentByScholarshipID = await Api("GetStudentByScholarshipID/" + 
       params.ScholarshipDetails.ScholarshipID+"/true", "GET")
     } catch (error) {
      console.log("GetStudentByScholarshipID -- ERROR - ", error)
     }
   }
   console.log("getStudentByScholarshipID",getStudentByScholarshipID)
   this.setState({getStudentByScholarshipID})
    
    // this.setState({ listScholarships })
    //this.props.route.params.ScholarshipDetails.ScholarshipID,
  }
  render() {
    //console.log("props - ", this.props)
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    )
  }
}