
import { Injectable } from "@angular/core";
import { ProfileInfo } from "../models/profile-info.model";

import { ProfilesService } from "./profiles.service";
import { TimelinesService } from "./timelines.service";

@Injectable({ providedIn: "root" })
export class ViewStateService {

  flagLoaded: boolean = false;

  flagHasUser: boolean = false;

  selectedProfile?: ProfileInfo;

  get flagHamExpanded(): boolean {

    return this.hasState('ham-expanded');
  }

  constructor(
    private profilesService: ProfilesService,
    private timelinesService: TimelinesService
  ) {}

  toggleState(state: string) {
    
    state = 'state-' + state;

    if (document.body.classList.contains(state)) {

      document.body.classList.remove(state);

    } else {

      let classAttr = document.body.getAttribute('class');

      if (state.startsWith('page-visible-') && classAttr?.includes('state-page-visible-')) {
        // pull back previous page before adding new

        this.removeStates('page-visible');

        window.setTimeout(() => {
          
          document.body.classList.add(state);

        }, 300);  //enough for pull up animation

      } else {

        document.body.classList.add(state);
      }
    }

    window.setTimeout(() => {
      
      this.saveState();

    }, 800);
  }

  setState(state: string) {
    
    state = 'state-' + state;

    document.body.classList.add(state);

    this.saveState();
  }

  removeStates(prefix: string) {

    let newClass = '';

    console.log('PRE REMOVE', document.body.getAttribute('class'));

    for (let s = 0; s < document.body.classList.length; s++) {

      if (!document.body.classList[s].startsWith('state-' + prefix)) {
        newClass += ' ' + document.body.classList[s];
      }
    }

    document.body.setAttribute('class', newClass.trim());
    
    console.log('POST REMOVE', document.body.getAttribute('class'));
  }

  toggleFeedProfile(username: string) {
    
    let panelExpanded = 'state-feed-profile-expanded';

    let state = 'state-avatar-selected-' + username;

    if (document.body.classList.contains(panelExpanded)
    &&  document.body.classList.contains(state)) {

        //re-clicked already selected, contact:
      document.body.classList.remove(panelExpanded);

    } else {
      //expands and/or switches

      this.removeStates('avatar-selected-');

      document.body.classList.add(panelExpanded);
        
      if (this.hasState(state)) {

        document.body.classList.remove(state);

        this.selectedProfile = undefined;

      } else {

        let prof = this.findProfile(username);

        if (prof != null) {

          document.body.classList.add(state);

          this.selectedProfile = prof;
          
        }
      }
    }

    
    this.saveState();
  }

  findProfile(username: string): ProfileInfo | undefined {

    let prof = this.profilesService.profiles.find(p => p.username == username);

    if (!prof) {
      this.timelinesService.timelines.forEach((t, i) => {
        t.recentAuthors.forEach((a) => {

          if (!prof) {

            //console.log('SEARCHING ' + a.username);
  
            if (a.username == username)
              prof = a;
          }
        })
      });
    }

    if (!prof) {
      this.timelinesService.timelines.forEach((t, i) => {
        t.posts.forEach((a) => {

          if (!prof) {

            //console.log('SEARCHING POSTS ' + a.author.username);
  
            if (a.author.username == username)
              prof = a.author;
          }
        })
      });
    }

    if (!prof)
      console.log(`vs.findProfile("${ username }"): profile not found.`, this.timelinesService.timelines);

    return prof;
  }

  saveState() {

    if (!this.flagLoaded)
      this.loadState();

    let val = document.body.getAttribute('class') ?? '';

    console.log(`SAVE STATE "${ val }"`);

    localStorage.setItem('noo-viewState', val);
  }

  hasState(state: string) {

    if (state.indexOf('state-') != 0)
      state = 'state-' + state;

    return document.body.classList.contains(state);
  }

  hasStateStartingWith(stateStartingWith: string) {

    let prefix = 'state-';

    for (let i = 0; i < document.body.classList.length; i++) {
      if (document.body.classList[i].indexOf(prefix + stateStartingWith) == 0)
        return true;
    }

    return false;
  }

  loadState() {

    if (this.flagLoaded) return;

    let vsInfo = localStorage.getItem('noo-viewState');

    if (vsInfo && vsInfo != '') {

      try {

        console.log(`LOADING STATE "${ vsInfo }"`);

        if (vsInfo.includes('state-avatar-selected-')) {

          let username = vsInfo.substring(vsInfo.indexOf('state-avatar-selected-')).trim().replace('state-avatar-selected-', '');

          if (username.includes(' '))
          
            username = username.substring(0, username.indexOf(' '))

            this.selectedProfile = this.findProfile(username);
        }

        if (vsInfo.includes('state-page-visible-login-subscribe') && this.flagHasUser)
          vsInfo = vsInfo.replace('state-page-visible-login-subscribe', '');

        document.body.setAttribute('class', vsInfo);

        this.flagLoaded = true;

      } catch(err){}
    }
  }
}
