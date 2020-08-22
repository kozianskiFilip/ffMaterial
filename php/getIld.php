<?php
/**
 * Created by PhpStorm.
 * User: AA62543
 * Date: 2019-04-02
 * Time: 13:06
 */
$ffmes_connection = oci_connect('minimes_ff_wbr', 'Baza0racl3appl1cs', '172.22.8.47/ORA');
//$ffmes = oci_connect('minimes_ff_wbr', 'Baza0racl3appl1cs', '172.22.8.47/ORA');
$stid = oci_parse($ffmes_connection, "select to_char(day,'yy-mm-dd'),ff_ild_plan.description,nvl(dpics,tic), nvl(ctcode,substr(fact_code,1,10)),sapcode,plan_week,plan_wtd,cure_wtd,stock_wtd,plan_today,wd11,week,sap_num,nvl(qty,0),tic,nvl2(pal_type, stackcnt, 0) ,tread_stripe,fact_code,suffix,is_nsds,pal_type,wtd_stk,nvl(cure,0),nvl(FVM,' ')
                                    from ff_ild_plan 
                                    left join
                                    (
                                        select  
                                        day doba,
                                        sap_num,
                                        sum(case when ident='IN' then qty else qty*-1 end) qty,
                                        sum(case when ident='IN' and to_date(substr(LABEL_NUM,1,8),'yyyymmdd')<=day-1  then qty when ident='OU' and to_date(substr(LABEL_NUM,1,8),'yyyymmdd')<=day-1 then  qty*-1 else 0 end) wtd_stk
                                        from  stk_pallet@sbs left join (select distinct day from ff_ild_plan) on 1=1
                                        where 
                                        to_char(to_date(substr(LABEL_NUM,1,8),'yyyymmdd'),'IW')=to_char(sysdate-(1/24*9),'IW') and substr(LABEL_NUM,1,4)=to_char(sysdate-(1/24*9),'yyyy') and suffix not in ('T','L')
                                        group by day,sap_num
                                    ) on sap_num=sapcode
                                    left join
                                    (
                                        select * from cids_auth_sku_a@sbs
                                        left join
                                        (
                                        select sku sap,max(edit_date) dt from cids_auth_sku_a@sbs where tic not like 'H%' and tic not like 'E%' group by sku
                                        ) on sap=sku and edit_date=dt where dt is not null and tic not like 'H%' and tic not like 'E%'
                                    )
                                    left join
                                    (
                                        select ctc, count(barcode) cure from cure_prod_log@curemes where end_time>sysdate-4/24 group by ctc
                                    ) on substr(ctc,6,5)=substr(fact_code,6,5)
                                    left join
                                    (
                                        select master_code, listagg(cmpname || '(' || badanie || ') ') within group (order by badanie desc) FVM
                                        from
                                        (
                                            select master_code,cmpname,count(char_barcode) badanie from uni_raw@plda5l2 where dstamp>sysdate-10/24 group by master_code,cmpname
                                        ) group by master_code
                                    ) on master_code=ctc
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
        'PALLET_QTY' => $row[15],
        'WTD_GP3_STK' => $row[21],
        'CURED_LAST_4H' => $row[22],
        'FVM_LAST_10H' => $row[23]
    ));
}

if (!$responeseArray) //JEZELI NIE ZACIAGNELO BIEZACEJ ANALIZY
{
    $stid = oci_parse($ffmes_connection, "select to_char(day,'yy-mm-dd'),ff_ild_plan.description,nvl(dpics,tic), nvl(ctcode,substr(fact_code,1,10)),sapcode,plan_week,plan_wtd,cure_wtd,stock_wtd,plan_today,wd11,week,sap_num,nvl(qty,0),tic,nvl2(pal_type, stackcnt, 0) ,tread_stripe,fact_code,suffix,is_nsds,pal_type,wtd_stk,nvl(cure,0),nvl(FVM,' ') 
                                        from ff_ild_plan 
                                        left join
                                        (
                                            select  
                                            day doba,
                                            sap_num,
                                            sum(case when ident='IN' then qty else qty*-1 end) qty,
                                            sum(case when ident='IN' and to_date(substr(LABEL_NUM,1,8),'yyyymmdd')<=day-1  then qty when ident='OU' and to_date(substr(LABEL_NUM,1,8),'yyyymmdd')<=day-1 then  qty*-1 else 0 end) wtd_stk
                                            from  stk_pallet@sbs left join (select distinct day from ff_ild_plan) on 1=1
                                            where 
                                            to_char(to_date(substr(LABEL_NUM,1,8),'yyyymmdd'),'IW')=to_char(sysdate-(1/24*9),'IW') and substr(LABEL_NUM,1,4)=to_char(sysdate-(1/24*9),'yyyy') and suffix not in ('T','L')
                                            group by day,sap_num
                                        ) on sap_num=sapcode
                                        left join
                                        (
                                            select * from cids_auth_sku_a@sbs
                                            left join
                                            (
                                            select sku sap,max(edit_date) dt from cids_auth_sku_a@sbs where tic not like 'H%' and tic not like 'E%' group by sku
                                            ) on sap=sku and edit_date=dt where dt is not null and tic not like 'H%' and tic not like 'E%'
                                        )
                                        left join
                                        (
                                            select ctc, count(barcode) cure from cure_prod_log@curemes where end_time>sysdate-4/24 group by ctc
                                        ) on substr(ctc,6,5)=substr(fact_code,6,5)
                                        left join
                                        (
                                            select master_code, listagg(cmpname || '(' || badanie || ') ') within group (order by badanie desc) FVM
                                            from
                                            (
                                                select master_code,cmpname,count(char_barcode) badanie from uni_raw@plda5l2 where dstamp>sysdate-10/24 group by master_code,cmpname
                                            ) group by master_code
                                        ) on master_code=ctc
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
            'PALLET_QTY' => $row[15],
            'WTD_GP3_STK' => $row[21],
            'CURED_LAST_4H' => $row[22],
            'FVM_LAST_10H' => $row[23]
        ));
    }
}
echo json_encode($responeseArray);

oci_close($ffmes_connection);