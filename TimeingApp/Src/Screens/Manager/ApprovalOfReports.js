import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Api } from '../../Components/api'
import { observer, inject } from 'mobx-react'


@inject("TimeingStore")
@observer
export default class ApprovalOfReports extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount = async () => {
    const getReportByScholarshipID = await Api("getReportByScholarshipID/" + 
    this.props.route.params.ScholarshipDetails.ScholarshipID, "GET")
    console.log("getReportByScholarshipID/1", getReportByScholarshipID)
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
