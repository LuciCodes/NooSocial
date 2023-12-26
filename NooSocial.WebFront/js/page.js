
var nooAuthData = {
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

var nooAppData = {
  hasAuthError: false,
  authErrorMsg: ''
}

function Page_Load() {
    
  nooAuth.initialize();
  nooDataStore.initialize();
  nooBinder.initialize();
}

function OpenLogin() {

  nooViewState.setViewState('overlay-visible');
}

function CloseLogin() {

  nooViewState.setViewState('', ['overlay-visible', 'new-password-required']);
}

function Login() {

  nooViewState.setViewState('loading', 'has-user');

  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

  var creds = {
    user: $('#txtLogin_UserName').val(),
    pass: $('#txtLogin_Password').val()
  }

  // Set up parameters for authentication
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: AWS_CLIENT_ID,
    AuthParameters: {
      USERNAME: creds.user,
      PASSWORD: creds.pass
    }
  };

  console.log('AUTH', creds);

  // Authenticate the user
  cognitoIdentityServiceProvider.initiateAuth(params, (err, data) => {

    nooViewState.setViewState('', 'loading');

    if (err) {

      if (err.name == 'NotAuthorizedException') {

        nooAuthData = { hasAuthError: true, authErrorMsg: err.message };

        $("#pnlLoginValidationMessage").html(err.message).show();

      } else {

        console.error(err);
      }

    } else {

      nooAuthData = data;

      nooAuthData.hasAuthError = false,
      nooAuthData.hasUser = true,
      nooAuthData.authErrorMsg = '';

      nooAuth.loadUserData();

      console.log('Authentication successful:', nooAuthData);

      if (data.ChallengeName == 'NEW_PASSWORD_REQUIRED') {

        nooViewState.setViewState('new-password-required');

      } else {

        nooViewState.setViewState('has-user');

        // login redirect to feed
        if (!document.location.toString().includes('feed.html')) 
          document.location = '/feed.html';
      }
    }
  });

  return false;
}

function ChangePassword() {

  nooViewState.setViewState('loading');

  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

  var params = {
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ClientId: AWS_CLIENT_ID,
    ChallengeResponses: {
      USERNAME: nooAuthData.ChallengeParameters['USER_ID_FOR_SRP'],
      NEW_PASSWORD: $('#txtChangePassword_Password').val(),
      'userAttributes.nickname': nooAuthData.ChallengeParameters['USER_ID_FOR_SRP'],
      'userAttributes.locale': 'en-US'
    },
    Session: nooAuthData.Session
  };

  console.log('Reply NEW_PASSWORD_REQUIRED', params);

  cognitoIdentityServiceProvider.respondToAuthChallenge(params, function (err, data) {

    nooViewState.setViewState('', 'loading');
    
    if (err) {

      $('#pnlChangePassword_ErrorMessage').html(err.message).show();

      console.log(err, err.stack);

    } else {

      nooAuthData.AuthenticationResult = data.AuthenticationResult;
      
      nooAuthData.hasAuthError = false;
      nooAuthData.hasUser = true;
      nooAuthData.authErrorMsg = '';

      localStorage.setItem("nooAuth", JSON.stringify(nooAuthData));

    }
  });

  return false;
}


function Logout() {

  nooViewState.setViewState('loading');

  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

  var params = {
    AccessToken: nooAuthData.AuthenticationResult.AccessToken
  };

  console.log('Calling GlobalSignOutCommand', params);

  cognitoIdentityServiceProvider.globalSignOut(params, function (err, data) {

    nooViewState.setViewState('', 'loading');
    
    if (err) {

      console.log(err, err.stack);

    } else {

      console.log('Logout OK.');

    }

    nooAuthData.AuthenticationResult = {};
    nooAuthData.UserData = {};
    nooAuthData.hasUser = false;

    localStorage.setItem("nooAuth", JSON.stringify(nooAuthData));

    document.location = '/';
  });

  return false;
}
