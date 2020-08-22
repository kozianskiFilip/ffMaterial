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
                                            SKU, CT_DOBA,GT_DOBA, PLAN_GP3, ZDANIE, REPLACEMENT,OE,LABO, h100_cur_output,h100_cur_pred,h100_ff_output,h100_ff_pred,h100_fvm,h100_fvm_pred,krupp_output,plt_output,trad_output,krupp_inv,plt_inv,trad_inv,krup_nok_inv,plt_nok_inv,trad_nok_inv,krupp_pred,plt_pred,trad_pred from
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
                                                from  stk_pallet@sbs
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
    $dataArray['MAIN_TABLE']['H100_CUR_OUTPUT']=$row[27];
    $dataArray['MAIN_TABLE']['H100_CUR_PRED']=$row[28];
    $dataArray['MAIN_TABLE']['H100_FF_OUTPUT']=$row[29];
    $dataArray['MAIN_TABLE']['H100_FF_PRED']=$row[30];
    $dataArray['MAIN_TABLE']['H100_FVM']=$row[31];
    $dataArray['MAIN_TABLE']['H100_FVM_PRED']=$row[32];

    $dataArray['MAIN_TABLE']['KRUPP_OUTPUT'] = $row[33];
    $dataArray['MAIN_TABLE']['PLT_OUTPUT'] = $row[34];
    $dataArray['MAIN_TABLE']['TRAD_OUTPUT'] = $row[35];

    $dataArray['MAIN_TABLE']['KRUPP_INV_OK'] = $row[36];
    $dataArray['MAIN_TABLE']['PLT_INV_OK'] = $row[37];
    $dataArray['MAIN_TABLE']['TRAD_INV_OK'] = $row[38];

    $dataArray['MAIN_TABLE']['KRUPP_INV_NOK'] = $row[39];
    $dataArray['MAIN_TABLE']['PLT_INV_NOK'] = $row[40];
    $dataArray['MAIN_TABLE']['TRAD_INV_NOK'] = $row[41];

    $dataArray['MAIN_TABLE']['KRUPP_PRED'] = $row[42];
    $dataArray['MAIN_TABLE']['PLT_PRED'] = $row[43];
    $dataArray['MAIN_TABLE']['TRAD_PRED'] = $row[44];

}

$stid = oci_parse($ffmes_connection, "select to_char(dstamp,'hh24:mi'), pred, klasowanie_pred, fvm_pred from cur_pred where dstamp
                                                between 
                                                to_date('" . $start . " " . $start_hr . ":00:00','yy-mm-dd hh24:mi:ss') and to_date('" . $end . " " . $end_hr . ":00:00','yy-mm-dd hh24:mi:ss')
                                                order by dstamp");
oci_execute($stid);

$inspectionArray = array();
$curingArray = array();
while ($row = oci_fetch_array($stid, OCI_BOTH)) {
    //echo $row[0].'<br>';

    //  $prepInventoryArray[$row[0]]=array('OK_QTY' => $row[1],'NOK_QTY' => $row[2],'OK_QTY_PCS' => $row[3],'NOK_QTY_PCS' => $row[4],'OK_HALF' => $row[5], 'OK_AGED' => $row[6]);
    array_push($inspectionArray, array('TIMESTAMP' => $row[0], 'PRED' => $row[2]));
    array_push($curingArray, array('TIMESTAMP' => $row[0], 'PRED' => $row[1]));
}

//PROLAG INVENTORY
$prepInventoryArray = array();
$stid = oci_parse($ffmes_connection, "select
                                                    mat_group, sum(case when qa_attr=1 then qty else 0 end) OK_QTY,sum(case when qa_attr=0 then qty else 0 end) NOK_QTY, sum(case when qa_attr=1 then 1 else 0 end) OK_QTY_PCS, sum(case when qa_attr=0 then 1 else 0 end) NOK_QTY_PCS,
                                                    sum(case when qa_attr=1 and qty<0.9*max_QTY then 1 else 0 end) OK_HALFS_PCS, sum(case when qa_attr=1 and sysdate>min_usage_date then 1 else 0 end) OK_AGED
                                                    from prolag_prep_inv@prolag where prod_machine not like '%MRT%' and prod_machine !='QUADRO' and prod_machine !='FISHER' group by mat_group");
oci_execute($stid);
while ($row = oci_fetch_array($stid, OCI_BOTH)) {
    array_push($prepInventoryArray, array('ELEMENT' => $row[0], 'OK_QTY' => $row[1], 'NOK_QTY' => $row[2], 'OK_QTY_PCS' => $row[3], 'NOK_QTY_PCS' => $row[4], 'OK_HALF' => $row[5], 'OK_AGED' => $row[6]));
    // $prepInventoryArray[$row[0]]=array('OK_QTY' => $row[1],'NOK_QTY' => $row[2],'OK_QTY_PCS' => $row[3],'NOK_QTY_PCS' => $row[4],'OK_HALF' => $row[5], 'OK_AGED' => $row[6]);
}

$dataArray['PREP'] = $prepInventoryArray;
$dataArray['MAIN_TABLE']['SUPPORT_CHARTS']['INSPECTION'] = $inspectionArray;
$dataArray['MAIN_TABLE']['SUPPORT_CHARTS']['CURING'] = $curingArray;
echo json_encode($dataArray, JSON_NUMERIC_CHECK);
oci_close($ffmes_connection);
?>