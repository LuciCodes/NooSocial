
import { Post } from './post.model';
import { ProfileInfo } from './profile-info.model';

export class Timeline {

  slug: string = '';
  title: string = '';
  description: string = '';
  icon: string = 'watch';
  posts: Post[] = [];
  recentAuthors: ProfileInfo[] = [];

  constructor(baseObj?: any) {

    if (baseObj) {

      Object.assign(this, baseObj);

      if (baseObj.posts) {

        this.posts = [];

        for (let p = 0; p < baseObj.posts.length; p++) {
          this.posts.push(new Post(baseObj.posts[p]));
        }
      }
      
      if (baseObj.recentAuthors) {

        this.recentAuthors = [];

        for (let p = 0; p < baseObj.recentAuthors.length; p++) {
          this.recentAuthors.push(new ProfileInfo(baseObj.recentAuthors[p]));
        }
      }
    }
  }
}
