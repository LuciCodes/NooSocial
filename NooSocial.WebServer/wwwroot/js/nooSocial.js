
function Page_Load() {
    
  gAuth.initialize();
}

// Takes either param, and they can be one string or array
function SetViewState(stateAdd, stateRemove) {

  let body = $('body');

  if (stateAdd && stateAdd != '')
  {
    if (!Array.isArray(stateAdd))
      stateAdd = [stateAdd];

    stateAdd.forEach((element) => body.addClass('state-' + element));
  }
   
  if (stateRemove && stateRemove != '')
  {
    if (!Array.isArray(stateRemove))
    stateRemove = [stateRemove];

    stateRemove.forEach((element) => body.removeClass('state-' + element));
  } 
}

function SetViewStateAndSave(stateAdd, stateRemove) {

  SetViewState(stateAdd, stateRemove);

  if (stateAdd && stateAdd != '') {
    
    localStorage.setItem('nooViewState', stateAdd);

  } else {

    localStorage.removeItem('nooViewState');
  }
}

function HasViewState(state) {

  return $('body').hasClass('state-' + state);
}

function OpenLogin() {

  SetViewState('overlay-visible');
}

function CloseLogin() {

  SetViewState('', ['overlay-visible', 'new-password-required']);
}

function Login() {

  SetViewState('loading', 'has-user');

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

    SetViewState('', 'loading');

    if (err) {

      if (err.name == 'NotAuthorizedException') {

        gAuthData = { hasAuthError: true, authErrorMsg: err.message };

        $("#pnlLoginValidationMessage").html(err.message).show();

      } else {

        console.error(err);
      }

    } else {

      gAuthData = data;

      gAuthData.hasAuthError = false,
      gAuthData.hasUser = true,
      gAuthData.authErrorMsg = '';

      gAuth.loadUserData();

      console.log('Authentication successful:', gAuthData);

      if (data.ChallengeName == 'NEW_PASSWORD_REQUIRED') {

        SetViewState('new-password-required');

      } else {

        SetViewState('has-user');

        // login redirect to feed
        if (!document.location.toString().includes('feed.html')) 
          document.location = '/feed.html';
      }
    }
  });

  return false;
}

function ChangePassword() {

  SetViewState('loading');

  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

  var params = {
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ClientId: AWS_CLIENT_ID,
    ChallengeResponses: {
      USERNAME: gAuthData.ChallengeParameters['USER_ID_FOR_SRP'],
      NEW_PASSWORD: $('#txtChangePassword_Password').val(),
      'userAttributes.nickname': gAuthData.ChallengeParameters['USER_ID_FOR_SRP'],
      'userAttributes.locale': 'en-US'
    },
    Session: gAuthData.Session
  };

  console.log('Reply NEW_PASSWORD_REQUIRED', params);

  cognitoIdentityServiceProvider.respondToAuthChallenge(params, function (err, data) {

    SetViewState('', 'loading');
    
    if (err) {

      $('#pnlChangePassword_ErrorMessage').html(err.message).show();

      console.log(err, err.stack);

    } else {

      gAuthData.AuthenticationResult = data.AuthenticationResult;
      
      gAuthData.hasAuthError = false;
      gAuthData.hasUser = true;
      gAuthData.authErrorMsg = '';

      localStorage.setItem("nooAuth", JSON.stringify(gAuthData));

    }
  });

  return false;
}


function Logout() {

  SetViewState('loading');

  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

  var params = {
    AccessToken: gAuthData.AuthenticationResult.AccessToken
  };

  console.log('Calling GlobalSignOutCommand', params);

  cognitoIdentityServiceProvider.globalSignOut(params, function (err, data) {

    SetViewState('', 'loading');
    
    if (err) {

      console.log(err, err.stack);

    } else {

      console.log('Logout OK.');

    }

    gAuthData.AuthenticationResult = {};
    gAuthData.UserData = {};
    gAuthData.hasUser = false;

    localStorage.setItem("nooAuth", JSON.stringify(gAuthData));

    document.location = '/';
  });

  return false;
}

function ToggleContentMenu() {

  if (HasViewState('content-menu-visible')) {

    SetViewStateAndSave('', 'content-menu-visible');

  } else {

    SetViewStateAndSave('content-menu-visible');
  }
}