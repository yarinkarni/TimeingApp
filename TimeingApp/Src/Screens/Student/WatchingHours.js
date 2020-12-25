import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import {PieChart} from "react-native-chart-kit";
export default class WatchingHours extends Component {
  render() {
    return (
      <View style={[s.container,]}>
        <Text style={s.stdTxt}>צפייה בשעות</Text>
        <PieChart
          data={data}
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
  useShadowColorFromDataset: false // optional
};
const data = [
  {
    name: "מאושר",
    population: 80,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "מחכה לאישור",
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
    flex:1
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
    flex:0.5
  }
})