using NooSocial.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NooSocial.Core.Factories
{
    public static class MockFactory
    {
        public static Post CreatePost()
        {
            var rnd = new Random();

            return new Post()
            {
                id = Guid.NewGuid().ToString(),
                authorId = Guid.NewGuid().ToString(),
                createdAt = DateTime.Now.AddMinutes(rnd.Next(-200, 0)),
                flagIsPublished = true,
                publishedAt = DateTime.Now.AddMinutes(rnd.Next(-200, 0))
            };
        }
    }
}
