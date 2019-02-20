
var adr='';
function fetchInspection()
{
    var now=moment();
    if (now.hour() >= 6 && now.hour() < 14) {

        startDtime = moment('06:00:00', 'HH:mm:ss');
        endDtime = moment('14:00:00', 'HH:mm:ss');
        // console.log(startDtime.format('YY-MM-DD HH:mm:ss') + ' - ' + endDtime.format('YY-MM-DD HH:mm:ss'));
    }
    if (now.hour() >= 14 && now.hour() < 22) {

        startDtime = moment('14:00:00', 'HH:mm:ss');
        endDtime = moment('22:00:00', 'HH:mm:ss');
    }
    if (now.hour() >= 22) {

        startDtime = moment('22:00:00', 'HH:mm:ss');
        endDtime.add(1, 'd');
        endDtime = moment('06:00:00', 'HH:mm:ss');
    }
    if (now.hour() < 6) {
        startDtime.subtract(1, 'd');
        startDtime = moment('22:00:00', 'HH:mm:ss');
        endDtime = moment('06:00:00', 'HH:mm:ss');
    }

    var duration = moment.duration(now.diff(startDtime)).as('minutes')+10;

    $('#inspectorsTab').html('');
    var l=0;
    $.getJSON('http://localhost/node/', function(data) {
        for(var i=0; i< data.length; i++)
        {
            adr = data[i].id;
            while(l<2)
            {
                //alert(adr);
              // window.open('inspectorDetails.html?inspector='+data[i].id);
                l++;
            }

           // alert(adr);
            $('#inspectorsTab').append('<tr style="height:auto">' +
                '<td onclick="window.open(\'inspectorDetails.html?inspector=\'+adr);" style="height:auto;padding:2px; white-space: normal;">'+(data[i].brakarz).toUpperCase()+'</td>' +
                '<td style="height:auto;padding:2px;font-size:xx-small;white-space: normal;" class="mdl-layout--large-screen-only">'+(data[i].stanowiska)+'</td>' +
                '<td class="inspectionCell '+(data[i].czasNieobecnosci > 15 ? 'negativeCellInspection': ( data[i].czasNieobecnosci > 5 ? 'neutralCellInspection' : 'positiveCellInspection'))+'" style="border-right-style: solid;height:auto;padding:2px;">'+(data[i].czasNieobecnosci).toFixed(2)+'</td>' +
                '<td class="'+((data[i].wykonanie/duration*480) >= 705 ? 'positiveCell' : ( (data[i].wykonanie/duration*480) >= 685 ? 'neutralCell': 'negativeCell'))+'" style="height:auto;padding:2px;">'+data[i].wykonanie+'('+(data[i].wykonanie/duration*480).toFixed(0)+')</td>' +
                '<td style="height:auto;padding:2px;">'+(data[i].czasPrzerw).toFixed(2)+'</td>' +
                '<td style="height:auto;padding:2px;">'+(data[i].czasPrzerw5).toFixed(2)+'</td>' +
                '<td style="height:auto;padding:2px;border-right-style: solid;">'+(data[i].czasPrzerw10).toFixed(2)+'</td>' +
                '<td style="height:auto;padding:2px;font-weight:bold; '+((data[i].h1) == 0 ? ('') : ((data[i].h1) >= 95 ? ('color:#2e7d32') : ((data[i].h1) >= 90 ? ('color:#66bb6a;') : ((data[i].h1) >= 87 ? ('color:#ffeb3b;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;') : ((data[i].h1) >= 87 ? ('color:#fb8c00;') : ('color:#d32f2f;') ) ))))+'">'+(data[i].h1)+'</td>' +
                '<td style="height:auto;padding:2px;font-weight:bold; '+((data[i].h2) == 0 ? ('') : ((data[i].h2) >= 95 ? ('color:#2e7d32') : ((data[i].h2) >= 90 ? ('color:#66bb6a;') : ((data[i].h2) >= 87 ? ('color:#ffeb3b;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;') : ((data[i].h2) >= 87 ? ('color:#fb8c00;') : ('color:#d32f2f;') ) ))))+'">'+(data[i].h2)+'</td>' +
                '<td style="height:auto;padding:2px;font-weight:bold; '+((data[i].h3) == 0 ? ('') : ((data[i].h3) >= 95 ? ('color:#2e7d32') : ((data[i].h3) >= 90 ? ('color:#66bb6a;') : ((data[i].h3) >= 87 ? ('color:#ffeb3b;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;') : ((data[i].h3) >= 87 ? ('color:#fb8c00;') : ('color:#d32f2f;') ) ))))+'">'+(data[i].h3)+'</td>' +
                '<td style="height:auto;padding:2px;font-weight:bold; '+((data[i].h4) == 0 ? ('') : ((data[i].h4) >= 95 ? ('color:#2e7d32') : ((data[i].h4) >= 90 ? ('color:#66bb6a;') : ((data[i].h4) >= 87 ? ('color:#ffeb3b;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;') : ((data[i].h4) >= 87 ? ('color:#fb8c00;') : ('color:#d32f2f;') ) ))))+'">'+(data[i].h4)+'</td>' +
                '<td style="height:auto;padding:2px;font-weight:bold; '+((data[i].h5) == 0 ? ('') : ((data[i].h5) >= 95 ? ('color:#2e7d32') : ((data[i].h5) >= 90 ? ('color:#66bb6a;') : ((data[i].h5) >= 87 ? ('color:#ffeb3b;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;') : ((data[i].h5) >= 87 ? ('color:#fb8c00;') : ('color:#d32f2f;') ) ))))+'">'+(data[i].h5)+'</td>' +
                '<td style="height:auto;padding:2px;font-weight:bold; '+((data[i].h6) == 0 ? ('') : ((data[i].h6) >= 95 ? ('color:#2e7d32') : ((data[i].h6) >= 90 ? ('color:#66bb6a;') : ((data[i].h6) >= 87 ? ('color:#ffeb3b;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;') : ((data[i].h6) >= 87 ? ('color:#fb8c00;') : ('color:#d32f2f;') ) ))))+'">'+(data[i].h6)+'</td>' +
                '<td style="height:auto;padding:2px;font-weight:bold; '+((data[i].h7) == 0 ? ('') : ((data[i].h7) >= 95 ? ('color:#2e7d32') : ((data[i].h7) >= 90 ? ('color:#66bb6a;') : ((data[i].h7) >= 87 ? ('color:#ffeb3b;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;') : ((data[i].h7) >= 87 ? ('color:#fb8c00;') : ('color:#d32f2f;') ) ))))+'">'+(data[i].h7)+'</td>' +
                '<td style="height:auto;padding:2px;font-weight:bold; '+((data[i].h8) == 0 ? ('') : ((data[i].h8) >= 95 ? ('color:#2e7d32') : ((data[i].h8) >= 90 ? ('color:#66bb6a;') : ((data[i].h8) >= 87 ? ('color:#ffeb3b;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;') : ((data[i].h8) >= 87 ? ('color:#fb8c00;') : ('color:#d32f2f;') ) ))))+'">'+(data[i].h8)+'</td>' +
                '</tr>');

        }
        $('#headerInspection').html('WYDAJNOSC KLASOWANIA, AKTUALIZACJA: '+now.format('YY-MM-DD HH:mm:ss'));
    });
}

fetchInspection();


