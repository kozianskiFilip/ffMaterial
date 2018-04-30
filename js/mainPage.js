var chartData;
var buildingScraps;
var curingScraps;
var uniScraps;

var scrapInterval;
$(document).ready(function() {

    $.getJSON('php/getScraps.php', function(data)
    {  //alert('xxx');
       chartData=data.DANE;
       buildingScraps=data.BUILDING.qty;
       curingScraps=data.CURING.qty;
       uniScraps=data.UNI.qty;
       scrapsChart();
       updateDashboard()
    });
});


function scrapsChart() {
        // SERIAL CHART
        chart = new AmCharts.AmSerialChart();
        chart.dataProvider = chartData;
        chart.categoryField = "defectNumber";
        chart.startDuration = 1;
        chart.addTitle("TOTAL: "+(buildingScraps+uniScraps+curingScraps)+", CURING: "+curingScraps+" / BUILDING: "+buildingScraps+" / UNI: "+uniScraps+ " "+moment().format('HH:mm:ss'));

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.labelRotation = 90;
        categoryAxis.gridPosition = "start";


        // GRAPH
        var graph = new AmCharts.AmGraph();

        graph.valueField = "qty";
        graph.balloonText = "[[desc]]: </br><b>[[text]]</b>";
        graph.labelText="[[qty]]";
        graph.type = "column";
        graph.lineAlpha = 0;
        graph.fillAlphas = 1;
        graph.colorField= "color";
        chart.addGraph(graph);


        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorAlpha = 0;
        chartCursor.zoomable = false;
        chartCursor.categoryBalloonEnabled = false;
        chart.addChartCursor(chartCursor);

        chart.addListener('clickGraphItem', function(event){

        });
        chart.creditsPosition = "top-right";
        chart.write("scrapChart");

}

// function which resets the chart back to yearly data
function resetChart()
{
    chart.dataProvider = chartData;
    chart.titles[0].text = "TOTAL "+categoryMode+" SCRAPS BY "+ updateMode + " - "+totalScraps;
    // remove the "Go back" label
    chart.allLabels = [];
    chart.marginBottom=120;
    chart.validateData();
    chart.animateAgain();
}

function updateDashboard()
{
    //scrap chart update
    scrapInterval=setInterval(function(){
        $.getJSON('php/getScraps.php', function(data)
        {  //alert('xxx');
            chartData=data.DANE;
            buildingScraps=data.BUILDING.qty;
            curingScraps=data.CURING.qty;
            uniScraps=data.UNI.qty;
            chart.validateData();
            chart.animateAgain();
           // alert(moment().format('MMMM Do YYYY, h:mm:ss a'));
           // chart.valueAxes[0].title = "Title #2";
        });
    }, 300000) ;
}