using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NooSocial.Core.Aws
{
    public class AwsLambdaResponse
    {
        public bool HasError { get; set; } = false;

        public string Content { get; set; } = "";
    }
}
