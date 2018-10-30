
// 20181009082948
// http://172.22.8.102/ff/dashboard/php/getDefectDetails.php

var historyChartData;
var codeChartData;
var machineChartData;

var urlParams = new URLSearchParams(window.location.search);
var defectCode = urlParams.get('defect');
var chart;
var codeChart;

$(document).ready(function() {
    $.getJSON('../php/getDefectDetails.php?defect=' + defectCode, function (data) {
        // alert(data[1].qty);
        //alert('x');
        historyChartData = data.CHART;
        $('#list').html(data.TABLE);
        //alert(historyChartData[12].desc);
        historyChart();
    });
});

AmCharts.ready(function () {


});


function historyChart()
{
    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();

  //  alert(historyChartData);
    chart.dataProvider = historyChartData;
    chart.marginLeft = 10;
    chart.categoryField = "date";
    chart.dataDateFormat = "YY-MM-DD";
    chart.addTitle('SCRAP HISTORY - '+historyChartData[1].desc);

    // listen for "dataUpdated" event (fired when chart is inited) and call zoomChart method when it happens
    chart.addListener("dataUpdated", zoomChart);

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
     categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
      categoryAxis.minPeriod = "DD"; // our data is yearly, so we set minPeriod to YYYY
    categoryAxis.dashLength = 3;
    categoryAxis.minorGridEnabled = true;
    categoryAxis.minorGridAlpha = 0.1;

    // value
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.axisAlpha = 0;
    valueAxis.inside = true;
    valueAxis.dashLength = 3;
    chart.addValueAxis(valueAxis);

    // GRAPH
    graph = new AmCharts.AmGraph();
    graph.type = "column"; // this line makes the graph smoothed line.
    graph.lineColor = "#d1655d";
    //graph.color= "#d1655d";
    graph.negativeLineColor = "#637bb6"; // this line makes the graph to change color when it drops below 0
    graph.bullet = "round";
    graph.bulletSize = 8;
    graph.bulletBorderColor = "#FFFFFF";
    graph.bulletBorderAlpha = 1;
    graph.bulletBorderThickness = 2;
    graph.lineThickness = 2;
    graph.valueField = "qty";
    graph.labelText="[[qty]]";
    graph.balloonText = "[[desc]]<br><b><span style='font-size:14px;'>[[value]]</span></b>";
    chart.addGraph(graph);

    // CURSOR
    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorAlpha = 0;
    chartCursor.cursorPosition = "mouse";
    chartCursor.categoryBalloonDateFormat = "DD";
    chart.addChartCursor(chartCursor);

    // SCROLLBAR
    var chartScrollbar = new AmCharts.ChartScrollbar();
    chart.addChartScrollbar(chartScrollbar);

    chart.creditsPosition = "bottom-right";

    // WRITE
    chart.write("defectHistory");
};
// this method is called when chart is first inited as we listen for "dataUpdated" event
function zoomChart() {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    //chart.zoomToDates(new Date(1972, 0), new Date(1984, 0));
}

// function worstCodesChart()
// {
//     // SERIAL CHART
//     chart = new AmCharts.AmSerialChart();
//
//     //  alert(historyChartData);
//     chart.dataProvider = codeChartData;
//     chart.marginLeft = 10;
//     chart.categoryField = "date";
//     //chart.dataDateFormat = "YY-MM-DD";
//     chart.addTitle('SCRAP HISTORY - '+codeChartData[1].desc);
//
//     // listen for "dataUpdated" event (fired when chart is inited) and call zoomChart method when it happens
//     chart.addListener("dataUpdated", zoomChart);
//
//     // AXES
//     // category
//     var categoryAxis = chart.categoryAxis;
//    // categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
//    // categoryAxis.minPeriod = "DD"; // our data is yearly, so we set minPeriod to YYYY
//     categoryAxis.dashLength = 3;
//     categoryAxis.minorGridEnabled = true;
//     categoryAxis.minorGridAlpha = 0.1;
//
//     // value
//     var valueAxis = new AmCharts.ValueAxis();
//     valueAxis.axisAlpha = 0;
//     valueAxis.inside = true;
//     valueAxis.dashLength = 3;
//     chart.addValueAxis(valueAxis);
//
//     // GRAPH
//     graph = new AmCharts.AmGraph();
//     graph.type = "column"; // this line makes the graph smoothed line.
//     graph.lineColor = "#0569d1";
//     //graph.color= "#d1655d";
//     //graph.negativeLineColor = "#637bb6"; // this line makes the graph to change color when it drops below 0
//    // graph.bullet = "round";
//     graph.bulletSize = 8;
//     graph.bulletBorderColor = "#FFFFFF";
//     graph.bulletBorderAlpha = 1;
//     graph.bulletBorderThickness = 2;
//     graph.lineThickness = 2;
//     graph.valueField = "qty";
//     graph.labelText="[[qty]]";
//     graph.balloonText = "[[desc]]<br><b><span style='font-size:14px;'>[[value]]</span></b>";
//     chart.addGraph(graph);
//
//     // CURSOR
//     var chartCursor = new AmCharts.ChartCursor();
//     chartCursor.cursorAlpha = 0;
//     chartCursor.cursorPosition = "mouse";
//     chartCursor.categoryBalloonDateFormat = "DD";
//     chart.addChartCursor(chartCursor);
//
//     // SCROLLBAR
//     var chartScrollbar = new AmCharts.ChartScrollbar();
//     chart.addChartScrollbar(chartScrollbar);
//
//     chart.creditsPosition = "bottom-right";
//
//     // WRITE
//     chart.write("defectWorstCodes");
// };