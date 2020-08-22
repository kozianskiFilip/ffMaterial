<?php
/**
 * Created by PhpStorm.
 * User: AA62543
 * Date: 2019-04-28
 * Time: 19:43
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

$stid = oci_parse($ffmes_connection,"select
                                                       * 
                                                    from
                                                       (
                                                          select distinct
                                                             tire_code,
                                                             long_desc,
                                                             defect_num,
                                                             tbm_stage2,
                                                             builder_stage2,
                                                             dzien,
                                                             zmiana,
                                                             sum(c_force) over(partition by defect_num, tbm_stage2,tire_code, builder_stage2, dzien, zmiana) tot,
                                                             listagg(force_mach || '(' || c_force || ')', ', ') within group(
                                                          order by
                                                             c_force desc) over(partition by defect_num, tbm_stage2, builder_stage2, dzien, zmiana) maszyny 
                                                          from
                                                             (
                                                                select
                                                                   tire_code,
                                                                   long_desc,
                                                                   defect_num,
                                                                   tbm_stage2,
                                                                   builder_stage2,
                                                                   dzien,
                                                                   zmiana,
                                                                   force_mach,
                                                                   count(tire_code) c_force 
                                                                from
                                                                   (
                                                                      select
                                                                         tire_code,
                                                                         long_desc,
                                                                         df_entry.defect_num,
                                                                         tbm_stage2,
                                                                         builder_stage2,
                                                                         to_char(tbm_stage2_date - interval '6' hour, 'yy-mm-dd') dzien,
                                                                         case
                                                                            when
                                                                               to_number(to_char(tbm_stage2_date, 'hh24')) >= 6 
                                                                               and to_number(to_char(tbm_stage2_date, 'hh24')) < 14 
                                                                            then
                                                                               1 
                                                                            when
                                                                               to_number(to_char(tbm_stage2_date, 'hh24')) < 22 
                                                                               and to_number(to_char(tbm_stage2_date, 'hh24')) >= 14 
                                                                            then
                                                                               2 
                                                                            else
                                                                               3 
                                                                         end
                                                                         zmiana, force_mach 
                                                                      from
                                                                         df_entry@plda5l2 
                                                                         left join
                                                                            df_defect_desc@plda5l2 
                                                                            on df_defect_desc.defect_num = df_entry.defect_num 
                                                                      where
                                                                         df_entry.defect_type = 'C' 
                                                                         and df_defect_desc.defect_type = 'C' 
                                                                         and disposition in 
                                                                         (
                                                                            1
                                                                         )
                                                                         and update_date between to_date('".$start." ".$start_hr.":00:00' ,'yy-mm-dd hh24:mi:ss') and to_date( '".$end." ".$end_hr.":00:00','yy-mm-dd hh24:mi:ss')
                                                                         and df_entry.defect_num in 
                                                                         (
                                                                            141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156
                                                                         )
                                                                   )
                                                                group by
                                                                   tire_code, long_desc, defect_num, tbm_stage2, builder_stage2, dzien, zmiana, force_mach 
                                                             )
                                                       )
                                                    where
                                                       tot >= 3 
                                                    order by
                                                       tot desc");
oci_execute($stid);

$dataArray=array();
while ($row = oci_fetch_array($stid, OCI_BOTH))
{
    array_push($dataArray, array(
                                                                                    'KEY'=>$start.$zmiana.$row[0].$row[2].$row[3].$row[4].$row[5].$row[6],
                                                                                    'CODE'=>$row[0],
                                                                                    'DESC'=>$row[1],
                                                                                    'TBM'=>$row[3],
                                                                                    'OPERATOR'=>$row[4],
                                                                                    'DAY'=>$row[5],
                                                                                    'SHIFT'=>$row[6],
                                                                                    'TOT'=>$row[7],
                                                                                    'FVMS'=>$row[8],
                                                                                )
    );
}

echo json_encode($dataArray, JSON_NUMERIC_CHECK);
oci_close($ffmes_connection);