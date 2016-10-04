/**
 * Created by vadymrud on 27.09.16.
 */

document.addEventListener("online", onOnline, false);

function onOnline() {
    //alert("onOnline");
}

function update( id, str ) {
    $('div#' + id).html( str );
}
function updateStatus( str ) {
    $('div#status').html( str );
}
function updateData( str ) {
    $('div#data').html( str );
}

$( document ).ready(function() {



    $("#exit").click(function () {
        navigator.app.exitApp();
        //alert("");
    });

    //barcode scaner
    $("#qr_scan").click(function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
            },
            function (error) {
                alert("Scanning failed: " + error);
            },
            {
                "preferFrontCamera" : true, // iOS and Android
                "showFlipCameraButton" : true, // iOS and Android
                "prompt" : "Place a barcode inside the scan area", // supported on Android only
                "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
            }
        );


    });


    //read SMS
    $("#listSMS").click(function () {
        $.mobile.changePage('#page_two', { transition: "flip"} );

        updateData('');
        var smsList = [];
        if(SMS) SMS.listSMS({}, function(data){
            updateStatus('sms listed as json array');
            //updateData( JSON.stringify(data) );

            var html = "";
            if(Array.isArray(data)) {
                for(var i in data) {
                    var sms = data[i];
                    smsList.push(sms);
                    html += sms.address + ": " + sms.body + "<br/>";
                }
            }
            updateData( html );
            $.mobile.changePage('#page_two', { transition: "flip"} );
        }, function(err){
            updateStatus('error list sms: ' + err);
        });
    });

    //Go to #chart page
    $("#button_start").click(function () {
        $.mobile.changePage('#page_chart', { transition: "flip"} );
    });
    //end_go

    $("#button_statistic").click(function () {
        $.mobile.changePage('#page_statistic', { transition: "flip"} );
    });
    //end_go


    //oauth2_login
    $("#oauth2_login").click(function () {

        $.oauth2({
            auth_url: 'https://accounts.google.com/o/oauth2/auth',           // required
            response_type: 'token',      // required - "code"/"token"
            token_url: 'https://accounts.google.com/o/oauth2/token',          // required if response_type = 'code'
            logout_url: '',         // recommended if available
            client_id: '156308916112-cel4143dvf83f3lsphmhetv9fr6u2pcm.apps.googleusercontent.com',          // required
            client_secret: '5P8JYz3nOOyDzcYsagLFxO5i',      // required if response_type = 'code'
            redirect_uri: ["urn:ietf:wg:oauth:2.0:oob","http://localhost"],       // required - some dummy url
            other_params: {project_id:"vrud1480",auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs"}        // optional params object for scope, state, display...
        }, function(token, response){
            // do something with token or response
            $("#logs").append("<p class='success'><b>access_token: </b>"+token+"</p>");
            $("#logs").append("<p class='success'><b>response: </b>"+JSON.stringify(response)+"</p>");
        }, function(error, response){
            // do something with error object
            $("#logs").append("<p class='error'><b>error: </b>"+JSON.stringify(error)+"</p>");
            $("#logs").append("<p class='error'><b>response: </b>"+JSON.stringify(response)+"</p>");
        });
    });

    //draw plot



});
$(document).ready(function() {
    document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
});

$(document).on( "pageshow", "#page_chart", function() {

    function makeplot() {
        Plotly.d3.csv("candlestick_dataset_2007_2009.csv", function(data){ processData(data) } );
    };

    function processData(allRows) {

        var data_open = [], data_close = [], data_high = [], data_low = [], dates = [];

        for (var i=0; i < allRows.length; i++) {
            row = allRows[i];
            data_close.push(parseFloat(row['close']));
            data_high.push(parseFloat(row['high']));
            data_low.push(parseFloat(row['low']));
            data_open.push(parseFloat(row['open']));
        }
        makePlotly( data_open, data_close, data_high, data_low );
    }


    function makePlotly( data_open, data_close, data_high, data_low ){
        var data_dates = getAllDays('2007-10-01', '2009-04-01');

        var fig = PlotlyFinance.createCandlestick({
            open: data_open,
            high: data_high,
            low: data_low,
            close: data_close,
            dates: data_dates
        });



        fig.layout.paper_bgcolor = 'black';
        fig.layout.plot_bgcolor = 'black';




        fig.layout.xaxis = {
            showline: false,
            showticklabels: false,
            range: [1200000000000, 1204000000000]
        }
        fig.layout.yaxis = {
            showline: false,
            showticklabels: false,
            range: [5, 180]
        }

        fig.layout.hovermode = false;



        Plotly.newPlot('myDiv', fig.data, fig.layout, {displayModeBar: false});
    };

// Utility Function to generate all days
    function getAllDays(start, end) {
        var s = new Date(start);
        var e = new Date(end);
        var a = [];

        while(s < e) {
            a.push(s);
            s = new Date(s.setDate(
                s.getDate() + 1
            ))
        }

        return a;
    };

    makeplot();


});

