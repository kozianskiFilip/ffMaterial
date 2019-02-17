
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


    $.getJSON('http://localhost/node/', function(data) {
        for(var i=0; i< data.length; i++)
        {
           $('#inspectorsTab').append('<tr style="height:auto">' +
                                               '<td style="height:auto;padding:2px; white-space: normal;">'+(data[i].brakarz).toUpperCase()+'</td>' +
                                               '<td style="height:auto;padding:2px;font-size:xx-small;white-space: normal;" class="mdl-layout--large-screen-only">'+(data[i].stanowiska)+'</td>' +
                                               '<td class="inspectionCell '+(data[i].czasNieobecnosci > 15 ? 'negativeCellInspection': ( data[i].czasNieobecnosci > 5 ? 'neutralCellInspection' : 'positiveCellInspection'))+'" style="border-right-style: solid;height:auto;padding:2px;">'+(data[i].czasNieobecnosci).toFixed(2)+'</td>' +
                                               '<td style="height:auto;padding:2px;">'+data[i].wykonanie+'</td>' +
                                               '<td style="height:auto;padding:2px;border-right-style: solid;">'+data[i].ok+'</td>' +
                                               '<td style="height:auto;padding:2px;">'+(data[i].czasPrzerw).toFixed(2)+'</td>' +
                                               '<td style="height:auto;padding:2px;">'+(data[i].czasPrzerw5).toFixed(2)+'</td>' +
                                               '<td style="height:auto;padding:2px;border-right-style: solid;">'+(data[i].czasPrzerw10).toFixed(2)+'</td>' +
                                               '<td style="height:auto;padding:2px;">'+(data[i].h1)+'</td>' +
                                               '<td style="height:auto;padding:2px;">'+(data[i].h2)+'</td>' +
                                               '<td style="height:auto;padding:2px;">'+(data[i].h3)+'</td>' +
                                               '<td style="height:auto;padding:2px;">'+(data[i].h4)+'</td>' +
                                               '<td style="height:auto;padding:2px;">'+(data[i].h5)+'</td>' +
                                               '<td style="height:auto;padding:2px;">'+(data[i].h6)+'</td>' +
                                               '<td style="height:auto;padding:2px;">'+(data[i].h7)+'</td>' +
                                                '<td style="height:auto;padding:2px;">'+(data[i].h8)+'</td>' +
                                           '</tr>');
        }
    });


