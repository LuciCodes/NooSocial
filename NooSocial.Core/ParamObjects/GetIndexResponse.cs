using NooSocial.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace NooSocial.Core.ParamObjects
{
    public class GetIndexResponse
    {
        public List<Post> RecentPosts { get; set; } = new List<Post>();
    }
}
