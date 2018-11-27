
AmCharts.clickTimeout = 0; // this will hold setTimeout reference
AmCharts.lastClick = 0; // last click timestamp
AmCharts.doubleClickDuration = 300;

var chartData;
var inspectionChartData;
var curingChartData;

var buildingScraps;
var curingScraps;
var uniScraps;
var shift;
var shiftPlan;

var tableInterval;
var fvmInterval;

var scrapChartRefreshMode=0; // DOMYŚLNIE DANE W WYKRESIE PREZENTUJĄ BIEŻĄCĄ DOBĘ



//AKCJE DO PODWÓJNEGO/POJEDYNCZEGO KLIKNIECIA NA GLOWNY WYKRES
{
    AmCharts.doSingleClick = function (event) {
       //alert('single');
    }

    AmCharts.doDoubleClick = function (event) {
       // alert(event.item.dataContext.defectNumber);
        window.open('http://172.22.8.102/ff/dashboard/subpages/defectDetails.html?defect='+event.item.dataContext.defectNumber,'XXX', "width=600,height=800,left=550,top=250");
    }

    // create click handler
    AmCharts.myClickHandler = function (event) {
        var ts = (new Date()).getTime();
        if ((ts - AmCharts.lastClick) < AmCharts.doubleClickDuration) {
            // it's double click!
            // let's clear the timeout so the "click" event does not fire
            if (AmCharts.clickTimeout) {
                clearTimeout(AmCharts.clickTimeout);
            }

            // reset last click
            AmCharts.lastClick = 0;

            // now let's do whatever we want to do on double-click
            AmCharts.doDoubleClick(event);
        }
        else {
            // single click!
            // let's delay it to see if a second click will come through
            AmCharts.clickTimeout = setTimeout(function () {
                // let's do whatever we want to do on single click
                AmCharts.doSingleClick(event);
            }, AmCharts.doubleClickDuration);
        }
        AmCharts.lastClick = ts;
    }
}
var scrapInterval;
$(document).ready(function() {

    //SCRAPS CHART INIT/UPDATE
    $.getJSON('php/getScraps.php?mode='+scrapChartRefreshMode, function(data)
    {  //alert('xxx');
       chartData=data.DANE;
       buildingScraps=data.BUILDING.qty;
       curingScraps=data.CURING.qty;
       uniScraps=data.UNI.qty;
       scrapsChart();
       updateDashboard();
    });

    //MAIN TABLE INIT/UPDATE



    statsInterval = setInterval(function () {
        $.getJSON('php/getForecast.php', function(data)
        {
            shift=moment().format('HH');

            if(shift >=6 && shift <14)
                shiftPlan=data.MAIN_TABLE.PLAN1;
            else if (shift >=14 && shift <22)
                shiftPlan=data.MAIN_TABLE.PLAN2;
            else
                shiftPlan=data.MAIN_TABLE.PLAN3;

            $('#curing').html("<span class='mdl-layout--large-screen-only'>"+data.MAIN_TABLE.CURING_OUTPUT+" /</span> "+data.MAIN_TABLE.CURING_PRED +"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.CURING_PRED-shiftPlan)+")</span>");
            $('#inspection').html("<span class='mdl-layout--large-screen-only'>"+data.MAIN_TABLE.INSPECTION_OUTPUT+" /</span> "+data.MAIN_TABLE.INSPECTION_FORECAST+"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.INSPECTION_FORECAST-data.MAIN_TABLE.CURING_PRED)+")</span>");
            $('#fvm').html("<span class='mdl-layout--large-screen-only'>"+data.MAIN_TABLE.FVM_OUTPUT+" /</span> "+data.MAIN_TABLE.FVM_FORECAST+"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.FVM_FORECAST-data.MAIN_TABLE.CURING_PRED)+")</span>");
            $('#stock').html("<span class='mdl-layout--large-screen-only'>"+data.MAIN_TABLE.STOCK+"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.STOCK-data.MAIN_TABLE.LABO)+")</span>");

            inspectionChartData=data.MAIN_TABLE.SUPPORT_CHARTS.INSPECTION;
            inspectionChart();
            curingChartData=data.MAIN_TABLE.SUPPORT_CHARTS.CURING;
            curingChart();
        });
        },30000);


});

