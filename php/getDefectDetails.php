<?php
/**
 * Created by PhpStorm.
 * User: AA62543
 * Date: 18-10-09
 * Time: 07:58
 */
error_reporting(0);
$ffmes_connection = oci_connect('minimes_ff_wbr', 'Baza0racl3appl1cs', '172.22.8.47/ORA');






//$dataArray=array(array_values($typeScrapsArray),$totalScrapsAmount);
//print_r ($dataArray);

if(isset($_GET['mode']))
{
    $ffmes = oci_connect('minimes_ff_wbr', 'Baza0racl3appl1cs', '172.22.8.47/ORA');
    $stid = oci_parse($ffmes, "select tire_code, long_desc, press, to_char(press_date,'yy-mm-dd hh24:mi:ss'),tbm_stage2, to_char(tbm_stage2_date,'yy-mm-dd hh24:mi:ss'),generic1,generic5, il,defect_num,barcode from
                                  (
                                  select barcode, df_entry.defect_num,tire_code, long_desc, press, press_date, tbm_stage2, tbm_stage2_date,generic1,generic5, count(barcode) over(partition by tire_code,df_entry.defect_num) il
                                  from df_entry@plda5l2
                                  left join df_defect_desc@plda5l2 on df_defect_desc.defect_num=df_entry.defect_num
                                  where df_entry.defect_type='C' and df_defect_desc.defect_type='C' and disposition=1 and df_entry.defect_num=" . $_GET['defect'] . " and update_date between
                                  to_date(to_char(sysdate,'yy-mm-dd') || ' 06:00:00','yy-mm-dd hh24:mi:ss') and to_date(to_char(sysdate+1,'yy-mm-dd') || ' 06:00:00','yy-mm-dd hh24:mi:ss')
                                  ) 
                                  order by il desc, long_desc, tire_code");


    oci_execute($stid);


    $html .= '<table border="1" style="border: 3px solid black;border-collapse: collapse;text-align:center;font-size:10px; width:100%;">
		  <tr style="background-color:black;color:#f49e42;text-align:center; ">
  			<th style="width:5%">LP</th>
			<th style="width:10%">DEF</th>
  			<th style="width:15%;text-align: center;">DEF DESC</th>
  			<th style="width:5%">TIRE CODE</th>
        <th style="width:5%">CTC</th>
  			<th style="width:3%">PRESS</th>
  			<th style="width:7%">CURE DATE</th>
  			<th style="width:3%">TBM</th>
  			<th style="width:7%">STAGE2 DATE</th>
  			<th style="width:20%">GENERIC5</th>
		</tr>';


    $gt_def = '';
    $background_color = '';
    $l = 0;

    $listArray = array();
    while (($row = oci_fetch_array($stid, OCI_BOTH)) != false) {
        $l++;
        //  $listArray += array('DEF_NUM' => $row[9], "DEF_DESC" => $row[1],"TIRE_CODE" =>$row[0],'CTC' => $row[6], 'PRESS' =>$row[2], 'CURE_DT'=>$row[3], "TBM" => $row[4], "TBM_DT" => $row[5], "GENERIC5"=>$row[7],"BARCODE" =>$row[10]);
        // array_push($listArray, array('DEF_NUM' => $row[9], "DEF_DESC" => $row[1],"TIRE_CODE" =>$row[0],'CTC' => $row[6], 'PRESS' =>$row[2], 'CURE_DT'=>$row[3], "TBM" => $row[4], "TBM_DT" => $row[5], "GENERIC5"=>$row[7],"BARCODE" =>$row[10]));



        if($gt_def!=$row[0].$row[1])
        {
            $l=1;
            if($background_color=='yellow')
                $background_color='white';
            else
                $background_color='yellow';

            $html.='<tr style="font-size:10px;border-top-color:black;border-top:3px;background-color:'.$background_color.';">
                            <td style="width:10%">'.$l.'</td>
							<td>'.$row[9].'</td>
                            <td >'.$row[1].'</td>
                            <td>'.$row[0].'</td>
                            <td>'.$row[6].'</td>
                            <td>'.$row[2].'</td>
                            <td>'.$row[3].'</td>
                            <td>'.$row[4].'</td>
                            <td>'.$row[5].'</td>
                            <td>'.$row[7].'</td>
                        </tr>';
            $gt_def=$row[0].$row[1];
            continue;
        }

        $html.='<tr style="font-size:10px;background-color:'.$background_color.';">
                            <td style="width:10%">'.$l.'</td>
							<td>'.$row[9].'</td>
                            <td >'.$row[1].'</td>
                            <td>'.$row[0].'</td>
                            <td>'.$row[6].'</td>
                            <td>'.$row[2].'</td>
                            <td>'.$row[3].'</td>
                            <td>'.$row[4].'</td>
                            <td>'.$row[5].'</td>
                            <td>'.$row[7].'</td>
                    </tr>';
        $gt_def=$row[0].$row[1];

    }




echo $html;

}
else{
//DEFECT HISTORY
    $dataArray=array();
    $stid = oci_parse($ffmes_connection,"select to_char(dzien,'yy-mm-dd'),long_desc,doba from
                                                (
                                                select distinct 
                                                trunc(update_date - interval '6' hour) dzien,long_desc, count(barcode) over(partition by trunc(update_date - interval '6' hour)) doba
                                                from df_entry@plda5l2 left join df_defect_desc@plda5l2 on df_defect_desc.defect_num=df_entry.defect_num 
                                                where df_entry.defect_type='C' and df_defect_desc.defect_type='C' and disposition in (1) 
                                                and df_entry.defect_num=".$_GET['defect']."
                                                and update_date between to_date(to_char(sysdate - 91,'yy-mm-dd') || ' 06:00:00','yy-mm-dd hh24:mi:ss') and to_date(to_char(sysdate+1,'yy-mm-dd') || ' 06:00:00','yy-mm-dd hh24:mi:ss') 
                                                ) order by dzien");
    oci_execute($stid);
    $i=0;
    while ($row = oci_fetch_array($stid, OCI_BOTH))
    {
        array_push($dataArray,array("date" => $row[0],"qty"=>$row[2], "desc" =>$row[1], "color" =>'#37cc34'));
        $i++;
    }

    $responseArray=array( "CHART" => $dataArray, "TABLE" => $html, 'CHART_CODE' => $codesArray);
    echo json_encode($responseArray,JSON_NUMERIC_CHECK);
}

//echo $html;

oci_close($ffmes_connection);