
var AWS_CLIENT_ID = '3a5hs6krqoi6l9gb865hdjvt49';
var AWS_POOL_ID = 'us-east-1:d53ff051-43c5-49a0-b5c8-f998035f9ca1';

var gAuthData = {
  ChallengeName: '',
  ChallengeParameters: {},
  Session: '',
  AuthenticationResult: {},
  hasAuthError: false,
  hasUser: false,
  UserData: {
    sub: '',
    email_verified: false,
    iss: '',
    "cognito:username": '',
    locale: 'en-US',
    origin_jti: '',
    aud: '',
    event_id: '',
    token_use: '',
    auth_time: 1702218810,
    nickname: '',
    exp: 1702222410,
    iat: 1702218810,
    jti: '',
    email: ''
  },
  authErrorMsg: ''
}

var gAppData = {
  hasAuthError: false,
  authErrorMsg: ''
}

var gAuth = {

  initialize() {

    let localData = localStorage.getItem("nooAppData");

    try {

      if (localData != null) gAppData = JSON.parse(localData);

    } catch (err) { }

    gAuthData = localStorage.getItem("nooAuth");

    try {

      if (gAuthData != null) gAuthData = JSON.parse(gAuthData);

    } catch (err) {
      gAuthData = null;
    }

    console.log("Has Auth? ", gAuthData);
    
    if (gAuthData != null) {

      if (gAuthData.ChallengeName == 'NEW_PASSWORD_REQUIRED') {

       SetViewState('new-password-required');

        $('#lblChangePassword_AccountName').html(gAuthData.ChallengeParameters['USER_ID_FOR_SRP']);

      } else {

        // we're good... but gotta check other ChallengeNames later

        gAuth.loadUserData();
      }

      gAuth.bind();
    }

    console.log('AWS Setting region...');

    AWS.config.update({
      region: 'us-east-1'
    });

    console.log('AWS Setting pool...');
    
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWS_POOL_ID,
      Logins: {
        'www.amazon.com': 'AMAZONTOKEN'
      }
    }, {
      region: 'us-east-1',
      httpOptions: { timeout: 100}
    });

    
    let prevViewState = localStorage.getItem('nooViewState');

    if (prevViewState != null && prevViewState != '') SetViewState(prevViewState);

  },

  loadUserData() {
    
    try {

      if (!gAuthData.AuthenticationResult.IdToken || gAuthData.AuthenticationResult.IdToken == '') return;

      let content = AWS.util.base64.decode(gAuthData.AuthenticationResult.IdToken).toString('utf-8');

      if (content.includes('{"sub"')) {
  
        content = content.substr(content.indexOf('{"sub"'));
        content = content.substr(0, content.lastIndexOf('"}') + 2);
      }
  
      console.log('CONTENT:', content);
  
      const payload = JSON.parse(content);
      
      console.log("Token is valid. Payload:", payload);
  
      gAuthData.UserData = payload;
      gAuthData.hasUser = true;
  
      SetViewState('has-user');
  
      localStorage.setItem("nooAuth", JSON.stringify(gAuthData));

    } catch(err) {

      console.log(`Error in loadUserData; user set? { gAuthData.hasUser }:`, err);
    }
  },

  bind() {

    $('[noo-auth-bind]').each(function(i, el) {

      el = $(el);

      el.html(gAuthData.UserData[el.attr('noo-auth-bind')]);
    })
  }
}