function mainTableFill()
{
    $.getJSON('php/getForecast.php', function(data)
    {
        shift=moment().format('HH');

        if(shift >=6 && shift <14)
            shiftPlan=data.MAIN_TABLE.PLAN1;
        else if (shift >=14 && shift <22)
            shiftPlan=data.MAIN_TABLE.PLAN2;
        else
            shiftPlan=data.MAIN_TABLE.PLAN3;

        $('#curing').html("<span class='mdl-layout--large-screen-only'>"+data.MAIN_TABLE.CURING_OUTPUT+" /</span> "+data.MAIN_TABLE.CURING_PRED +"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.CURING_PRED-shiftPlan)+")</span>");
        $('#building').html("<span class='mdl-layout--large-screen-only'>"+data.MAIN_TABLE.BUILDING_OUTPUT+" /</span> "+data.MAIN_TABLE.BUILDING_FORECAST +"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.BUILDING_FORECAST-data.MAIN_TABLE.CURING_PRED)+")</span>");
        $('#inventory').html("<span class=''>"+data.MAIN_TABLE.INV_OK +"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.INV_NOK)+")</span>");
        $('#inspection').html("<span class='mdl-layout--large-screen-only'>"+data.MAIN_TABLE.INSPECTION_OUTPUT+" /</span> "+data.MAIN_TABLE.INSPECTION_FORECAST+"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.INSPECTION_FORECAST-data.MAIN_TABLE.CURING_PRED)+")</span>");
        $('#fvm').html("<span class='mdl-layout--large-screen-only'>"+data.MAIN_TABLE.FVM_OUTPUT+" /</span> "+data.MAIN_TABLE.FVM_FORECAST+"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.FVM_FORECAST-data.MAIN_TABLE.CURING_PRED)+")</span>");
        $('#stock').html("<span class=''>"+data.MAIN_TABLE.STOCK+"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.STOCK-data.MAIN_TABLE.LABO)+")</span>");

        if((data.MAIN_TABLE.CURING_PRED-shiftPlan>0))
            $('#curing').removeClass().addClass('positiveCell');

        if((data.MAIN_TABLE.BUILDING_FORECAST > data.MAIN_TABLE.CURING_PRED))
            $('#building').removeClass().addClass('positiveCell');

        if((data.MAIN_TABLE.FVM_FORECAST > data.MAIN_TABLE.CURING_PRED + 500))
            $('#fvm').removeClass().addClass('positiveCell');
        else if(data.MAIN_TABLE.FVM_FORECAST > data.MAIN_TABLE.CURING_PRED)
            $('#fvm').removeClass().addClass('neutralCell');
        else
            $('#fvm').removeClass().addClass('negativeCell');


        if((data.MAIN_TABLE.INSPECTION_FORECAST > data.MAIN_TABLE.CURING_PRED + 300))
            $('#inspection').removeClass().addClass('positiveCell');
        else if(data.MAIN_TABLE.INSPECTION_FORECAST > data.MAIN_TABLE.CURING_PRED)
            $('#inspection').removeClass().addClass('neutralCell');
        else
            $('#inspection').removeClass().addClass('negativeCell');





        inspectionChartData=data.MAIN_TABLE.SUPPORT_CHARTS.INSPECTION;
        inspectionChart();
        curingChartData=data.MAIN_TABLE.SUPPORT_CHARTS.CURING;
        curingChart();
    });
}

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

        chart.addListener('clickGraphItem', AmCharts.myClickHandler);
        chart.creditsPosition = "top-right";
        chart.write("scrapChart");

}

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
    fvmPerf();
    fvmInterval=setInterval(fvmPerf,300000);
    scrapInterval=setInterval(function(){
        $.getJSON('php/getScraps.php', function(data)
        {
            chartData=data.DANE;
            buildingScraps=data.BUILDING.qty;
            curingScraps=data.CURING.qty;
            uniScraps=data.UNI.qty;
            chart.titles[0].text="TOTAL: "+(buildingScraps+uniScraps+curingScraps)+", CURING: "+curingScraps+" / BUILDING: "+buildingScraps+" / UNI: "+uniScraps+ " "+moment().format('HH:mm:ss');
            chart.validateData();
            chart.animateAgain();
        });
    }, 300000) ;

    mainTableFill();
    tableInterval=setInterval(mainTableFill, 300000) ;
}


