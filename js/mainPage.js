
AmCharts.clickTimeout = 0; // this will hold setTimeout reference
AmCharts.lastClick = 0; // last click timestamp
AmCharts.doubleClickDuration = 300;

var chartData;
var repairChartData;
var inspectionChartData;
var curingChartData;

var buildingScraps;
var curingScraps;
var uniScraps;
var shift;
var shiftPlan;
var repairTotal;
var massTotal;

var tableInterval;
var fvmInterval;
var scrapInterval;

var scrapChartRefreshMode=0; // DOMYŚLNIE DANE W WYKRESIE PREZENTUJĄ BIEŻĄCĄ DOBĘ
var scrapChartAutoUpdate = 1; //AUTOMATYCZNA AKTUALIZACJA

//update 4.03.2019 rozdzielenie H100 + WBR
var h100=1;
var wbr=1;

//AKCJE DO PODWÓJNEGO/POJEDYNCZEGO KLIKNIECIA NA GLOWNY WYKRES
{
    AmCharts.doSingleClick = function (event) {
       //alert('single');
    }

    AmCharts.doDoubleClick = function (event) {
       // alert(event.item.dataContext.defectNumber);
        window.open('http://172.22.8.102/ff/dashboard/subpages/defectDetails.html?defect='+event.item.dataContext.defectNumber+'&h100='+h100+'&wbr='+wbr,'XXX', "width=600,height=800,left=550,top=250");
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


$(document).ready(function() {
    //SCRAPS CHART INIT/UPDATE
    updateDashboard();
    //MAIN TABLE INIT/UPDATE
    // statsInterval = setInterval(function () {
    //     $.getJSON('php/getForecast.php', function(data)
    //     {
    //         shift=moment().format('HH');
    //
    //         if(shift >=6 && shift <14)
    //             shiftPlan=data.MAIN_TABLE.PLAN1;
    //         else if (shift >=14 && shift <22)
    //             shiftPlan=data.MAIN_TABLE.PLAN2;
    //         else
    //             shiftPlan=data.MAIN_TABLE.PLAN3;
    //
    //         $('#curing').html("<span class='mdl-layout--large-screen-only'>"+data.MAIN_TABLE.CURING_OUTPUT+" /</span> "+data.MAIN_TABLE.CURING_PRED +"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.CURING_PRED-shiftPlan)+")</span>");
    //         $('#inspection').html("<span class='mdl-layout--large-screen-only'>"+data.MAIN_TABLE.INSPECTION_OUTPUT+" /</span> "+data.MAIN_TABLE.INSPECTION_FORECAST+"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.INSPECTION_FORECAST-data.MAIN_TABLE.CURING_PRED)+")</span>");
    //         $('#fvm').html("<span class='mdl-layout--large-screen-only'>"+data.MAIN_TABLE.FVM_OUTPUT+" /</span> "+data.MAIN_TABLE.FVM_FORECAST+"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.FVM_FORECAST-data.MAIN_TABLE.CURING_PRED)+")</span>");
    //         $('#stock').html("<span class='mdl-layout--large-screen-only'>"+data.MAIN_TABLE.STOCK+"<br><span style='font-size: 80%'>("+(data.MAIN_TABLE.STOCK-data.MAIN_TABLE.LABO)+")</span>");
    //
    //         // inspectionChartData=data.MAIN_TABLE.SUPPORT_CHARTS.INSPECTION;
    //         // inspectionChart();
    //         // curingChartData=data.MAIN_TABLE.SUPPORT_CHARTS.CURING;
    //         // curingChart();
    //     });
    //     },300000);
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

        $('#curingTooltip').html('H100:</br>'+data.MAIN_TABLE.H100_CUR_OUTPUT+' / '+data.MAIN_TABLE.H100_CUR_PRED);
        $('#inspectionTooltip').html('H100:</br>'+data.MAIN_TABLE.H100_FF_OUTPUT+' / '+data.MAIN_TABLE.H100_FF_PRED);
        $('#fvmTooltip').html('H100:</br>'+data.MAIN_TABLE.H100_FVM+' / '+data.MAIN_TABLE.H100_FVM_PRED);
        $('#stockTooltip').html('PLAN ZDANIA: '+data.MAIN_TABLE.PLAN_GP3);

        $('#buildingTooltip').html('KRUPP: ' + data.MAIN_TABLE.KRUPP_OUTPUT + ' / ' + data.MAIN_TABLE.KRUPP_PRED + '</br>' + 'PLT: ' + data.MAIN_TABLE.PLT_OUTPUT + ' / ' + data.MAIN_TABLE.PLT_PRED + '</br>' + 'TRAD: ' + data.MAIN_TABLE.TRAD_OUTPUT + ' / ' + data.MAIN_TABLE.TRAD_PRED);
        $('#inventoryTooltip').html('KRUPP: ' + data.MAIN_TABLE.KRUPP_INV_OK + '(' + data.MAIN_TABLE.KRUPP_INV_NOK + ')</br>'
            + 'PLT: ' + data.MAIN_TABLE.PLT_INV_OK + '(' + data.MAIN_TABLE.PLT_INV_NOK + ')</br>'
            + 'TRAD: ' + data.MAIN_TABLE.TRAD_INV_OK + '(' + data.MAIN_TABLE.TRAD_INV_NOK + ')');


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


        //PREPARATION DATA
        var sidewalls = new Array("SV");
        var treads = new Array('SV');
        var breakers = new Array('SV');
        var beads = new Array('SV');
        var plys = new Array('SV');
        var olays = new Array('SV');

        var sidewallsOkQty = 0;
        var sidewallsNokQty = 0;
        var sidewallsOkQtyPcs = 0;
        var sidewallsNokQtyPcs = 0;
        var sidewallsOkHalfs = 0;
        var sidewallsOkAged = 0;

        var treadsOkQty = 0;
        var treadsNokQty = 0;
        var treadsOkQtyPcs = 0;
        var treadsNokQtyPcs = 0;
        var treadsOkHalfs = 0;
        var treadsOkAged = 0;

        var breakersOkQty = 0;
        var breakersNokQty = 0;
        var breakersOkQtyPcs = 0;
        var breakersNokQtyPcs = 0;
        var breakersOkHalfs = 0;
        var breakersOkAged = 0;

        var beadsOkQty = 0;
        var beadsNokQty = 0;
        var beadsOkQtyPcs = 0;
        var beadsNokQtyPcs = 0;
        var beadsOkHalfs = 0;
        var beadsOkAged = 0;

        var plysOkQty = 0;
        var plysNokQty = 0;
        var plysOkQtyPcs = 0;
        var plysNokQtyPcs = 0;
        var plysOkHalfs = 0;
        var plysOkAged = 0;

        var olaysOkQty = 0;
        var olaysNokQty = 0;
        var olaysOkQtyPcs = 0;
        var olaysNokQtyPcs = 0;
        var olaysOkHalfs = 0;
        var olaysOkAged = 0;

        var linersOkQty = 0;
        var linersNokQty = 0;
        var linersOkQtyPcs = 0;
        var linersNokQtyPcs = 0;
        var linersOkHalfs = 0;
        var linersOkAged = 0;

        var sidewallsTooltip = '';
        var treadsTooltip = '';
        var breakersTooltip = '';
        var beadsTooltip = '';
        var plysTooltip = '';
        var olaysTooltip = '';
        var linersTooltip = '';

        // alert(data.PREP.length);
        for (var cntr = 0; cntr < data.PREP.length; cntr++) {
            //BOKI
            if (data.PREP[cntr].ELEMENT == 'SV') {
                //alert('x');
                sidewallsOkQty += data.PREP[cntr].OK_QTY;
                sidewallsNokQty += data.PREP[cntr].NOK_QTY;
                sidewallsOkQtyPcs += data.PREP[cntr].OK_QTY_PCS;
                sidewallsNokQtyPcs += data.PREP[cntr].NOK_QTY_PCS;
                sidewallsOkHalfs += data.PREP[cntr].OK_HALF;
                sidewallsOkAged += data.PREP[cntr].OK_AGED;

                sidewallsTooltip += data.PREP[cntr].ELEMENT + ': ' + data.PREP[cntr].OK_QTY + ' (<span style="color: red;">' + data.PREP[cntr].NOK_QTY + '</span>)  ' + data.PREP[cntr].OK_QTY_PCS + '/<span style="color: red;">' + data.PREP[cntr].NOK_QTY_PCS + '</span>  <span style="color: yellow;">H:' + data.PREP[cntr].OK_HALF + '</span>  <span style="color:greenyellow;">A:' + data.PREP[cntr].OK_AGED + '</span> </br>';
            }

            //BIEZNIKI
            if (data.PREP[cntr].ELEMENT == 'TB' || data.PREP[cntr].ELEMENT == 'TL' || data.PREP[cntr].ELEMENT == 'TA') {
                //alert('x');
                treadsOkQty += data.PREP[cntr].OK_QTY;
                treadsNokQty += data.PREP[cntr].NOK_QTY;
                treadsOkQtyPcs += data.PREP[cntr].OK_QTY_PCS;
                treadsNokQtyPcs += data.PREP[cntr].NOK_QTY_PCS;
                treadsOkHalfs += data.PREP[cntr].OK_HALF;
                treadsOkAged += data.PREP[cntr].OK_AGED;

                treadsTooltip += data.PREP[cntr].ELEMENT + ': ' + data.PREP[cntr].OK_QTY + ' (<span style="color: red;">' + data.PREP[cntr].NOK_QTY + '</span>)  ' + data.PREP[cntr].OK_QTY_PCS + '/<span style="color: red;">' + data.PREP[cntr].NOK_QTY_PCS + '</span>  <span style="color: yellow;">H:' + data.PREP[cntr].OK_HALF + '</span>  <span style="color:greenyellow;">A:' + data.PREP[cntr].OK_AGED + '</span> </br>';
            }

            if (data.PREP[cntr].ELEMENT == 'BR' || data.PREP[cntr].ELEMENT == 'BL') {
                //alert('x');
                breakersOkQty += data.PREP[cntr].OK_QTY;
                breakersNokQty += data.PREP[cntr].NOK_QTY;
                breakersOkQtyPcs += data.PREP[cntr].OK_QTY_PCS;
                breakersNokQtyPcs += data.PREP[cntr].NOK_QTY_PCS;
                breakersOkHalfs += data.PREP[cntr].OK_HALF;
                breakersOkAged += data.PREP[cntr].OK_AGED;
                breakersTooltip += data.PREP[cntr].ELEMENT + ': ' + data.PREP[cntr].OK_QTY + ' (<span style="color: red;">' + data.PREP[cntr].NOK_QTY + '</span>)  ' + data.PREP[cntr].OK_QTY_PCS + '/<span style="color: red;">' + data.PREP[cntr].NOK_QTY_PCS + '</span>  <span style="color: yellow;">H:' + data.PREP[cntr].OK_HALF + '</span>  <span style="color:greenyellow;">A:' + data.PREP[cntr].OK_AGED + '</span> </br>';
            }

            //DRUTÓWKI
            if (data.PREP[cntr].ELEMENT == 'BS' || data.PREP[cntr].ELEMENT == 'BM') {
                //alert('x');
                beadsOkQty += data.PREP[cntr].OK_QTY;
                beadsNokQty += data.PREP[cntr].NOK_QTY;
                beadsOkQtyPcs += data.PREP[cntr].OK_QTY_PCS;
                beadsNokQtyPcs += data.PREP[cntr].NOK_QTY_PCS;
                beadsOkHalfs += data.PREP[cntr].OK_HALF;
                beadsOkAged += data.PREP[cntr].OK_AGED;

                beadsTooltip += data.PREP[cntr].ELEMENT + ': ' + data.PREP[cntr].OK_QTY + ' (<span style="color: red;">' + data.PREP[cntr].NOK_QTY + '</span>)  ' + data.PREP[cntr].OK_QTY_PCS + '/<span style="color: red;">' + data.PREP[cntr].NOK_QTY_PCS + '</span>  <span style="color: yellow;">H:' + data.PREP[cntr].OK_HALF + '</span>  <span style="color:greenyellow;">A:' + data.PREP[cntr].OK_AGED + '</span> </br>';
            }

            //OSNOWA
            if (data.PREP[cntr].ELEMENT == 'PA' || data.PREP[cntr].ELEMENT == 'PL' || data.PREP[cntr].ELEMENT == 'WL') {
                //alert('x');
                plysOkQty += data.PREP[cntr].OK_QTY;
                plysNokQty += data.PREP[cntr].NOK_QTY;
                plysOkQtyPcs += data.PREP[cntr].OK_QTY_PCS;
                plysNokQtyPcs += data.PREP[cntr].NOK_QTY_PCS;
                plysOkHalfs += data.PREP[cntr].OK_HALF;
                plysOkAged += data.PREP[cntr].OK_AGED;
                plysTooltip += data.PREP[cntr].ELEMENT + ': ' + data.PREP[cntr].OK_QTY + ' (<span style="color: red;">' + data.PREP[cntr].NOK_QTY + '</span>)  ' + data.PREP[cntr].OK_QTY_PCS + '/<span style="color: red;">' + data.PREP[cntr].NOK_QTY_PCS + '</span>  <span style="color: yellow;">H:' + data.PREP[cntr].OK_HALF + '</span>  <span style="color:greenyellow;">A:' + data.PREP[cntr].OK_AGED + '</span> </br>';
            }

            //KAPA
            if (data.PREP[cntr].ELEMENT == 'LN') {
                //alert('x');
                linersOkQty += data.PREP[cntr].OK_QTY;
                linersNokQty += data.PREP[cntr].NOK_QTY;
                linersOkQtyPcs += data.PREP[cntr].OK_QTY_PCS;
                linersNokQtyPcs += data.PREP[cntr].NOK_QTY_PCS;
                linersOkHalfs += data.PREP[cntr].OK_HALF;
                linersOkAged += data.PREP[cntr].OK_AGED;
                linersTooltip += data.PREP[cntr].ELEMENT + ': ' + data.PREP[cntr].OK_QTY + ' (<span style="color: red;">' + data.PREP[cntr].NOK_QTY + '</span>)  ' + data.PREP[cntr].OK_QTY_PCS + '/<span style="color: red;">' + data.PREP[cntr].NOK_QTY_PCS + '</span>  <span style="color: yellow;">H:' + data.PREP[cntr].OK_HALF + '</span>  <span style="color:greenyellow;">A:' + data.PREP[cntr].OK_AGED + '</span> </br>';
            }


            //EKRAN
            if (data.PREP[cntr].ELEMENT == 'SA') {
                //alert('x');
                olaysOkQty += data.PREP[cntr].OK_QTY;
                olaysNokQty += data.PREP[cntr].NOK_QTY;
                olaysOkQtyPcs += data.PREP[cntr].OK_QTY_PCS;
                olaysNokQtyPcs += data.PREP[cntr].NOK_QTY_PCS;
                olaysOkHalfs += data.PREP[cntr].OK_HALF;
                olaysOkAged += data.PREP[cntr].OK_AGED;
                olaysTooltip += data.PREP[cntr].ELEMENT + ': ' + data.PREP[cntr].OK_QTY + ' (<span style="color: red;">' + data.PREP[cntr].NOK_QTY + '</span>)  ' + data.PREP[cntr].OK_QTY_PCS + '/<span style="color: red;">' + data.PREP[cntr].NOK_QTY_PCS + '</span>  <span style="color: yellow;">H:' + data.PREP[cntr].OK_HALF + '</span>  <span style="color:greenyellow;">A:' + data.PREP[cntr].OK_AGED + '</span> </br>';
            }

        }


        $('#sidewallsInv').html(sidewallsOkQty.toFixed(0) + '</br><span style="font-size: 80%">(' + sidewallsNokQty.toFixed(0) + ')</span>');
        $('#sidewallsTooltip').html(sidewallsTooltip);

        $('#treadsInv').html(treadsOkQty.toFixed(0) + '</br><span style="font-size: 80%">(' + treadsNokQty.toFixed(0) + ')</span>');
        $('#treadsTooltip').html(treadsTooltip);

        $('#breakersInv').html(breakersOkQty.toFixed(0) + '</br><span style="font-size: 80%">(' + breakersNokQty.toFixed(0) + ')</span>');
        $('#breakersTooltip').html(breakersTooltip);

        $('#beadsInv').html(beadsOkQty.toFixed(0) + '</br><span style="font-size: 80%">(' + beadsNokQty.toFixed(0) + ')</span>');
        $('#beadsTooltip').html(beadsTooltip);

        $('#plysInv').html(plysOkQty.toFixed(0) + '</br><span style="font-size: 80%">(' + plysNokQty.toFixed(0) + ')</span>');
        $('#plysTooltip').html(plysTooltip);

        $('#linersInv').html(linersOkQty.toFixed(0) + '</br><span style="font-size: 80%">(' + linersNokQty.toFixed(0) + ')</span>');
        $('#linersTooltip').html(linersTooltip);

        $('#olaysInv').html(olaysOkQty.toFixed(0) + '</br><span style="font-size: 80%">(' + olaysNokQty.toFixed(0) + ')</span>');
        $('#olaysTooltip').html(olaysTooltip);

        if ((sidewallsOkQty > 72000))
            $('#sidewallsInv').removeClass().addClass('positiveCell');
        else if (sidewallsOkQty > 65000)
            $('#sidewallsInv').removeClass().addClass('neutralCell');
        else
            $('#sidewallsInv').removeClass().addClass('negativeCell');

        if ((treadsOkQty > 30000))
            $('#treadsInv').removeClass().addClass('positiveCell');
        else if (treadsOkQty > 27000)
            $('#treadsInv').removeClass().addClass('neutralCell');
        else
            $('#treadsInv').removeClass().addClass('negativeCell');

        if ((breakersOkQty > 83000))
            $('#breakersInv').removeClass().addClass('positiveCell');
        else if (breakersOkQty > 75000)
            $('#breakersInv').removeClass().addClass('neutralCell');
        else
            $('#breakersInv').removeClass().addClass('negativeCell');

        if ((beadsOkQty > 36000))
            $('#beadsInv').removeClass().addClass('positiveCell');
        else if (beadsOkQty > 30000)
            $('#beadsInv').removeClass().addClass('neutralCell');
        else
            $('#beadsInv').removeClass().addClass('negativeCell');

        if ((linersOkQtyPcs > 150))
            $('#linersInv').removeClass().addClass('positiveCell');
        else if (linersOkQtyPcs > 120)
            $('#linersInv').removeClass().addClass('neutralCell');
        else
            $('#linersInv').removeClass().addClass('negativeCell');

        if ((plysOkQtyPcs > 260))
            $('#plysInv').removeClass().addClass('positiveCell');
        else if (plysOkQtyPcs > 230)
            $('#plysInv').removeClass().addClass('neutralCell');
        else
            $('#plysInv').removeClass().addClass('negativeCell');


        // var sidewallOk=data.PREP.SV.OK_QTY + (typeof data.PREP.SX.OK_QTY != undefined ? data.PREP.SX.OK_QTY : 0) ;
        //alert(data.PREP.SX.OK_QTY);
        //$('#sidewallsInv').html('x');
        // alert('x');

        // $('#sidewallsInv').html(data.PREP[0].ELEMENT);

        var sidewallNok = 0;
        var sidewallOkQty = 0;

        // inspectionChartData=data.MAIN_TABLE.SUPPORT_CHARTS.INSPECTION;
        // inspectionChart();
        // curingChartData=data.MAIN_TABLE.SUPPORT_CHARTS.CURING;
        // curingChart();
    });
}

function scrapsChart() {
        // SERIAL CHART
        chart = new AmCharts.AmSerialChart();
        chart.dataProvider = chartData;
        chart.categoryField = "defectNumber";
        chart.startDuration = 1;
       // chart.addTitle("TOTAL: "+(buildingScraps+uniScraps+curingScraps)+", CURING: "+curingScraps+" / BUILDING: "+buildingScraps+" / UNI: "+uniScraps+ " "+moment().format('HH:mm:ss'));

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

function supportScrapsChart(supportChartData,supportChartContainer, chartTitle) {
    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = supportChartData;
    chart.categoryField = "defectNumber";
    chart.startDuration = 1;
    chart.addTitle(chartTitle+" "+moment().format('HH:mm:ss'));

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
    categoryAxis.labelRotation = 30;
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
    chart.write(supportChartContainer);
}

function updateDashboard()
{
    //scrap chart update
    fvmPerf();
    fvmInterval=setInterval(fvmPerf,300000);

    scrapsShift();
    scrapInterval=setInterval(scrapsShift,300000);

    mainTableFill();
    tableInterval=setInterval(mainTableFill, 300000) ;
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
        //SIZES STATS
        data = dataTotal.SIZES;
        $('#sizesHead').html('');
        $('#sizesCuring').html('');
        $('#sizesFVM').html('');

        $('#sizesHead').append('<th style="border-right: solid;color: #303f9f" class="mdl-layout--large-screen-only">ROZMIAR</th>');
        $('#sizesCuring').append('<td style="border-right: solid;color: #303f9f" class="mdl-layout--large-screen-only">WULKANIZACJA</td>');
        $('#sizesFVM').append('<td style="border-right: solid;color: #303f9f" class="mdl-layout--large-screen-only">FVM</td>');

        for(iterator in data)
        {
            $('#sizesHead').append('<th>'+(data[iterator].CALOWOSC)+'</th>');
            $('#sizesCuring').append('<td>'+(data[iterator].WULKANIZACJA_TOTAL)+'</br><span style="font-size:90%;">('+data[iterator].IL_FORM_TOTAL+')</span></td>');
            $('#sizesFVM').append('<td>'+(data[iterator].OPTYMIZERY_TOTAL)+'</td>');
        }
    }


    );
};

