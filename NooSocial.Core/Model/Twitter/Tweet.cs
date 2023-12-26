using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NooSocial.Core.Model.Twitter
{
    public class Tweet
    {
        public bool retweeted { get; set; }

        public string? source { get; set; }

        public string? favorite_count { get; set; }
        
        public string? in_reply_to_status_id { get; set; }
        
        public string? id { get; set; }
        
        public string? in_reply_to_user_id { get; set; }
        
        public string? retweet_count { get; set; }
        
        public string? created_at { get; set; }
        
        public bool favorited { get; set; }
        
        public string? full_text { get; set; }
        
        public string? lang { get; set; }
        
        public string? in_reply_to_screen_name { get; set; }

        public TweetEnitities? entities { get; set; }
    }

    public class TweetEnitities
    {
        public List<TweetEnitityUserMention>? user_mentions { get; set; }
        public List<TweetEnitityUrl>? urls { get; set; }
        public List<TweetEnitityMedia>? media { get; set; }
    }

    public class TweetEnitityUserMention
    {
        public string? name { get; set; }
        public string? screen_name { get; set; }
        public string? id { get; set; }
    }
    
    public class TweetEnitityUrl
    {
        public string? url { get; set; }
        public string? expanded_url { get; set; }
        public string? display_url { get; set; }
    }
    
    public class TweetEnitityHashtag
    {
        public string? text { get; set; }
    }
    
    public class TweetEnitityMedia
    {
        public string? url { get; set; }
        public string? expanded_url { get; set; }
        public string? media_url { get; set; }
        public string? media_url_https { get; set; }
        public string? id { get; set; }
        public string? type { get; set; }
        public string? display_url { get; set; }

        public TweetEnitityMediaSizes? sizes { get; set; }
    }

    public class TweetEnitityMediaSizes
    {
        public TweetEnitityMediaSize? thumb { get; set; }
        public TweetEnitityMediaSize? small { get; set; }
        public TweetEnitityMediaSize? medium { get; set; }
        public TweetEnitityMediaSize? large { get; set; }
    }

    public class TweetEnitityMediaSize
    {
        public string? w { get; set; }
        public string? h { get; set; }
        public string? resize { get; set; }
    }
}
