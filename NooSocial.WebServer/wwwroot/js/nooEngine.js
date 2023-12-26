
var gAppEngine = {

  setState(newState) {

    if (newState == 'session-lost') {

      $('body').removeClass('state-has-user');

      $('body').addClass('state-lost-session');
    }
  }
}