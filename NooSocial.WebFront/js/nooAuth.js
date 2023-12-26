
export const nooAuth = {

  initialize() {

    let localData = localStorage.getItem("nooAppData");

    try {

      if (localData != null) gAppData = JSON.parse(localData);

    } catch (err) { }

    nooAuthData = localStorage.getItem("nooAuth");

    try {

      if (nooAuthData != null) nooAuthData = JSON.parse(nooAuthData);

    } catch (err) {
      nooAuthData = null;
    }

    console.log("Has Auth? ", nooAuthData);
    
    if (nooAuthData != null) {

      if (nooAuthData.ChallengeName == 'NEW_PASSWORD_REQUIRED') {

        nooViewState.setViewState('new-password-required');

        $('#lblChangePassword_AccountName').html(nooAuthData.ChallengeParameters['USER_ID_FOR_SRP']);

      } else {

        // we're good... but gotta check other ChallengeNames later

        nooAuth.loadUserData();
      }
    }

    console.log('AWS Setting region ' + AWS_REGION);

    AWS.config.update({
      region: AWS_REGION
    });

    console.log('AWS Setting pool ' + AWS_POOL_ID);
    
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWS_POOL_ID,
      Logins: {
        'www.amazon.com': 'AMAZONTOKEN'
      }
    }, {
      region: AWS_POOL_REGION,
      httpOptions: { timeout: 100}
    });

    let prevViewState = localStorage.getItem('nooViewState');

    if (prevViewState != null && prevViewState != '') nooViewState.setViewState(prevViewState);

  },

  loadUserData() {
    
    try {

      if (!nooAuthData.AuthenticationResult.IdToken || nooAuthData.AuthenticationResult.IdToken == '') return;

      let content = AWS.util.base64.decode(nooAuthData.AuthenticationResult.IdToken).toString('utf-8');

      if (content.includes('{"sub"')) {
  
        content = content.substr(content.indexOf('{"sub"'));
        content = content.substr(0, content.lastIndexOf('"}') + 2);
      }
  
      //console.log('CONTENT:', content);
  
      const payload = JSON.parse(content);
      
      //console.log("Token is valid. Payload:", payload);
  
      nooAuthData.UserData = payload;
      nooAuthData.hasUser = true;
  
      nooViewState.setViewState('has-user');
  
      localStorage.setItem("nooAuth", JSON.stringify(nooAuthData));

    } catch(err) {

      console.log(`Error in loadUserData; user set? { nooAuthData.hasUser }:`, err);
    }
  }
}
