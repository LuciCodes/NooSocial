using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.Core;
using NooSocial.Core.Aws;
using System.Text.Json;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace NooSocial.AwsDbProvisioning;

public class Function : AwsLambdaFunction
{
    public async Task<string> FunctionHandler(AwsLambdaParameter param, ILambdaContext context)
    {
        List<string> results = new List<string>();

        Console.WriteLine($"Running action { param.action }");

        if (param.action.ToLower() == "create")
        {
            results = await CreateTables();
        }
        else if (param.action.ToLower() == "delete")
        {
            results = await DeleteTables(param.ids);
        }

        string res = JsonSerializer.Serialize(results);

        Console.WriteLine($"Action Results: { res }");

        return res;
    }

    private async Task<List<string>> CreateTables()
    {
        List<string> results = new List<string>();

        List<string> tables = new List<string>()
        {
            "noo-test-1",
            "noo-test-2"
        };

        foreach (var table in tables)
        {
            try
            {
                AmazonDynamoDBClient client = new AmazonDynamoDBClient();

                var tablesResponse = await client.ListTablesAsync();

                var existingTables = tablesResponse.TableNames;

                if (!existingTables.Contains(table))
                {
                    var request = new CreateTableRequest
                    {
                        TableName = table,
                        AttributeDefinitions = new List<AttributeDefinition>()
                        {
                            new AttributeDefinition
                            {
                                AttributeName = "Id",
                                AttributeType = "N"
                            }
                        },
                        KeySchema = new List<KeySchemaElement>()
                        {
                            new KeySchemaElement
                            {
                                AttributeName = "Id",
                                KeyType = "HASH"  //Partition key
                            }
                        },
                        ProvisionedThroughput = new ProvisionedThroughput
                        {
                            ReadCapacityUnits = 10,
                            WriteCapacityUnits = 5
                        }
                    };
                
                    Console.WriteLine($"Calling CreateTable [{ table }]");

                    var createResponse = await client.CreateTableAsync(request);
                
                    var tableDescription = createResponse.TableDescription;

                    string status = tableDescription.TableStatus;

                    Console.WriteLine($"Table status: { createResponse.TableDescription.TableStatus}");

                    if (createResponse.HttpStatusCode == System.Net.HttpStatusCode.OK)
                    {
                        Console.WriteLine($"Calling CreateTable OK");

                        results.Add($"OK  Table {table}");
                    }
                    else
                    {
                        Console.WriteLine($"Calling CreateTable NOK: { createResponse.HttpStatusCode }");

                        results.Add($"NOK Table {table}");
                    }
                }
                else
                {
                    results.Add($"NOK Table {table} exists.");
                }
            }
            catch (Exception exCreate)
            {
                Console.WriteLine($"Error creating table { table }: {exCreate.Message}\r\n{exCreate.StackTrace}");

                results.Add($"EX  Table {table}: { exCreate.Message }");
            }
        }

        return results;
    }
    
    private async Task<List<string>> DeleteTables(List<string> tableNames)
    {
        List<string> results = new List<string>();

        foreach (var table in tableNames)
        {
            try
            {
                AmazonDynamoDBClient client = new AmazonDynamoDBClient();

                var request = new DeleteTableRequest
                {
                    TableName = table
                };

                Console.WriteLine($"Calling DeleteTable on [{ table }]");

                var response = await client.DeleteTableAsync(request);

                Console.WriteLine($"Calling DeleteTable OK");
                
                results.Add($"OK  Table {table}");
            }
            catch (Exception exCreate)
            {
                Console.WriteLine($"Error creating table { table }: {exCreate.Message}\r\n{exCreate.StackTrace}");

                results.Add($"EX  Table {table}: { exCreate.Message }");
            }
        }

        return results;
    }
}
