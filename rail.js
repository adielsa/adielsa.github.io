
var debug = false
//url = "https://www.rail.co.il/apiinfo/api/Plan/GetRoutes?OId=8700&TId=4600&Date=20191120&Hour=0000&isGoing=true&c=1574104685255"

var d = new Date();

function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('');
}

function add_time(Route,fbResponse) {
    train_path = ""
    train_idx  = 0
    Route.Train.forEach(train => {
        if (Route.IsExchange == true) {
            train_path += " " + train_idx + "> ";
            train_idx++;
        }
        train_path += (train.DepartureTime + " => " + train.ArrivalTime)
        delay_int = 0
        fbResponse.Data.Delays.forEach(D => {
            if (train.Trainno == D.Train) {
                delay_int =  D.Min;
                train_path += " Delay:" + D.min;
            }
        })
        Deparute_dd = moment(train.DepartureTime, "DD/MM/YYYY H:mm:ss");
        Deparute_d = Deparute_dd.toDate();
        if (debug) console.log("DDD:" + train.DepartureTime + " DD:"+Deparute_dd+" D:"+Deparute_d);
        deparute_str = Deparute_dd.format("HH:mm");//Deparute_d.getHours() + ":" + Deparute_d.getMinutes();

        Arrival_dd = moment(train.ArrivalTime, "DD/MM/YYYY H:mm:ss");
        Arrival_d = Arrival_dd.toDate();
        if (debug) console.log("AA:" +Arrival_d + " A:"+Arrival_dd);
        arrival_str = Arrival_dd.format("HH:mm");//Arrival_d.getHours() + ":"+ Arrival_d.getMinutes();
        //console.log(Deparute_d.getHour() + ":"+Deparute_d.getMinute())

        time_left = Deparute_dd.fromNow();
        delay_str = delay_int > 0 ? delay_int : ""
        if (Deparute_dd.isBefore(moment())) {
            return;
        }
        $('#table_train').append('<tr><td>'+ deparute_str +'</td><td>'+ arrival_str +'</td><td>'+ delay_str + '</td><td>'+ time_left +'</td></tr>');
        if (debug) console.log("t " + train_path)


    })
}


function update_train() {
    var time = '1500'
    var date = '2019'+'11'+'19'
    var Oid = $('#from_station').val();//'4600'
    var Tid = $('#dest_station').val();//'8700'
    var time = [("0"+d.getHours()).slice(-2), ("0"+d.getMinutes()).slice(-2)].join('')
    var datestr = formatDate()
    var url = 'https://www.rail.co.il/apiinfo/api/Plan/GetRoutes?OId='+Oid+'&TId='+Tid+'&Date='+datestr+'&Hour='+time+'&isGoing=true&c='+'1123231'
    if (debug) console.log(url)

    if (Oid == Tid) {
        //same station null resp
        return
    }
    $.getJSON(url, function(data){
            var fbResponse = data;//JSON.parse(data);        
            if (debug) console.log(fbResponse);
            R = fbResponse.Data.Routes
            $('#table_train').find("tr:gt(0)").remove();;
            if (fbResponse.Data.Routes.length > 0) {
                fbResponse.Data.Routes.forEach(Route => {
                    add_time(Route, fbResponse)
                });
                if (debug) console.log(fbResponse.Data.Delays)
            } else {
                if (debug) console.log("No Trains")
            }
    });
}

var cnt_update = 0;
function auto_update_train(force_update = 0) {
    $('#update_next').text(cnt_update);
    if ((cnt_update == 0) | (force_update==1) ) {
        cnt_update = 60;
        update_train();  
    } else {
        cnt_update -= 1;
    }
    setTimeout(auto_update_train, 1*1000); 
}

$(function() {
    update_train();
    setTimeout(auto_update_train, 1*1000);
});




