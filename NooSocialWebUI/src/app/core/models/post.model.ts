import { ProfileInfo } from "./profile-info.model";

export class Post {

  slug: string = '';
  description: string = '';
  text: string = '';
  emote: string = '';
  tagList: string[] = [];
  createdAt: string = '';
  updatedAt: string = '';
  author: ProfileInfo = new ProfileInfo();

  get age() {
    return '1h ago';
  }

  constructor(baseObj?: any) {

    if (baseObj) {

      Object.assign(this, baseObj);
    }
  }
}
