<?php
/**
 * Created by PhpStorm.
 * User: AA62543
 * Date: 18-04-15
 * Time: 17:03
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
            $start=date_format ( $start, 'Y-m-d');

            $end=new DateTime();
            $end=date_format ( $end, 'y-m-d');

            $zmiana=2;
        }

		if($h>=22 || $h<6)
        {
            if($h>=22)
            {
                $end=new DateTime();
                $end->add(new DateInterval('P1D'));
                $end=date_format ( $end, 'y-m-d');

                $start=new DateTime();
                $start=date_format ( $start, 'y-m-d');
            }
            if($h<=6)
            {
                $start=new DateTime();
                $start->sub(new DateInterval('P1D'));
                $start=date_format ( $start, 'y-m-d');

                $end=new DateTime();
                $end=date_format ( $end, 'y-m-d');
            }
            $start_hr=22;
            $end_hr=6;
            $zmiana=3;
        }


//DO TESTÓW - RÓŻNE TRYBY PRZEDSTAWIANIA DANYCH
{
    //NARASTAJĄCO DOBA
    if ($_GET['mode'] == 0) {
        if($h<=6)
        {
            $start=new DateTime();
            $start->sub(new DateInterval('P1D'));
            $start=date_format ( $start, 'y-m-d');
            $end=new DateTime();
            $end=date_format ( $end, 'y-m-d');
        }
        else{
            $start=new DateTime();
            $start=date_format ( $start, 'y-m-d');
            $end = new DateTime();
            $end->add(new DateInterval('P1D'));
            $end = date_format($end, 'y-m-d');
        }
        $start_hr = 06;
        $end_hr = 06;
    }

    //TYLKO ZMIANA1
    else if ($_GET['mode'] == 1) {
        if($h<6)
        {
            $start=new DateTime();
            $start->sub(new DateInterval('P1D'));
            $start=date_format ( $start, 'y-m-d');
            $end=new DateTime();
            $end->sub(new DateInterval('P1D'));
            $end=date_format ( $end, 'y-m-d');
        }
        else{
            $start=new DateTime();
            $start=date_format ( $start, 'y-m-d');
            $end = new DateTime();
            $end = date_format($end, 'y-m-d');
        }

        $start_hr = 06;
        $end_hr = 14;
    }
    //TYLKO ZMIANA2
    else if ($_GET['mode'] == 2) {
        if($h<6)
        {
            $start=new DateTime();
            $start->sub(new DateInterval('P1D'));
            $start=date_format ( $start, 'y-m-d');
            $end=new DateTime();
            $end->sub(new DateInterval('P1D'));
            $end=date_format ( $end, 'y-m-d');
        }
        else{
            $start=new DateTime();
            $start=date_format ( $start, 'y-m-d');
            $end = new DateTime();
            $end = date_format($end, 'y-m-d');
        }

        $start_hr = 14;
        $end_hr = 22;
    } //ZMIANA3
    else {
        if($h>=22)
        {
            $end=new DateTime();
            $end->add(new DateInterval('P1D'));
            $end=date_format ( $end, 'y-m-d');
            $start=new DateTime();
            $start=date_format ( $start, 'y-m-d');
        }
        if($h<6)
        {
            $start=new DateTime();
            $start->sub(new DateInterval('P1D'));
            $start=date_format ( $start, 'y-m-d');
            $end=new DateTime();
            $end=date_format ( $end, 'y-m-d');
        }
        $start_hr = 22;
        $end_hr = 6;
    }
}



        $scrapsSummary=array('BUILDING' => array('qty' =>0, 'color' =>'#f8fc00') , 'UNI' => array('qty' =>0, 'color' =>'#ef8904'), 'CURING' => array('qty' =>0, 'color' =>'#ef0404'));
        $dataArray=array();

	   	    $stid = oci_parse($ffmes_connection,"select defect_num, long_desc, sum(per_machine),
                                listagg(case when per_machine >=3 then tire_code || ' / ' || maszyna || '-' || per_machine || 'szt.' else null end, '</br>') within group(order by per_gt_code desc, per_machine desc) serie,
                                 case when defect_num  in (1, 2, 4, 5, 7, 8, 11, 49, 52, 53, 92, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 125, 126, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 176, 177, 178, 179, 180, 181, 182, 185, 197, 198, 199)
                                 then 'CURING'
                                 when defect_num in (141,142,143,144,145,146, 147,  148, 149, 150, 151, 152, 153, 154, 155, 156)
                                 then 'UNI'
                                 else 'BUILDING'
                                 end color
                                from
                                (
                                        select distinct
                                        tire_code, 
                                        long_desc, defect_num, maszyna ,
                                        count(tire_code) over (partition by tire_code, defect_num) per_gt_code,
                                        count(tire_code) over (partition by tire_code,defect_num, maszyna) per_machine
                                        from
                                        (
                                        select tire_code,
                                        long_desc,
                                        df_entry.defect_num,
                                        case when df_entry.defect_num  in (1, 2, 4, 5, 7, 8, 11, 49, 52, 53, 92, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 125, 126, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 176, 177, 178, 179, 180, 181, 182, 185, 197, 198, 199)
                                        then substr(press,1,3)
                                        else
                                        tbm_stage2
                                        end maszyna
                                        from df_entry@plda5l2 left join df_defect_desc@plda5l2 on df_defect_desc.defect_num=df_entry.defect_num 
                                        where df_entry.defect_type='C' and df_defect_desc.defect_type='C' and disposition in (1) 
                                        and update_date between to_date('".$start." ".$start_hr.":00:00','yy-mm-dd hh24:mi:ss') and to_date('".$end." ".$end_hr.":00:00','yy-mm-dd hh24:mi:ss') 
                                        )
                                )
                                group by defect_num, long_desc order by sum(per_machine) desc");
            oci_execute($stid);

            $i=0;
			while ($row = oci_fetch_array($stid, OCI_BOTH))
            {
              //  echo $row[1].'</br>';
                $scrapsSummary[$row[4]]['qty']+=$row[2];
                if($i<15)
                 array_push($dataArray,array("defectNumber" => $row[0],"qty"=>$row[2], "desc" =>$row[1], "text" => $row[3], "color" =>$scrapsSummary[$row[4]]['color']));
                $i++;
            }

            //WYKRES I DANE NT NAPRAW
            $repairArray=array();
			$repairSummary=0;
            $stid = oci_parse($ffmes_connection,"select defect_num, long_desc, sum(per_machine),
                                                        listagg(case when per_machine >=3 then tire_code || ' / ' || maszyna || '-' || per_machine || 'szt.' else null end, '</br>') within group(order by per_gt_code desc, per_machine desc) serie,
                                                        case when defect_num  in (1, 2, 4, 5, 7, 8, 11, 49, 52, 53, 92, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 125, 126, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 176, 177, 178, 179, 180, 181, 182, 185, 197, 198, 199) then 'CURING'
                                                        when defect_num in (141,142,143,144,145,146, 147,  148, 149, 150, 151, 152, 153, 154, 155, 156) then 'UNI' else 'BUILDING' end color
                                                        from
                                                        (
                                                          select distinct tic tire_code, long_desc, defect_num,maszyna,
                                                          count(tic) over (partition by tic, defect_num) per_gt_code,
                                                          count(tic) over (partition by tic,defect_num, maszyna) per_machine
                                                          from
                                                          (
                                                              select 
                                                              to_char(transaction_date - interval '6' hour,'yy-mm-dd'),long_desc, df_entry_history.defect_num,tic,
                                                              case when df_entry_history.defect_num  in (1, 2, 4, 5, 7, 8, 11, 49, 52, 53, 92, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 125, 126, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 176, 177, 178, 179, 180, 181, 182, 185, 197, 198, 199)
                                                              then substr(prscav,1,3)
                                                              else
                                                              s2mach
                                                              end maszyna
                                                              from df_entry_history@plda5l2 left join df_defect_desc@plda5l2 on df_defect_desc.defect_num=df_entry_history.defect_num 
                                                              left join barcode@sbs on df_entry_history.barcode=barcode.barcode
                                                              where df_entry_history.defect_type='C' and df_defect_desc.defect_type='C' and disposition in (6) 
                                                              and transaction_date between to_date('".$start." ".$start_hr.":00:00','yy-mm-dd hh24:mi:ss') and to_date('".$end." ".$end_hr.":00:00','yy-mm-dd hh24:mi:ss')   and transaction_type='INS'
                                                          )
                                                        )group by defect_num, long_desc order by sum(per_machine) desc");
                oci_execute($stid);

                $i=0;
                while ($row = oci_fetch_array($stid, OCI_BOTH))
                {
                    $repairSummary+=$row[2];
                    array_push($repairArray,array("defectNumber" => $row[0],"qty"=>$row[2], "desc" =>$row[1], "text" => $row[3], "color" =>"#4242f4"));
                }

          //MASY
//
        $massArray=array();
        $massSummary=0;
        $stid = oci_parse($ffmes_connection,"select cured_tire_code,count(barcode)
                                from tw_entry@plda5l2 where cured_tire_code like 'PL-C%'
                                and last_processed=1 and
                                dstamp  between to_date('".$start." ".$start_hr.":00:00','yy-mm-dd hh24:mi:ss') and to_date('".$end." ".$end_hr.":00:00','yy-mm-dd hh24:mi:ss') and limits_position
                                not in (1,-1,2,-2)
                                group by cured_tire_code
                                order by count(barcode) desc");
        oci_execute($stid);


        while ($row = oci_fetch_array($stid, OCI_BOTH))
        {
            $massSummary+=$row[1];
            array_push($massArray,array("defectNumber" => substr($row[0],6,4),"qty"=>$row[1], "desc" =>$row[0], "text" => "", "color" =>"#682912"));
        }

        //$dataArray=array(array_values($typeScrapsArray),$totalScrapsAmount);
        //print_r ($dataArray);
        $dataArray=array_merge($scrapsSummary, array('DANE' => $dataArray),array('DANE_NAPRAWA' =>$repairArray), array('REPAIR' => $repairSummary), array("DANE_MASY" => $massArray));
		echo json_encode($dataArray,JSON_NUMERIC_CHECK);
		oci_close($ffmes_connection);
?>