function scrapsShift()
{
    $.getJSON('php/getScraps.php?mode='+scrapChartRefreshMode+'&h100='+h100+'&wbr='+wbr, function(data)
    {
        var autoUpdateText='<span style="color: #1b7a00; text-underline-style: wave; ">AUTOUPDATE ON</span>';
        chartData=data.DANE;
        buildingScraps=data.BUILDING.qty;
        curingScraps=data.CURING.qty;
        uniScraps=data.UNI.qty;
        repairTotal=data.REPAIR;
        repairChartData=data.DANE_NAPRAWA;
        //alert(data.DANE);
        //$('#test').html(data.DANE[1]);
        //chart.dataProvider(chartData);
        scrapsChart();
        supportScrapsChart(repairChartData,'backupChart1', "NAPRAWY");
        supportScrapsChart(data.DANE_MASY,'backupChart2', "MASY");

        if(!scrapChartAutoUpdate)
            autoUpdateText='<span style="color: #9f0012; text-underline-style: wave; ">AUTOUPDATE OFF</span>';
       // alert(autoUpdateText);
            $("#scrapNumbers").html("TOTAL: "+(buildingScraps+uniScraps+curingScraps)+", CURING: "+curingScraps+" / BUILDING: "+buildingScraps+" / UNI: "+uniScraps+ "/ <span style='color: #1a237e'><u>>RPR: "+repairTotal+"</u></span> "+moment().format('HH:mm:ss')+" "+autoUpdateText);
        //chart.titles[0].text="TOTAL: "+(buildingScraps+uniScraps+curingScraps)+", CURING: "+curingScraps+" / BUILDING: "+buildingScraps+" / UNI: "+uniScraps+ " "+moment().format('HH:mm:ss');
        // chart.validateNow();
        // chart.validateData();
       // chart.animateAgain();
    });
}