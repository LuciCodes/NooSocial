
import { nooMocks } from './nooMocks.js';

export const nooDataStore = {

  data: {},

  isLocal: false,

  sources: [
    {
      timeline: '/api/timeline.json'
    }
  ],

  initialize() {

    this.isLocal = document.location.href.includes('localhost') || document.location.href.includes('127.0.0.1');

    if (this.isLocal) {
      // load startup mock db
      
      this.data = nooMocks.feed;
    }
  },

  get(key, callBackFunc) {

    if (!callBackFunc) callBackFunc = ()=>{};

    let returnObj = null;

    if (this.data[key] == null) {

      if (this.sources[key] != null) {

        console.log('nooDataStore.got async >', returnObj);

        $.getJSON(this.sources[key], callBackFunc);

      } else {

        console.log(`nooDataStore.get(${ key }) ERR: no data and source found.`);
        
        callBackFunc(returnObj);
      }

    } else {
      //
      returnObj = this.data[key];

      console.log('nooDataStore.got >', returnObj);

      callBackFunc(returnObj);
    }

    return returnObj;
  }
}

