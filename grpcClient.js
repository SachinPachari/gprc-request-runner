const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/schema/proto/v1/ftl.proto';
const grpcServerAddress = 'localhost:8080'

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Use Package name to fetch the ftl proto object
const ftlProto = grpc.loadPackageDefinition(packageDefinition).schema.ftl.v1;

const ownerClient = new ftlProto.OwnerService(grpcServerAddress, grpc.credentials.createInsecure());
const MContextClient = new ftlProto.MContextService(grpcServerAddress, grpc.credentials.createInsecure());

const ownerServiceCreate = (fnName) => {
  return new Promise((resolve, reject) => {
    console.info(ownerClient['Create'] === ownerClient.Create);
    ownerClient.Create({
      name: 'name',
      namespace: 'nss'
    }, function (err, response) {
      if (err) {
        reject(err);
      }
      resolve(response);
    });
  })
}

const fetchServices = () => {
  let results = {};
  for (const item of Object.keys(ftlProto)) {
    if (typeof ftlProto[item] === 'function') {
      results[item] = ftlProto[item];
    }
  }
  return results;
}

const handleInputField = (fields) => {
  let data = {};
  if (fields.length !== 0) {
    const fieldNames = fields.filter(f => f.name);
    for (const fn in fieldNames) {
      if (fieldNames[fn].typeName === "") {
        data[fieldNames[fn].name] = ""
      } else {

      }
    }
  }
  return data;
}

const createIpObj = (rpcs) => {
  const res = {};
  for (const rpc of Object.keys(rpcs)) {
    console.info(rpcs[rpc].requestType.type.field);
    const inputFields = rpcs[rpc].requestType.type.field;
    const outputFields = rpcs[rpc].responseType.type.field;
    res[rpc] = {};
    res[rpc].input = handleInputField(inputFields);
    res[rpc].output = {};

    // if (fields.length !== 0) {
    //   const fieldNames = fields.filter(f => f.name);
    //   for (const fn in fieldNames) {
    //     res[rpc].input[fieldNames[fn].name] = ""
    //   }
    // }
  }
  return res;
}



const constructInputData = () => {
  let results = {};
  const services = fetchServices();
  for (const svc of Object.keys(services)) {
    results[svc] = createIpObj(services[svc].service);
  }
  return results;
}

module.exports = {
  ownerServiceCreate,
  fetchServices,
  constructInputData
}

// const uploadFile = (fileName, id) => {
//   return new Promise((resolve, reject) => {
//     const fileContent = fs.readFileSync(fileName)

//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: `job-${id}.jpg`,
//       Body: fileContent
//     }

//     s3.upload(params, (err, data) => {
//       if (err) {
//         reject(err)
//       }
//       resolve(data.Location)
//     })
//   })
// }
