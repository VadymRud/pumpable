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

        }, function(err){
            updateStatus('error list sms: ' + err);
        });
    });


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



});