
## GRPC Request Runner:
This tool is meant to run many grpc requests and display the response in the terminal. 

### Installation:
Clone the repo and run the below command. 
```
npm install
```

### Configuration:
The configuration file is at `resources/input.json` the structure of this file is as below 

```json
{
  "<Service1Name>":{
    "<RPC>" : {
      "input":{
        "input1": "value1",
        "input2": "value2"
      },
      "output": {}
    }
  },
  "<Service2Name>":{
    "<RPC>" : {
      "input":{
        "input1": "$.Service1Name.RPC.input.input1",
        "input2": "$.Service1Name.RPC.output.output1"
      },
      "output": {}
    }
  }
}
```

Note:
* the output json object is left out as a place holder and will be populated once the request is completed. 
* We can do a reference path using `$.<ServiceName>.<RPC>....` this is based on the lib [jsonpath](https://www.npmjs.com/package/jsonpath)
* Once the configuration is complete use `npm start` to execute.


#### Refs: 
[JSONPath](https://www.npmjs.com/package/jsonpath)