
export class ProfileInfo {

  username: string = '';
  nickname: string = '';
  bio: string= '';
  avatar: string= '';
  
  type: string = '';  // human: h | machine: m | rss: r

  constructor(baseObj?: any) {

    if (baseObj) {

      Object.assign(this, baseObj);
    }

    if (!this.nickname || this.nickname == '')
      this.nickname = this.username;

    if (!this.type || this.type == '')
      this.type = 'h';
  }
}
