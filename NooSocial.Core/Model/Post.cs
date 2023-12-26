using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NooSocial.Core.Model
{
    public class Post
    {
        public string id { get; set; } = "";

        public DateTime createdAt { get; set; }

        public DateTime publishedAt { get; set; }

        public bool flagIsPublished { get; set; }

        public string authorId { get; set; } = "";

        public string authorName { get; set; } = "";

        public string text { get; set; } = "";
    }
}