function inspectionChart() {
    chartInspection = new AmCharts.AmSerialChart();
    chartInspection.dataProvider = inspectionChartData;
    chartInspection.autoMargins = false;
    chartInspection.marginTop = 0;
    chartInspection.marginBottom = 0;
    chartInspection.marginLeft = 0;
    chartInspection.marginRight = 0;
    chartInspection.categoryField="TIMESTAMP;"

    // AXES
    // category
    var categoryAxis = chartInspection.categoryAxis;

    // value
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.axisAlpha = 0;
    valueAxis.inside = true;
    valueAxis.dashLength = 3;
    chartInspection.addValueAxis(valueAxis);

    // GRAPH
    graph = new AmCharts.AmGraph();
    graph.type = "smoothedLine"; // this line makes the graph smoothed line.
    graph.lineColor = "#4e9cd1";
    graph.negativeLineColor = "#b63733"; // this line makes the graph to change color when it drops below 0
    graph.lineThickness = 2;
    graph.valueField = "PRED";
    graph.balloonText = "[[TIMESTAMP]]:<br><b><span style='font-size:14px;'>[[value]]</span></b>";
    chartInspection.addGraph(graph);

    // CURSOR
    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorAlpha = 0;
    chartCursor.cursorPosition = "mouse";
    chartCursor.categoryBalloonDateFormat = "YYYY";
    chartInspection.addChartCursor(chartCursor);

    // SCROLLBAR
    var chartScrollbar = new AmCharts.ChartScrollbar();
    chartInspection.addChartScrollbar(chartScrollbar);

    chartInspection.creditsPosition = "bottom-right";
    // WRITE
    chartInspection.write("inspectionChart");
}

function curingChart() {
    chartCuring = new AmCharts.AmSerialChart();
    chartCuring.dataProvider = curingChartData;
    chartCuring.labelsEnabled = false;
    chartCuring.autoMargins = false;
    chartCuring.marginTop = 0;
    chartCuring.marginBottom = 0;
    chartCuring.marginLeft = 0;
    chartCuring.marginRight = 0;

    // AXES
    // category
    var categoryAxis = chartCuring.categoryAxis;

    // value
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.axisAlpha = 0;
    valueAxis.inside = true;
    valueAxis.dashLength = 3;
    chartCuring.addValueAxis(valueAxis);

    // GRAPH
    graph = new AmCharts.AmGraph();
    graph.type = "smoothedLine"; // this line makes the graph smoothed line.
    graph.lineColor = "#25d12f";
    graph.negativeLineColor = "#b63733"; // this line makes the graph to change color when it drops below 0
    graph.lineThickness = 2;
    graph.valueField = "PRED";
    graph.balloonText = "[[TIMESTAMP]]:<br><b><span style='font-size:14px;'>[[value]]</span></b>";
    chartCuring.addGraph(graph);

    // CURSOR
    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorAlpha = 0;
    chartCursor.cursorPosition = "mouse";
    chartCursor.categoryBalloonDateFormat = "YYYY";
    chartCuring.addChartCursor(chartCursor);

    // SCROLLBAR
    var chartScrollbar = new AmCharts.ChartScrollbar();
    chartCuring.addChartScrollbar(chartScrollbar);

    chartCuring.creditsPosition = "bottom-right";
    // WRITE
    chartCuring.write("curingChart");
}

