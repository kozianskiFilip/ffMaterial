<?php
/**
 * Created by PhpStorm.
 * User: AA62543
 * Date: 18-10-11
 * Time: 12:24
 */
$ffmes_connection = oci_connect('minimes_ff_wbr', 'Baza0racl3appl1cs', '172.22.8.47/ORA');
$h=date('H');


$scraps_table='';
$start_hr;
$end_hr;
$zmiana=1;

if($h>=6 && $h<14)
{
    $start=new DateTime();
    $stockDay=date_format ( $start, 'Ymd');
    $start=date_format ( $start, 'Y-m-d');

    $end=new DateTime();
    $end=date_format ( $end, 'y-m-d');

    $start_hr=06;
    $end_hr=14;
    $zmiana=1;
}

if($h>=14 && $h<22)
{

    $start=new DateTime();
    $stockDay=date_format ( $start, 'Ymd');
    $start=date_format ( $start, 'Y-m-d');

    $end=new DateTime();
    $end=date_format ( $end, 'y-m-d');
    $zmiana=2;
    $start_hr=14;
    $end_hr=22;
}

if($h>=22 || $h<6)
{
    if($h>=22)
    {
        $end=new DateTime();
        $end->add(new DateInterval('P1D'));
        $end=date_format ( $end, 'y-m-d');

        $start=new DateTime();
        $stockDay=date_format ( $start, 'Ymd');
        $start=date_format ( $start, 'y-m-d');
    }
    if($h<=6)
    {
        $start=new DateTime();
        $start->sub(new DateInterval('P1D'));
        $stockDay=date_format ( $start, 'Ymd');
        $start=date_format ( $start, 'y-m-d');

        $end=new DateTime();
        $end=date_format ( $end, 'y-m-d');
    }
    $start_hr=22;
    $end_hr=6;
    $zmiana=3;
}


$stid = oci_parse($ffmes_connection,"select machine_id, downknd_id_plc, to_char(starttime,'yy-mm-dd hh24:mi:ss'),to_char(endtime,'yy-mm-dd hh24:mi:ss'),round((endtime-starttime) *24*60,2),downknd_id, case when downknd_id = 100 then '#5dff00' else '#ff0800' end color 
from
(
select machine_id, downknd_id, downknd_id_plc,
case when report_time < to_date('18-11-13 06:00:00','yy-mm-dd hh24:mi:ss') then to_date('18-11-13 06:00:00','yy-mm-dd hh24:mi:ss') else report_time end starttime,
nvl(downtime_end, sysdate) endtime
from downtime
where (report_time between to_date('18-11-13 06:00:00','yy-mm-dd hh24:mi:ss') and to_date('18-11-13 14:00:00','yy-mm-dd hh24:mi:ss')
or downtime_end between to_date('18-11-13 06:00:00','yy-mm-dd hh24:mi:ss') and to_date('18-11-13 14:00:00','yy-mm-dd hh24:mi:ss'))
and machine_id='FVM13'
order by report_time
)");
oci_execute($stid);

$data=array();
while ($row = oci_fetch_array($stid, OCI_BOTH))
{
    array_push($data,array("start" => $row[2],'end' => $row[3], 'task' => 'aaa' ,'color'=>$row[6]));
}

echo json_encode($data,JSON_NUMERIC_CHECK);
oci_close($ffmes_connection);