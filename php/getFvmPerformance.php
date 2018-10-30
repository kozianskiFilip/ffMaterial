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

$stid = oci_parse($ffmes_connection,"select cmpname,uni_raw.master_code,desc_tsize,desc_ttype,desc_rimd||'x'||desc_psep,actual_rim,test_status,cus_rsp_desc, count(char_barcode),sum(last_processed),
                                            sum(case when final_rsp_desc = 'Renewal' and last_processed=1 then 1 else 0 end) renewal,
                                            sum(case when final_rsp_desc = 'Replacement' and last_processed=1 then 1 else 0 end) replacement,
                                            sum(case when final_rsp_desc = 'Scrap' and last_processed=1 then 1 else 0 end) scrap,
                                            sum(case when final_rsp_desc = 'OE' and last_processed=1 then 1 else 0 end) OE,
                                            sum(case when final_rsp_desc = 'SG OE' and last_processed=1 then 1 else 0 end) SG_OE,
                                            sum(case when final_rsp_desc = 'SG_RE' and last_processed=1 then 1 else 0 end) SG_RE
                                            from uni_raw@plda5l2 left join ggs_code@plda5l2 on uni_raw.master_code=ggs_code.master_code
                                            left join
                                            (
                                                select mach_name, desc_rimd||'x'||desc_psep actual_rim,test_status
                                                from mn3_test_status@plda5l2 left join ggs_code@plda5l2 on tire_code=ggs_code.master_code
                                                where last_processed=1
                                            ) on cmpname=mach_name
                                            where dstamp between to_date(to_char(sysdate,'yy-mm-dd') || ' 06:00:00','yy-mm-dd hh24:mi:ss') and to_date(to_char(sysdate,'yy-mm-dd') || ' 14:00:00','yy-mm-dd hh24:mi:ss')
                                            group by  cmpname,uni_raw.master_code,desc_tsize,desc_ttype,desc_rimd||'x'||desc_psep,actual_rim,test_status,cus_rsp_desc order by cmpname, count(char_barcode) desc, uni_raw.master_code");
oci_execute($stid);

$fvmArray=array();
$machineName='';
while ($row = oci_fetch_array($stid, OCI_BOTH))
{
    if($machineName!=$row[0])
    {
        $fvmArray[$row[0]]['ACTUAL_RIM']=$row[5];
        $fvmArray[$row[0]]['TEST_STATUS']=$row[6];
    }

    $fvmArray[$row[0]]['OUTPUT']+=$row[8];
    $fvmArray[$row[0]]['DISTINCT_OUTPUT']+=$row[9];
    $fvmArray[$row[0]]['RENEWAL']+=$row[10];
    $fvmArray[$row[0]]['REPLACEMENT']+=$row[11];
    $fvmArray[$row[0]]['SCRAP']+=$row[12];
    $fvmArray[$row[0]]['OE']+=$row[13];
    $fvmArray[$row[0]]['SG_OE']+=$row[14];
    $fvmArray[$row[0]]['SG_RE']+=$row[15];

    $machineName=$row[0];
    $fvmArray[$row[0]]['CODES'][$row[1]] = array('SIZE'=>$row[2],
                                                'BRAND'=>$row[3],
                                                'CODE_RIM'=>$row[4],
                                                'MARKET'=>$row[7],
                                                'OUTPUT'=>$row[8],
                                                'DISTINCT_OUTPUT'=>$row[9],
                                                'RENEWAL'=>$row[10],
                                                'REPLACEMENT'=>$row[11],
                                                'SCRAP'=>$row[12],
                                                'OE'=>$row[13],
                                                'SG_OE'=>$row[14],
                                                'SG_RE'=>$row[15]
                                                );
}


$stid = oci_parse($ffmes_connection,"");
oci_execute($stid);
while ($row = oci_fetch_array($stid, OCI_BOTH))
{

}

echo json_encode($fvmArray,JSON_NUMERIC_CHECK);
//print_r($fvmArray);
