import { User } from "./user.model";

export class AuthData {
  
  public ChallengeName: string = '';
  public ChallengeParameters: string = '';
  public Session: string = '';
  public AuthenticationResult: any = {};
  public hasAuthError: boolean = false;
  public hasUser: boolean = false;
  public UserData?: User;

  constructor(baseObj?: any) {

    if (baseObj) {

      Object.assign(this, baseObj);

      if (baseObj.UserData) {

        this.UserData = baseObj.UserData;
      }
    }
  }
}
