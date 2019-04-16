<?php
/**
 * Created by PhpStorm.
 * User: AA62543
 * Date: 2019-04-02
 * Time: 13:06
 */
$ffmes_connection = oci_connect('minimes_ff_wbr', 'Baza0racl3appl1cs', '172.22.8.47/ORA');
$ffmes = oci_connect('minimes_ff_wbr', 'Baza0racl3appl1cs', '172.22.8.47/ORA');
$stid = oci_parse($ffmes, "select to_char(day,'yy-mm-dd'),ff_ild_plan.description,nvl(dpics,tic), nvl(ctcode,substr(fact_code,1,10)),sapcode,plan_week,plan_wtd,cure_wtd,stock_wtd,plan_today,wd11,week,sap_num,nvl(qty,0),tic,nvl2(pal_type, stackcnt, 0) ,tread_stripe,fact_code,suffix,is_nsds,pal_type 
                                    from ff_ild_plan 
                                    left join
                                    (
                                        select   
                                        sap_num,
                                        sum(case when ident='IN' then qty else qty*-1 end) qty
                                        from  stk_pallet@sbs
                                        where 
                                        to_char(to_date(substr(LABEL_NUM,1,8),'yyyymmdd'),'IW')=to_char(sysdate-(1/24*9),'IW') and substr(LABEL_NUM,1,4)=to_char(sysdate-(1/24*9),'yyyy') and suffix not in ('T','L')
                                        group by sap_num
                                    ) on sap_num=sapcode
                                    left join
                                    (
                                        select * from cids_auth_sku_a@sbs
                                        left join
                                        (
                                        select sku sap,max(edit_date) dt from cids_auth_sku_a@sbs group by sku
                                        ) on sap=sku and edit_date=dt where dt is not null
                                    )
                                    on sku='00'||sapcode
                                    where to_char(day-1,'IW')=to_char(sysdate-(1/24*9),'IW') and wd11=0   order by ff_ild_plan.description");
oci_execute($stid);
$responeseArray = array();

while ($row = oci_fetch_array($stid, OCI_BOTH)) {
    array_push($responeseArray, array('DAY' => $row[0],
        'DESC' => $row[1],
        'DPICS' => $row[2],
        'CTCODE' => $row[3],
        'SAP' => $row[4],
        'PLAN_WEEK' => $row[5],
        'PLAN_WTD' => $row[6],
        'CURE_WTD' => $row[7],
        'STOCK_WTD_GP3' => $row[8],
        'PLAN_TODAY' => $row[9],
        'STOCK_WTD_STK' => $row[13],
        'SUFFIX' => $row[18],
        'PALLET_QTY' => $row[15]
    ));
}

if (!$responeseArray) //JEZELI NIE ZACIAGNELO BIEZACEJ ANALIZY
{
    $stid = oci_parse($ffmes, "select to_char(day,'yy-mm-dd'),ff_ild_plan.description,nvl(dpics,tic), nvl(ctcode,substr(fact_code,1,10)),sapcode,plan_week,plan_wtd,cure_wtd,stock_wtd,plan_today,wd11,week,sap_num,nvl(qty,0),tic,nvl2(pal_type, stackcnt, 0) ,tread_stripe,fact_code,suffix,is_nsds,pal_type 
                                        from ff_ild_plan 
                                        left join
                                        (
                                            select   
                                            sap_num,
                                            sum(case when ident='IN' then qty else qty*-1 end) qty
                                            from  stk_pallet@sbs
                                            where 
                                            to_char(to_date(substr(LABEL_NUM,1,8),'yyyymmdd'),'IW')=to_char(sysdate-(1/24*9),'IW') and substr(LABEL_NUM,1,4)=to_char(sysdate-(1/24*9),'yyyy') and suffix not in ('T','L')
                                            group by sap_num
                                        ) on sap_num=sapcode
                                        left join
                                        (
                                            select * from cids_auth_sku_a@sbs
                                            left join
                                            (
                                            select sku sap,max(edit_date) dt from cids_auth_sku_a@sbs group by sku
                                            ) on sap=sku and edit_date=dt where dt is not null
                                        )
                                        on sku='00'||sapcode
                                        where week=to_char(sysdate-(1/24*9),'IW') and wd11=1 and plan_week!=0 order by ff_ild_plan.description");
    oci_execute($stid);
    $responeseArray = array();

    while ($row = oci_fetch_array($stid, OCI_BOTH)) {
        array_push($responeseArray, array('DAY' => $row[0],
            'DESC' => $row[1],
            'DPICS' => $row[2],
            'CTCODE' => $row[3],
            'SAP' => $row[4],
            'PLAN_WEEK' => $row[5],
            'PLAN_WTD' => $row[6],
            'CURE_WTD' => $row[7],
            'STOCK_WTD_GP3' => $row[8],
            'PLAN_TODAY' => $row[9],
            'STOCK_WTD_STK' => $row[13],
            'SUFFIX' => $row[18],
            'PALLET_QTY' => $row[15]
        ));
    }
}
echo json_encode($responeseArray);

oci_close($ffmes_connection);