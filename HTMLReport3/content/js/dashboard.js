/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.45454545454545, "KoPercent": 4.545454545454546};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8918918918918919, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "TC09_JPStore_ClickOn_Confirm"], "isController": true}, {"data": [1.0, 500, 1500, "TC06_JPStore_ClickOn_AddToCart/actions/Cart.action-70"], "isController": false}, {"data": [0.5, 500, 1500, "TC00_JPStore_ClickOn_HomePage"], "isController": true}, {"data": [1.0, 500, 1500, "TC05_JPStore_ClickOn_ProductId"], "isController": true}, {"data": [1.0, 500, 1500, "TC10_JPStore_ClickOn_MyAccount"], "isController": true}, {"data": [1.0, 500, 1500, "TC03_JPStore_ClickOn_Login/actions/Account.action-66"], "isController": false}, {"data": [1.0, 500, 1500, "TC01_JPStore_ClickOn_HomePage/actions/Catalog.action-50"], "isController": false}, {"data": [1.0, 500, 1500, "TC01_JPStore_ClickOn_SignIn"], "isController": true}, {"data": [1.0, 500, 1500, "TC02_JPStore_ClickOn_Login/actions/Catalog.action-81"], "isController": false}, {"data": [1.0, 500, 1500, "TC02_JPStore_ClickOn_SignIn/actions/Account.action;jsessionid=726FCBB5A19F2F1BAD67CB4AD3164CA0?viewCategory=&amp;categoryId=FISH"], "isController": false}, {"data": [1.0, 500, 1500, "TC06_JPStore_ClickOn_UpdateCart/actions/Cart.action-71"], "isController": false}, {"data": [0.5, 500, 1500, "TC02_JPStore_ClickOn_SignIn/actions/Account.action-79"], "isController": false}, {"data": [1.0, 500, 1500, "TC07_JPStore_ClickOn_MyAccount/actions/Account.action-75"], "isController": false}, {"data": [1.0, 500, 1500, "TC02_JPStore_ClickOn_Login/actions/Account.action-80"], "isController": false}, {"data": [1.0, 500, 1500, "TC05_JPStore_ClickOn_ProductId/actions/Catalog.action-69"], "isController": false}, {"data": [1.0, 500, 1500, "TC06_JPStore_ClickOn_AddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "TC08_JPStore_ClickOn_Continue"], "isController": true}, {"data": [1.0, 500, 1500, "TC01_JPStore_ClickOn_HomePage/generate_204-47"], "isController": false}, {"data": [1.0, 500, 1500, "TC07_JPStore_ClickOn_SignOut/actions/Account.action-77"], "isController": false}, {"data": [1.0, 500, 1500, "TC07_JPStore_ClickOn_Continue/actions/Order.action-73"], "isController": false}, {"data": [1.0, 500, 1500, "TC04_JPStore_ClickOn_Animals"], "isController": true}, {"data": [1.0, 500, 1500, "TC12_JPStore_ClickOn_SignOut"], "isController": true}, {"data": [1.0, 500, 1500, "TC07_JPStore_ClickOn_SignOut/actions/Catalog.action-78"], "isController": false}, {"data": [1.0, 500, 1500, "TC04_JPStore_ClickOn_Dogs/actions/Catalog.action-68"], "isController": false}, {"data": [1.0, 500, 1500, "TC07_JPStore_ClickOn_ProceedToCheckout/actions/Order.action-72"], "isController": false}, {"data": [0.5, 500, 1500, "TC01_JPStore_ClickOn_HomePage/-48"], "isController": false}, {"data": [1.0, 500, 1500, "TC03_JPStore_ClickOn_Login"], "isController": true}, {"data": [1.0, 500, 1500, "TC07_JPStore_ClickOn_UpdateCart"], "isController": true}, {"data": [1.0, 500, 1500, "TC11_JPStore_ClickOn_MyOrders"], "isController": true}, {"data": [1.0, 500, 1500, "TC03_JPStore_ClickOn_Login/actions/Catalog.action-67"], "isController": false}, {"data": [1.0, 500, 1500, "TC07_JPStore_ClickOn_ProceedToCheckout"], "isController": true}, {"data": [0.5, 500, 1500, "TC02_JPStore_ClickOn_SignIn"], "isController": true}, {"data": [1.0, 500, 1500, "TC07_JPStore_ClickOn_MyOrders/actions/Order.action-76"], "isController": false}, {"data": [0.0, 500, 1500, "TC07_JPStore_ClickOn_Confirm/actions/Order.action-74"], "isController": false}, {"data": [1.0, 500, 1500, "TC07_JPStore_ClickOn_SignOut/actions/Account.action-77-1"], "isController": false}, {"data": [1.0, 500, 1500, "TC07_JPStore_ClickOn_SignOut/actions/Account.action-77-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22, 1, 4.545454545454546, 236.45454545454544, 87, 924, 159.0, 678.2999999999996, 910.4999999999998, 924.0, 5.989654233596515, 25.763383133678193, 5.38957213109175], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TC09_JPStore_ClickOn_Confirm", 1, 1, 100.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 49.957374796416936, 2.643398819218241], "isController": true}, {"data": ["TC06_JPStore_ClickOn_AddToCart/actions/Cart.action-70", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 25.18055050872093, 4.967977834302326], "isController": false}, {"data": ["TC00_JPStore_ClickOn_HomePage", 1, 0, 0.0, 1085.0, 1085, 1085, 1085.0, 1085.0, 1085.0, 1085.0, 0.9216589861751152, 6.289602534562212, 1.5625], "isController": true}, {"data": ["TC05_JPStore_ClickOn_ProductId", 1, 0, 0.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 6.493506493506494, 24.680397727272727, 5.529626623376624], "isController": true}, {"data": ["TC10_JPStore_ClickOn_MyAccount", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 35.538383152173914, 5.155764751552795], "isController": true}, {"data": ["TC03_JPStore_ClickOn_Login/actions/Account.action-66", 1, 0, 0.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 6.493506493506494, 24.92770900974026, 7.8949370941558445], "isController": false}, {"data": ["TC01_JPStore_ClickOn_HomePage/actions/Catalog.action-50", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 32.2682450457317, 4.3766673018292686], "isController": false}, {"data": ["TC01_JPStore_ClickOn_SignIn", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 23.492431640625, 5.4931640625], "isController": true}, {"data": ["TC02_JPStore_ClickOn_Login/actions/Catalog.action-81", 1, 0, 0.0, 156.0, 156, 156, 156.0, 156.0, 156.0, 156.0, 6.41025641025641, 29.59735576923077, 5.308493589743589], "isController": false}, {"data": ["TC02_JPStore_ClickOn_SignIn/actions/Account.action;jsessionid=726FCBB5A19F2F1BAD67CB4AD3164CA0?viewCategory=&amp;categoryId=FISH", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 23.492431640625, 5.4931640625], "isController": false}, {"data": ["TC06_JPStore_ClickOn_UpdateCart/actions/Cart.action-71", 1, 0, 0.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 6.451612903225806, 27.942288306451612, 7.522681451612903], "isController": false}, {"data": ["TC02_JPStore_ClickOn_SignIn/actions/Account.action-79", 1, 0, 0.0, 924.0, 924, 924, 924.0, 924.0, 924.0, 924.0, 1.0822510822510822, 4.656638933982684, 0.8127451975108225], "isController": false}, {"data": ["TC07_JPStore_ClickOn_MyAccount/actions/Account.action-75", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 35.538383152173914, 5.155764751552795], "isController": false}, {"data": ["TC02_JPStore_ClickOn_Login/actions/Account.action-80", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 22.307639898255815, 6.818904433139536], "isController": false}, {"data": ["TC05_JPStore_ClickOn_ProductId/actions/Catalog.action-69", 1, 0, 0.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 6.493506493506494, 24.680397727272727, 5.529626623376624], "isController": false}, {"data": ["TC06_JPStore_ClickOn_AddToCart", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 25.18055050872093, 4.967977834302326], "isController": true}, {"data": ["TC08_JPStore_ClickOn_Continue", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 26.200306566455694, 8.925039556962025], "isController": true}, {"data": ["TC01_JPStore_ClickOn_HomePage/generate_204-47", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 1.4255567528735633, 3.4797054597701154], "isController": false}, {"data": ["TC07_JPStore_ClickOn_SignOut/actions/Account.action-77", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 15.56609623015873, 5.112227182539683], "isController": false}, {"data": ["TC07_JPStore_ClickOn_Continue/actions/Order.action-73", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 26.200306566455694, 8.925039556962025], "isController": false}, {"data": ["TC04_JPStore_ClickOn_Animals", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 24.66908837579618, 5.224920382165605], "isController": true}, {"data": ["TC12_JPStore_ClickOn_SignOut", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 20.342965411324784, 5.151993189102564], "isController": true}, {"data": ["TC07_JPStore_ClickOn_SignOut/actions/Catalog.action-78", 1, 0, 0.0, 153.0, 153, 153, 153.0, 153.0, 153.0, 153.0, 6.5359477124183005, 30.177696078431374, 5.2338643790849675], "isController": false}, {"data": ["TC04_JPStore_ClickOn_Dogs/actions/Catalog.action-68", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 24.66908837579618, 5.224920382165605], "isController": false}, {"data": ["TC07_JPStore_ClickOn_ProceedToCheckout/actions/Order.action-72", 1, 0, 0.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 6.493506493506494, 25.200385551948052, 5.193536931818182], "isController": false}, {"data": ["TC01_JPStore_ClickOn_HomePage/-48", 1, 0, 0.0, 834.0, 834, 834, 834.0, 834.0, 834.0, 834.0, 1.199040767386091, 1.6884929556354917, 0.8091183303357314], "isController": false}, {"data": ["TC03_JPStore_ClickOn_Login", 2, 0, 0.0, 321.0, 314, 328, 321.0, 328.0, 328.0, 328.0, 3.10077519379845, 26.217296511627907, 6.33781492248062], "isController": true}, {"data": ["TC07_JPStore_ClickOn_UpdateCart", 1, 0, 0.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 6.451612903225806, 27.942288306451612, 7.522681451612903], "isController": true}, {"data": ["TC11_JPStore_ClickOn_MyOrders", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 15.594482421875, 4.2572021484375], "isController": true}, {"data": ["TC03_JPStore_ClickOn_Login/actions/Catalog.action-67", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 28.857421875, 5.4443359375], "isController": false}, {"data": ["TC07_JPStore_ClickOn_ProceedToCheckout", 1, 0, 0.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 6.493506493506494, 25.200385551948052, 5.193536931818182], "isController": true}, {"data": ["TC02_JPStore_ClickOn_SignIn", 1, 0, 0.0, 924.0, 924, 924, 924.0, 924.0, 924.0, 924.0, 1.0822510822510822, 4.656638933982684, 0.8127451975108225], "isController": true}, {"data": ["TC07_JPStore_ClickOn_MyOrders/actions/Order.action-76", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 15.594482421875, 4.2572021484375], "isController": false}, {"data": ["TC07_JPStore_ClickOn_Confirm/actions/Order.action-74", 1, 1, 100.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 49.957374796416936, 2.643398819218241], "isController": false}, {"data": ["TC07_JPStore_ClickOn_SignOut/actions/Account.action-77-1", 1, 0, 0.0, 156.0, 156, 156, 156.0, 156.0, 156.0, 156.0, 6.41025641025641, 30.066856971153847, 5.133213141025641], "isController": false}, {"data": ["TC07_JPStore_ClickOn_SignOut/actions/Account.action-77-0", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 1.3559912420382165, 5.156498805732484], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 1, 100.0, 4.545454545454546], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TC07_JPStore_ClickOn_Confirm/actions/Order.action-74", 1, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
