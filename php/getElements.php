<?php
/**
 * Created by PhpStorm.
 * User: AA62543
 * Date: 2019-03-29
 * Time: 07:48
 */
$ffmes_connection = oci_connect('minimes_ff_wbr', 'Baza0racl3appl1cs', '172.22.8.47/ORA');
$ffmes = oci_connect('minimes_ff_wbr', 'Baza0racl3appl1cs', '172.22.8.47/ORA');
$stid = oci_parse($ffmes, "select mat_group,material,sfc,storage_area || ' ' || storage_row || ' ' || storage_level, convoyer, qty, min_usage_date,to_char(expiry_date,'yy-mm-dd hh24:mi:ss'),to_char(prod_date,'yy-mm-dd hh24:mi:ss'),prod_machine,qa_reason,round((expiry_date-sysdate)*24,2),last_edit_date,deleted_from_prolag
                                    from prolag_prep_inv@prolag
                                    where prod_machine not like '%MRT%' and prod_machine !='QUADRO' and prod_machine !='FISHER' and qty < max_qty  and substr(storage_area,1,3)||storage_row !='TBM1'
                                    and deleted_from_prolag=0 
                                    and (expiry_date-sysdate)*24 < (" . $_GET['days'] . " * 8)
                                    order by mat_group, expiry_date ");


oci_execute($stid);
$responeseArray = array();

while ($row = oci_fetch_array($stid, OCI_BOTH)) {
    array_push($responeseArray, array('MAT_GROUP' => $row[0],
        'MATERIAL' => $row[1],
        'SFC' => $row[2],
        'LOKALIZACJA' => $row[3],
        'CONVOYER' => $row[4],
        'QTY' => $row[5],
        'MIN_USAGE_DATE' => $row[6],
        'EXPIRY_DATE' => $row[7],
        'PROD_DATE' => $row[8],
        'PROD_MACHINE' => $row[9],
        'QA_REASON' => $row[10],
        'PRZET' => $row[11],
        'LAST_EDIT_DATE' => $row[12],
        'DELETED_FROM_PROLAG' => $row[13],
    ));
}
echo json_encode($responeseArray);

oci_close($ffmes_connection);