station = {
        "3600": "תל אביב - אוניברסיטה",
        "3700": "תל אביב - סבידור מרכז",
        "4600": "תל אביב - השלום",
        "4900": "תל אביב - ההגנה",
        "8700": "כפר סבא - נורדאו (א' קוסטיוק)",
        "9200": "הוד השרון - סוקולוב",
        "3500": "הרצליה",
        "3400": "בית יהושע",
        "3300": "נתניה",
        "3100": "חדרה - מערב",
        "2800": "בנימינה",
        "2820": "קיסריה - פרדס חנה",
        "2500": "עתלית",
        "2200": "חיפה - בת גלים",
        "1300": "חוצות המפרץ",
        "700": "קריית חיים",
        "1400": "קריית מוצקין",
        "1500": "עכו",
        "2300": "חיפה - חוף הכרמל (ש' רזיאל)",
        "1600": "נהריה",
        "6500": "ירושלים - גן החיות התנכי",
        "6300": "בית שמש",
        "7000": "קריית גת",
        "5000": "לוד",
        "7300": "באר שבע- צפון/אוניברסיטה",
        "4800": "כפר חב\"ד",
        "2100": "חיפה- מרכז השמונה",
        "5010": "רמלה",
        "8800": "ראש העין - צפון",
        "5300": "באר יעקב",
        "5200": "רחובות (א' הדר) ",
        "5410": "יבנה מזרח",
        "9100": "ראשון לציון - הראשונים",
        "5800": "אשדוד עד הלום (מ' בר כוכבא)",
        "4250": "פתח תקווה - סגולה",
        "4100": "בני ברק",
        "7320": "באר שבע - מרכז",
        "1220": "מרכזית המפרץ (לב המפרץ)",
        "8600": "נמל תעופה בן גוריון",
        "6700": "ירושלים - מלחה",
        "5900": "אשקלון",
        "7500": "דימונה",
        "4170": "פתח תקווה  - קריית אריה",
        "5150": "לוד גני אביב",
        "8550": "להבים - רהט",
        "300": "פאתי מודיעין",
        "400": "מודיעין - מרכז",
        "4640": "צומת חולון",
        "4660": "חולון - וולפסון",
        "4680": "בת ים - יוספטל",
        "4690": "בת ים - קוממיות",
        "9800": "ראשון לציון-משה דיין",
        "9000": "יבנה מערב",
        "9600": "שדרות",
        "9650": "נתיבות",
        "9700": "אופקים",
        "3310": "נתניה - ספיר",
        "1240": "יקנעם - כפר יהושע",
        "1250": "מגדל העמק - כפר ברוך",
        "1260": "עפולה ר.איתן",
        "1280": "בית שאן",
        "1820": "אחיהוד",
        "1840": "כרמיאל",
        "2940": "רעננה מערב",
        "2960": "רעננה דרום",
        "6150": "קרית מלאכי - יואב",
        "680": "ירושלים - יצחק נבון",
        "6900": "מזכרת בתיה"
    }

    //fill the station list for drop down
function fill_from_select(select_name) {
    const lstation = station;//Object.keys(station).sort(function(a,b){ return (a.localeCompare(b, 'heb', {sensitivity: 'base'}))})
    for (var j in lstation) {
        i = j;//lstation[j]
        $("#"+select_name).append('<option value="' + i + '">' + station[i]+ '</option>');
        if (debug) console.log(select_name+" " + i + station[i])
    } 
}
    
//store selected station + update list
function changed_station_select(elem) {
    if ('localStorage' in window && window['localStorage'] !== null) {
		//use localStorage object to store data
        localStorage.setItem('from_station', $('#from_station').val());
        localStorage.setItem('dest_station', $('#dest_station').val());
	}
    update_train();
}
    
	fill_from_select('from_station');
	fill_from_select('dest_station');
    
   	if (localStorage.dest_station) {
       $('#dest_station').val(localStorage.getItem('dest_station'));
    } else {
        //set default station
   	    $('#dest_station').val(8700);
    }
   	if (localStorage.from_station) {
        $('#from_station').val(localStorage.getItem('from_station'));
    } else {
	    $('#from_station').val(4600);   
    }



