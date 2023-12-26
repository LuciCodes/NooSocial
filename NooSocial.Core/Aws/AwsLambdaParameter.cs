using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NooSocial.Core.Aws
{
    public class AwsLambdaParameter
    {
        public string action { get; set; } = "";

        public List<string> ids { get; set; } = new List<string>();
    }
}
