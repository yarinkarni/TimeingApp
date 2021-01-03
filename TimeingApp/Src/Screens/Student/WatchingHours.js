import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { PieChart } from "react-native-chart-kit";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Api } from '../../Components/api';

export default class WatchingHours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ApprovalHours: 0,
      NotApprovalHours: 0,
    }
  }
  componentDidMount = async () => {
    const ScholarshipsHours = await Api("GetRequestsByStudentIDAndScholarshipID/1/1", "GET")
    this.CalculationOfHours(ScholarshipsHours)
  }
  CalculationOfHours = async (ScholarshipsHours) => {
    ScholarshipsHours.map(e => {
      e.Approval ? this.CalculationOfHours2(e.StartTime, e.EndTime, true) :
        this.CalculationOfHours2(e.StartTime, e.EndTime, false)
    })
  }
  CalculationOfHours2 = async (date1, date2, approv) => {
    var date3 = new Date(date1).getTime();
    var date4 = new Date(date2).getTime();
    var hrs = Math.floor((Math.floor((date4 - date3) / 60000)) / 60);
    approv ? this.setState({ ApprovalHours: this.state.ApprovalHours + hrs })
      : this.setState({ NotApprovalHours: this.state.NotApprovalHours + hrs })
    return hrs
  }
  render() {
    return (
      <View style={[s.container,]}>
        <FontAwesome
          name="user-plus"
          size={50}
          style={s.fab}
          onPress={() => this.props.navigation.navigate('menu')}
        />
        <Text style={s.stdTxt}>צפייה בשעות</Text>
        <PieChart
          data={
            [
              {
                name: "שעות מאושרת",
                population: this.state.ApprovalHours,
                color: "rgba(131, 167, 234, 1)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
              },
              {
                name: "שעות ",
                population: this.state.NotApprovalHours,
                color: "#F00",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
              },
            ]
          }
          width={
            Dimensions.get("window").width
          }
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    )
  }
}
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};
let data = [
  {
    name: "שעות מאושרת",
    population: 80,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "שעות מחקות לאישור",
    population: 20,
    color: "#F00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
];
const s = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    height: "100%",
    width: "100%",
    flex: 1
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
})