$(document).on( "pageshow", "#page_statistic", function() {

    //progress bar begin
    $('<input>').appendTo('[ data-role="content"]').attr({'name':'slider','id':'slider','data-highlight':'true','min':'0','max':'100','value':'50','type':'range'}).slider({
        create: function( event, ui ) {
            $(this).parent().find('input').hide();
            $(this).parent().find('input').css('margin-left','-9999px'); // Fix for some FF versions
            $(this).parent().find('.ui-slider-track').css('margin','0 15px 0 15px');
            $(this).parent().find('.ui-slider-handle').hide();
        }
    }).slider("refresh");

    // Test
    var i = 1;
    var interval = setInterval(function(){
        progressBar.setValue('#slider',i);
        if(i === 70) {
            clearInterval(interval);
        }
        i++;
    },20);
    //end progress bar


    var chart = new Chartist.Pie('.buble_chart_bounty', {
        series: [20,80],
        labels: [1, 2]
    }, {
        donut: true,
        showLabel: false
    });

    chart.on('draw', function(data) {
        if(data.type === 'slice') {
            // Get the total path length in order to use for dash array animation
            var pathLength = data.element._node.getTotalLength();

            // Set a dasharray that matches the path length as prerequisite to animate dashoffset
            data.element.attr({
                'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
            });

            // Create animation definition while also assigning an ID to the animation for later sync usage
            var animationDefinition = {
                'stroke-dashoffset': {
                    id: 'anim' + data.index,
                    dur: 1000,
                    from: -pathLength + 'px',
                    to:  '0px',
                    easing: Chartist.Svg.Easing.easeOutQuint,
                    // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
                    fill: 'freeze'
                }
            };

            // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
            if(data.index !== 0) {
                animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
            }

            // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
            data.element.attr({
                'stroke-dashoffset': -pathLength + 'px'
            });

            // We can't use guided mode as the animations need to rely on setting begin manually
            // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
            data.element.animate(animationDefinition, false);
        }
    });

// For the sake of the example we update the chart every time it's created with a delay of 8 seconds
    chart.on('created', function() {
        if(window.__anim21278907124) {
            clearTimeout(window.__anim21278907124);
            window.__anim21278907124 = null;
        }
        window.__anim21278907124 = setTimeout(chart.update.bind(chart), 10000);
    });


    var chart = new Chartist.Pie('.buble_chart_accuracy', {
        series: [70, 30],
        labels: [1, 2]
    }, {
        donut: true,
        showLabel: false
    });

    chart.on('draw', function(data) {
        if(data.type === 'slice') {
            // Get the total path length in order to use for dash array animation
            var pathLength = data.element._node.getTotalLength();

            // Set a dasharray that matches the path length as prerequisite to animate dashoffset
            data.element.attr({
                'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
            });

            // Create animation definition while also assigning an ID to the animation for later sync usage
            var animationDefinition = {
                'stroke-dashoffset': {
                    id: 'anim' + data.index,
                    dur: 1000,
                    from: -pathLength + 'px',
                    to:  '0px',
                    easing: Chartist.Svg.Easing.easeOutQuint,
                    // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
                    fill: 'freeze'
                }
            };

            // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
            if(data.index !== 0) {
                animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
            }

            // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
            data.element.attr({
                'stroke-dashoffset': -pathLength + 'px'
            });

            // We can't use guided mode as the animations need to rely on setting begin manually
            // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
            data.element.animate(animationDefinition, false);
        }
    });

// For the sake of the example we update the chart every time it's created with a delay of 8 seconds
    chart.on('created', function() {
        if(window.__anim21278907124) {
            clearTimeout(window.__anim21278907124);
            window.__anim21278907124 = null;
        }
        window.__anim21278907124 = setTimeout(chart.update.bind(chart), 10000);
    });


    new Chartist.Bar('.hor_chart_accuracy', {
        labels: ['Monday'],
        series: [
            [80],
            [20]
        ]
    }, {
        stackBars: true,
        seriesBarDistance: 10,
        reverseData: true,
        horizontalBars: true,
        axisY: {
            offset: 70
        }
    });


});

//progresss
var progressBar = {
    setValue:function(id, value) {
        $(id).val(value);
        $(id).slider("refresh");
    }
}