function fvmPerf()
{
    $.getJSON('php/getFvmPerformance.php', function(dataTotal)
    {
       // alert(data[2]['MACHINE']);
        var data = dataTotal.SCORES;
        for(var iterator in data)
        {
            //alert(data[iterator].MACHINE);
            var shiftEnd = moment(data[iterator].SHIFT_END,'YY-MM-DD HH:mm:ss');
            var time= (shiftEnd - moment())/1000/60;

            var pred = Math.round((data[iterator].OUTPUT/(480-time))*480);

            $('#'+data[iterator].MACHINE+'score').html('<span style="font-size:85%;">'+data[iterator].OUTPUT + '</span></br><span style="font-size:110%;font-weight: bold;">' + pred + '</span></br>' + '<span style="font-size:70%;">'+data[iterator].ACTUAL_RIM+'</span>');
            $('#'+data[iterator].MACHINE+'rim').html(data[iterator].ACTUAL_RIM);

            var tempHtml = '';
            tempHtml+=data[iterator].MACHINE + '-'+data[iterator].OUTPUT+'('+data[iterator].DISTINCT_OUTPUT+')</br>OE/RPL/REN/SCP  SG_OE/SG_RE</br>'+data[iterator].OE+'/'+data[iterator].REPLACEMENT+'/'+data[iterator].RENEWAL+'/'+data[iterator].SCRAP+' '+data[iterator].SG_OE+'/'+data[iterator].SG_RE+'</br></br>';
            var lCnt = 1; //LICZNIK ASORTYMENTÓW
            for(var iterator2 in data[iterator].CODES)
            {
                tempHtml += '<span style="text-align:left;align-content:left;color:'+(data[iterator].CODES[iterator2].MARKET == 'OE' ? 'yellow' : '' )+';"><b>'+lCnt+'.'+data[iterator].CODES[iterator2].CODE+'</b> '+data[iterator].CODES[iterator2].SIZE + ' '+data[iterator].CODES[iterator2].BRAND + ' ' + ' ' + data[iterator].CODES[iterator2].OUTPUT + '/' + data[iterator].CODES[iterator2].DISTINCT_OUTPUT + ' ' + data[iterator].CODES[iterator2].OE + '/' + data[iterator].CODES[iterator2].REPLACEMENT + '/<span style="color:#62f1f3;text-decoration: underline;">'+ data[iterator].CODES[iterator2].RENEWAL +'</span>/<span style="color:#f44336;text-decoration: underline;">'+ data[iterator].CODES[iterator2].SCRAP +'</span> '+ data[iterator].CODES[iterator2].SG_OE +'/'+ data[iterator].CODES[iterator2].SG_RE+'   '+data[iterator].CODES[iterator2].CODE_RIM+'</span></br>';
                lCnt++;
                //$('#'+data[iterator].MACHINE+'tooltip').html(data[iterator].CODES[iterator2].SIZE + ' '+data[iterator].CODES[iterator2].BRAND + ' ' + data[iterator].CODES[iterator2].MARKET + ' ' + data[iterator].CODES[iterator2].OUTPUT + '/' + data[iterator].CODES[iterator2].DISTINCT_OUTPUT + ' ' + data[iterator].CODES[iterator2].OE + '/' + data[iterator].CODES[iterator2].REPLACEMENT + '/');
            }
            $('#'+data[iterator].MACHINE+'tooltip').html(tempHtml);
        }

        data = dataTotal.STATUS;
        for(iterator in data)
        {
            $('#'+data[iterator].MACHINE+'status').html(data[iterator].STATUS+'</br>'+data[iterator].MIN+'min </br> <span style=" font-weight:bold; font-size:90%;color:'+(data[iterator].DOWNTIME > 50 ? '#751f1f' : (data[iterator].DOWNTIME > 50 ? '#ffeb3b' : '') )+'">'+data[iterator].DOWNTIME+'</span>');

            if(data[iterator].STATUS != 100 && data[iterator].MIN >15)
                $('#'+data[iterator].MACHINE+'status').removeClass().addClass('negativeCell');
            else if (data[iterator].STATUS != 100 && data[iterator].MIN >2)
                $('#'+data[iterator].MACHINE+'status').removeClass().addClass('neutralCell');
            else
                $('#'+data[iterator].MACHINE+'status').removeClass().addClass('positiveCell');


        }
    }
    );
};