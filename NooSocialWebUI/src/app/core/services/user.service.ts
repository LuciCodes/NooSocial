import AWS from 'aws-sdk';

import { Buffer } from 'buffer';

import { JwtService } from "./jwt.service";
import { map, distinctUntilChanged, tap, shareReplay } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user.model";
import { Router } from "@angular/router";

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from 'rxjs';

import { CognitoJwtVerifier } from "aws-jwt-verify";

import { AuthData } from '../models/authData.model';


@Injectable({ providedIn: "root" })
export class UserService {

  private AWS_REGION = 'us-east-1';
  private AWS_CLIENT_ID = '3a5hs6krqoi6l9gb865hdjvt49';
  
  private AWS_POOL_ID = 'us-east-1:d53ff051-43c5-49a0-b5c8-f998035f9ca1';
  private AWS_POOL_REGION = 'us-east-1';

  private flagInitialized = false;
  
  private config = {
    apiVersion: '2016-04-18',
    region: 'us-east-1',
  }

  private cognitoIdentity;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

  public signInError: string = '';
  
  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService,
    private readonly router: Router
  ) {

    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);

    this.initialize();
  }

  public initialize() {

    if (!this.flagInitialized) {
          
      /*
      let localData = localStorage.getItem("nooAppData");

      try {

        let appData = {};

        if (localData != null) appData = JSON.parse(localData);

      } catch (err) { }
      */

      let nooAuthData = localStorage.getItem("nooAuth");

      try {

        if (nooAuthData != null) nooAuthData = JSON.parse(nooAuthData);

      } catch (err) {
        nooAuthData = null;
      }

      console.log("Has Auth? ", nooAuthData);
      
      if (nooAuthData != null) {

        this.loadUserData(nooAuthData);
      }

      console.log('AWS Setting region ' + this.AWS_REGION);
      
      AWS.config.update({
        region: this.AWS_REGION
      });

      console.log('AWS Setting pool ' + this.AWS_POOL_ID);
      
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.AWS_POOL_ID,
        Logins: {
          'www.amazon.com': 'AMAZONTOKEN'
        }
      }, {
        region: this.AWS_POOL_REGION,
        httpOptions: { timeout: 100}
      });

      this.flagInitialized = true;
    }
  }

  public async loadUserData(data: any) {
    
    try {

      //if (!nooAuthData.AuthenticationResult.IdToken || nooAuthData.AuthenticationResult.IdToken == '') return;

      if (data.ChallengeName == 'NEW_PASSWORD_REQUIRED') {

        //nooViewState.setViewState('new-password-required');

        console.log('Authentication NEW_PASSWORD_REQUIRED');

      } else {

        if (!data.AuthenticationResult || data.AuthenticationResult.IdToken == '') return;

        //let content = AWS.util.base64.decode(data.AuthenticationResult.IdToken).toString('utf-8');

        let content = Buffer.from(data.AuthenticationResult.IdToken, 'base64').toString();

        console.log('CONTENT:', content);

        if (content.includes('{"sub"')) {

          content = content.substring(content.indexOf('{"sub"'));
          content = content.substring(0, content.lastIndexOf('"}') + 2);
        }
        
        try {

          const userData = JSON.parse(content);

          let authData = new AuthData({
            hasUser: true,
            UserData: userData,
            AuthenticationResult: data.AuthenticationResult,
            ChallengeName: data.ChallengeName,
            ChallengeParameters: data.ChallengeParameters,
            Session: data.Session
          })

          this.setAuth(authData.UserData as User);

          this.jwtService.saveToken(data.AuthenticationResult.AccessToken);

          this.currentUserSubject.next(authData.UserData as User);

          localStorage.setItem("nooAuth", JSON.stringify(authData));

        } catch {

          console.log("Token not valid!");
        }
      }
  
    } catch(err) {

      console.log(`Error in loadUserData; user set? { nooAuthData.hasUser }:`, err);
    }
  }

  public async signInUser(username: string, password: string) {

    //const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

    this.initialize();

    this.signInError = '';

    // Set up parameters for authentication
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.AWS_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    };

    console.log('AUTH', params);

    try {

      let data = await this.cognitoIdentity.initiateAuth(params).promise();
            
      console.log('Authentication successful:', data);

      this.loadUserData(data);
      
      return true;

    } catch (error: any) {

      console.log('SIGNIN ERROR:', error);

      if (!error) error = '';

      let errMsg = error.toString();

      if (errMsg.includes('Exception'))
        errMsg = errMsg.substring(errMsg.indexOf('Exception') + 11).trim();

      this.signInError = errMsg;
    }

    return false;
  }

  
  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ user: User }> {
    
    return this.http
      .post<{ user: User }>("/users/login", { user: credentials })
      .pipe(tap(({ user }) => this.setAuth(user)));
  }

  register(credentials: {
    username: string;
    email: string;
    password: string;
  }): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>("/users", { user: credentials })
      .pipe(tap(({ user }) => this.setAuth(user)));
  }

  logout(): void {
    this.purgeAuth();
    void this.router.navigate(["/"]);
  }

  getCurrentUser(): Observable<{ user: User }> {
    
    return new Observable<{ user: User }>((observer) => {
      
      let uData = localStorage.getItem('nooAuth') || '{}';

      let userdata = JSON.parse(uData);

      observer.next({ user: userdata });

      observer.complete();
    });
  }

  update(user: Partial<User>): Observable<{ user: User }> {
    return this.http.put<{ user: User }>("/user", { user }).pipe(
      tap(({ user }) => {
        this.currentUserSubject.next(user);
      })
    );
  }

  setAuth(user: User): void {
    this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
  }

  purgeAuth(): void {

    localStorage.removeItem('nooAuth');

    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }
}