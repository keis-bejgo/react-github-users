import React from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Chart from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);

const Column3D = ({data}) => {
  const chartConfigs = {
    type: "bar3d", 
    width: "100%", 
    height: "400", 
    dataFormat: "json", 
    dataSource: {
      chart: {
        caption: "Most Forked",
        yAxisName:"Forks",
        xAxisName:"Repos",
        xAxisNameFontSize:"16px",
        yAxisNameFontSize:"16px",

      },
      data: data
    }
  };
  return (<ReactFC {...chartConfigs} />);
};

export default Column3D;
