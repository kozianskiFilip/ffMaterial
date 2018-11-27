
// 20181009082948
// http://172.22.8.102/ff/dashboard/php/getDefectDetails.php

var codesChartData = [{
    "category": 2009,
    "value": 23.5,
    "url": "#",
    "description": "click to drill-down",
    "months": [{
        "category": 1,
        "value": 1
    }, {
        "category": 2,
        "value": 2
    }, {
        "category": 3,
        "value": 1
    }, {
        "category": 4,
        "value": 3
    }, {
        "category": 5,
        "value": 2.5
    }, {
        "category": 6,
        "value": 1.1
    }, {
        "category": 7,
        "value": 2.9
    }, {
        "category": 8,
        "value": 3.5
    }, {
        "category": 9,
        "value": 3.1
    }, {
        "category": 10,
        "value": 1.1
    }, {
        "category": 11,
        "value": 1
    }, {
        "category": 12,
        "value": 3
    }]
}, {
    "category": 2010,
    "value": 26.2,
    "url": "#",
    "description": "click to drill-down",
    "months": [{
        "category": 1,
        "value": 4
    }, {
        "category": 2,
        "value": 3
    }, {
        "category": 3,
        "value": 1
    }, {
        "category": 4,
        "value": 4
    }, {
        "category": 5,
        "value": 2
    }, {
        "category": 6,
        "value": 1
    }, {
        "category": 7,
        "value": 2
    }, {
        "category": 8,
        "value": 2
    }, {
        "category": 9,
        "value": 3
    }, {
        "category": 10,
        "value": 1
    }, {
        "category": 11,
        "value": 1
    }, {
        "category": 12,
        "value": 3
    }]
}, {
    "category": 2011,
    "value": 30.1,
    "url": "#",
    "description": "click to drill-down",
    "months": [{
        "category": 1,
        "value": 2
    }, {
        "category": 2,
        "value": 3
    }, {
        "category": 3,
        "value": 1
    }, {
        "category": 4,
        "value": 5
    }, {
        "category": 5,
        "value": 2
    }, {
        "category": 6,
        "value": 1
    }, {
        "category": 7,
        "value": 2
    }, {
        "category": 8,
        "value": 2.5
    }, {
        "category": 9,
        "value": 3.1
    }, {
        "category": 10,
        "value": 1.1
    }, {
        "category": 11,
        "value": 1
    }, {
        "category": 12,
        "value": 3
    }]
}];

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
       // $('#list').html(data.TABLE);
        //alert(historyChartData[12].desc);
        historyChart();
    });

    $.get('../php/getDefectDetails.php?defect=' + defectCode+'&mode=1', function (data) {
         $('#list').html(data);
        //alert(historyChartData[12].desc);
    });

});

AmCharts.ready(function () {
    worstCodesChart();

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

function worstCodesChart()
{
    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();

    //  alert(historyChartData);
    chart.dataProvider = codesChartData;
    chart.marginLeft = 10;
    chart.categoryField = "date";
    //chart.dataDateFormat = "YY-MM-DD";
    chart.addTitle('SCRAP HISTORY - ');

    // listen for "dataUpdated" event (fired when chart is inited) and call zoomChart method when it happens
    chart.addListener("dataUpdated", zoomChart);

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
   // categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
   // categoryAxis.minPeriod = "DD"; // our data is yearly, so we set minPeriod to YYYY
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
    //graph.lineColor = "#0569d1";
    graph.color= "#d1655d";
    //graph.negativeLineColor = "#637bb6"; // this line makes the graph to change color when it drops below 0
   // graph.bullet = "round";
    graph.bulletSize = 8;
    graph.bulletBorderColor = "#FFFFFF";
    graph.bulletBorderAlpha = 1;
    graph.bulletBorderThickness = 2;
    graph.lineThickness = 2;
    graph.valueField = "value";
    graph.labelText="[[value]]";
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
    chart.write("defectWorstCodes");
};


//drilldown COPDE CHART
chart.addListener("clickGraphItem", function(event) {
    if ('object' === typeof event.item.dataContext.months) {

        // set the monthly data for the clicked month
        event.chart.dataProvider = event.item.dataContext.months;

        // update the chart title
        event.chart.titles[0].text = event.item.dataContext.category + ' monthly data';

        // let's add a label to go back to yearly data
        event.chart.addLabel(
            35, 20,
            "< Go back to yearly",
            undefined,
            15,
            undefined,
            undefined,
            undefined,
            true,
            'javascript:resetChart();');

        // validate the new data and make the chart animate again
        event.chart.validateData();
        event.chart.animateAgain();
    }
});

// function which resets the chart back to yearly data
function resetChart() {
    chart.dataProvider = chartData;
    chart.titles[0].text = 'Yearly data';

    // remove the "Go back" label
    chart.allLabels = [];

    chart.validateData();
    chart.animateAgain();
}
