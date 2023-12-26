using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NooSocial.Core.ParamObjects
{
    public class ResponseData
    {
        public bool HasError { get; set; }

        public int ResponseCode { get; set; } = 200;

        public object? Content { get; set; }

        public string ContentType { get; set; } = "application/json";
    }
}
