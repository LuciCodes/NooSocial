using Amazon.Lambda.APIGatewayEvents;
using Amazon.S3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace NooSocial.Core.Aws
{
    public class AwsLambdaFunction : IDisposable
    {
	    private IAmazonS3 _s3Client = new AmazonS3Client();
        
        public IAmazonS3 S3Client
        {
            get
            {
                return _s3Client;
            }

            set
            {
                _s3Client = value;
            }
        }

        public AwsLambdaFunction()
        {
        }

	    public void Dispose()
	    {
		    _s3Client.Dispose();
	    }

        public virtual  APIGatewayHttpApiV2ProxyResponse RespondError(string content, int status = 200)
        {
            Console.WriteLine("Error response: " + content);

            return new APIGatewayHttpApiV2ProxyResponse()
            {
                StatusCode = status,
                Body = JsonSerializer.Serialize(new AwsLambdaResponse() { HasError = true, Content = content })
            };
        }

        public virtual APIGatewayHttpApiV2ProxyResponse RespondSuccess(string content)
        {
            Console.WriteLine("Success response: " + content);

            return new APIGatewayHttpApiV2ProxyResponse()
            {
                StatusCode = 200,
                Body = JsonSerializer.Serialize(new AwsLambdaResponse() { HasError = false, Content = content })
            };
        }
    }
}
