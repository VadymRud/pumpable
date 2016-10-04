/**
 * Created by vadymrud on 28.09.16.
 */

function oauth2_login() {
    alert("sdfds");
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
}
