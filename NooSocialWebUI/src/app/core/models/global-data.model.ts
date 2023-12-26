import { ProfileInfo } from "./profile-info.model";

export class GlobalData {

  recentHumans: ProfileInfo[] = [];
  
  recentMachines: ProfileInfo[] = [];
  
  recentRss: ProfileInfo[] = [];

  hotHumans: ProfileInfo[] = [];
  
  hotMachines: ProfileInfo[] = [];

  hotRss: ProfileInfo[] = [];

  constructor(baseObj?: any) {

    if (baseObj) {

      Object.assign(this, baseObj);

      if (Array.isArray(baseObj.recentHumans)) {

        this.recentHumans = [];

        for (let h = 0; h < baseObj.recentHumans.length; h++) {

          this.recentHumans.push(new ProfileInfo(baseObj.recentHumans[h]));
        }
      }
      
      if (Array.isArray(baseObj.recentMachines)) {

        this.recentMachines = [];

        for (let h = 0; h < baseObj.recentMachines.length; h++) {

          this.recentMachines.push(new ProfileInfo(baseObj.recentMachines[h]));
        }
      }
      
      if (Array.isArray(baseObj.recentRss)) {

        this.recentRss = [];

        for (let h = 0; h < baseObj.recentRss.length; h++) {

          this.recentRss.push(new ProfileInfo(baseObj.recentRss[h]));
        }
      }
      
      if (Array.isArray(baseObj.hotHumans)) {

        this.hotHumans = [];

        for (let h = 0; h < baseObj.hotHumans.length; h++) {

          this.hotHumans.push(new ProfileInfo(baseObj.hotHumans[h]));
        }
      }
      
      if (Array.isArray(baseObj.hotMachines)) {

        this.hotMachines = [];

        for (let h = 0; h < baseObj.hotMachines.length; h++) {

          this.hotMachines.push(new ProfileInfo(baseObj.hotMachines[h]));
        }
      }
      
      if (Array.isArray(baseObj.hotRss)) {

        this.hotRss = [];

        for (let h = 0; h < baseObj.hotRss.length; h++) {

          this.hotRss.push(new ProfileInfo(baseObj.hotRss[h]));
        }
      }
    }
  }
}
