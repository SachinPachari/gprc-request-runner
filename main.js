const jsonpath = require('jsonpath');
const client = require('./client');
const { fetchServices, constructInputData } = require('./grpcClient');

const input = require('./resources/input.json');


const replaceRefs = (data, input) => {
  for (const ip of Object.keys(data)) {
    if (data[ip].startsWith('$')) {
      data[ip] = jsonpath.query(input, data[ip])[0];
    }
  }
  return data;
}

const processRPCinService = async (svcName, input) => {
  try {
    const svc = input[svcName];
    const rpcs = Object.keys(svc);
    for (let i = 0; i < rpcs.length; i++) {
      const rpcName = rpcs[i];
      const grpc = new client.GrpcCaller(svcName);
      let inputData = input[svcName][rpcName].input;
      inputData = replaceRefs(inputData, input);
      console.info(`${svcName}.${rpcName} inputData: ${JSON.stringify(inputData)}`);
      const output = await grpc.callRPC(rpcName, inputData);
      input[svcName][rpcName].output = output;
      console.info(`output: ${JSON.stringify(output)}`);
    }
  } catch (err) {
    console.error(err);
  }
}

(async function () {
  const services = Object.keys(input);
  for (const svc of services) {
    console.info(`Calling processRPCinService for ${svc}`);
    await processRPCinService(svc, input);
  }
})();