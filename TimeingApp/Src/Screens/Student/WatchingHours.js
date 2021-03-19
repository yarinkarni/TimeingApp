import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native'
import { PieChart, ProgressChart } from "react-native-chart-kit";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Api } from '../../Components/api';
import { Header, Text } from 'native-base';
import { observer, inject } from 'mobx-react'
@inject("TimeingStore")
@observer
export default class WatchingHours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ApprovalHours: 20,
      NotApprovalHours: 20,
    }
  }
  componentDidMount = async () => {
    const { TimeingStore } = this.props
    const ScholarshipsHours = await Api("GetRequestsByStudentIDAndScholarshipID/" + TimeingStore.userData.StudentID + '/' +
      TimeingStore.getScholarshipByStudent[0].ScholarshipID, "GET")
    this.CalculationOfHours(ScholarshipsHours)
  }
  CalculationOfHours = async (ScholarshipsHours) => {
    ScholarshipsHours.map(e => {
      e.Approval ? this.CalculationOfHours2(e.StartTime, e.EndTime, true) :
        this.CalculationOfHours2(e.StartTime, e.EndTime, false)
    })
  }
  //מחשב את כמות השעות שאושרו ושלא אושרו
  //Math.floor פונקציה שמחזירה מספר שלם
  CalculationOfHours2 = async (date1, date2, approv) => {
    var date3 = new Date(date1).getTime();
    var date4 = new Date(date2).getTime();
    //600000 msec    --- 60 mins
    var hrs = Math.floor((Math.floor((date4 - date3) / 60000)) / 60);
    approv ? this.setState({ ApprovalHours: this.state.ApprovalHours + hrs })
      : this.setState({ NotApprovalHours: this.state.NotApprovalHours + hrs })
    return hrs
  }
  render() {
    const { ApprovalHours, NotApprovalHours } = this.state;
    return (
      <ImageBackground source={require('../../images/blur.jpg')} style={styles.container}>
        <View style={styles.headerView}>
          <Header style={{ alignItems: 'center', backgroundColor: 'rgb(161, 128, 38)' }}><Text style={{ fontWeight: 'bold', color: 'white' }}>צפייה בשעות</Text></Header>
        </View>
        <View style={{ paddingTop: 20 }}>
          <PieChart
            style={{ alignContent: 'center', justifyContent: 'center' }}
            data={
              [
                {
                  name: "שעות מאושרת",
                  population: ApprovalHours,
                  color: "black",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
                },
                {
                  name: "שעות מחכות לאישור ",
                  population: NotApprovalHours,
                  color: "gray",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,

                },
              ]
            }
            width={
              Dimensions.get("window").width
            }
            center={[80, 0]}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            hasLegend={false}
          />
          <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', padding: 20, color: 'black' }}>{ApprovalHours}  שעות מאושרת</Text>
          <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', padding: 10, color: 'gray' }}>{NotApprovalHours}  שעות שמחכות לאישור</Text>
        </View>
      </ImageBackground>
    )
  }
}
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 0, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stdBtn: {
    height: 50,
    width: 150,
    backgroundColor: 'gray',
    borderRadius: 20,
    alignItems: 'center',
    margin: 20,
    justifyContent: 'center',

  },
  stdTxt: {
    fontSize: 20,
    fontFamily: 'Arial',
    flex: 0.5
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  headerView: {
    // height: '10%',
    backgroundColor: 'rgba(100,200,200,0.6)',
    width: '100%'
  },
  header: {
    alignItems: 'center'
  }
})