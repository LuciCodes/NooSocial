using Microsoft.AspNetCore.Mvc;

namespace NooSocial.WebServer.Controllers;

[ApiController]
[Area("api")]
[Route("[area]/[controller]")]
public class TimelinesController : ControllerBase
{
    // GET api/timelines
    [HttpGet]
    public IEnumerable<string> Get()
    {
        return new string[] { "value1", "value2" };
    }

    // GET api/timelines/5
    [HttpGet("{id}")]
    public string Get(int id)
    {
        return "value";
    }

    // POST api/timelines
    [HttpPost]
    public void Post([FromBody]string value)
    {
    }

    // PUT api/timelines/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody]string value)
    {
    }

    // DELETE api/timelines/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
}