<?php
/**
 * Created by PhpStorm.
 * User: AA62543
 * Date: 18-04-24
 * Time: 17:55
 */
error_reporting(0);
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

$stid = oci_parse($ffmes_connection,"select dstamp,pred,output,prod,inv_ok,inv_nok,bc3_output,bc3_pred,klasowanie,klasowanie_pred, fvm,fvm_pred,sort1,sort2, trimmers, 
                                            PLAN_EXCEL_1, PLAN_EXCEL_2, PLAN_EXCEL_3, PLAN_EXCEL_TOTAL,
                                            SKU, CT_DOBA,GT_DOBA, PLAN_GP3, ZDANIE, REPLACEMENT,OE,LABO from
                                            (
                                                select * from cur_pred where dstamp>sysdate-1/24 order by dstamp desc
                                            ) 
                                            left join 
                                                (select * from cur_schedule where obszar='TOTAL' and dt > sysdate-2) 
                                                on  dt=to_date(to_char(dstamp - interval '6' hour, 'yy-mm-dd'),'yy-mm-dd')
                                            left join
                                                (select   
                                                 sum(qty) zdanie,
                                                sum(case when suffix like '00' then qty else 0 end) REPLACEMENT,
                                                sum(case when suffix IN ('T', 'L') then qty else 0 end) LABO,
                                                sum(case when suffix NOT IN ('T', 'L', '00') then qty else 0 end) OE
                                                from  stk_pallet@sbs_real
                                                where substr(LABEL_NUM,1,8) in('".$stockDay."')  and ident='IN') on 1=1
                                            where rownum=1");
oci_execute($stid);

$dataArray=array('MAIN_TABLE' => array());
while ($row = oci_fetch_array($stid, OCI_BOTH))
{
    $dataArray['MAIN_TABLE']['CURING_PRED']=$row[1];
    $dataArray['MAIN_TABLE']['CURING_OUTPUT']=$row[2];
    $dataArray['MAIN_TABLE']['PRESS_PROD']=$row[3];
    $dataArray['MAIN_TABLE']['INV_OK']=$row[4];
    $dataArray['MAIN_TABLE']['INV_NOK']=$row[5];
    $dataArray['MAIN_TABLE']['BUILDING_OUTPUT']=$row[6];
    $dataArray['MAIN_TABLE']['BUILDING_FORECAST']=$row[7];
    $dataArray['MAIN_TABLE']['INSPECTION_OUTPUT']=$row[8];
    $dataArray['MAIN_TABLE']['INSPECTION_FORECAST']=$row[9];
    $dataArray['MAIN_TABLE']['FVM_OUTPUT']=$row[10];
    $dataArray['MAIN_TABLE']['FVM_FORECAST']=$row[11];
    $dataArray['MAIN_TABLE']['SORT1']=$row[12];
    $dataArray['MAIN_TABLE']['SORT2']=$row[13];
    $dataArray['MAIN_TABLE']['TRIMMERS']=$row[14];
    $dataArray['MAIN_TABLE']['PLAN1']=$row[15];
    $dataArray['MAIN_TABLE']['PLAN2']=$row[16];
    $dataArray['MAIN_TABLE']['PLAN3']=$row[17];
    $dataArray['MAIN_TABLE']['PLAN_DAY']=$row[18];
    $dataArray['MAIN_TABLE']['SKU']=$row[19];
    $dataArray['MAIN_TABLE']['GT_NO']=$row[21];
    $dataArray['MAIN_TABLE']['PLAN_GP3']=$row[22];
    $dataArray['MAIN_TABLE']['STOCK']=$row[23];
    $dataArray['MAIN_TABLE']['REPLACEMENT']=$row[24];
    $dataArray['MAIN_TABLE']['OE']=$row[25];
    $dataArray['MAIN_TABLE']['LABO']=$row[26];
}

$stid = oci_parse($ffmes_connection,"select to_char(dstamp,'hh24:mi'), pred, klasowanie_pred, fvm_pred from cur_pred where dstamp
                                            between 
                                            to_date('".$start." ".$start_hr.":00:00','yy-mm-dd hh24:mi:ss') and to_date('".$end." ".$end_hr.":00:00','yy-mm-dd hh24:mi:ss')
                                            order by dstamp");
oci_execute($stid);

$inspectionArray=array();
$curingArray=array();
while ($row = oci_fetch_array($stid, OCI_BOTH))
{
    //echo $row[0].'<br>';
    array_push($inspectionArray,array('TIMESTAMP' => $row[0], 'PRED' => $row[2]));
    array_push($curingArray,array('TIMESTAMP' => $row[0], 'PRED' => $row[1]));
}
$dataArray['MAIN_TABLE']['SUPPORT_CHARTS']['INSPECTION']=$inspectionArray;
$dataArray['MAIN_TABLE']['SUPPORT_CHARTS']['CURING']=$curingArray;
echo json_encode($dataArray,JSON_NUMERIC_CHECK);
oci_close($ffmes_connection);
?>