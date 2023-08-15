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


class GrpcCaller {
  constructor(svcName) {
    const service = ftlProto[svcName]
    const client = new service(grpcServerAddress, grpc.credentials.createInsecure());
    this.client = client;
  }

  callRPC(rpcName, input) {
    const rpc = this.client[rpcName];
    if (!rpc) {
      new Error("RPC does not exist in the client");
    }

    return new Promise((resolve, reject) => {
      this.client[rpcName]({
        ...input
      }, function (err, response) {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    })
  }
}


const executeRPC = (rpc) => {
  return new Promise((resolve, reject) => {
    rpc({
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

module.exports = { GrpcCaller, executeRPC }



// module.exports = {
//   getRPC: (name, rpcName) => {
//     const service = ftlProto[`${name}Service`]
//     const client = new service(grpcServerAddress, grpc.credentials.createInsecure());
//     const rpc = client[rpcName];
//     if (!rpc) {
//       new Error("RPC does not exist in the client");
//     }
//     return rpc;
//   },
//   callRPC: (rpc, data) => {

//     rpc(data)
//   }
// }


// // const grpc = require('@grpc/grpc-js');

// // const protoLoader = require('@grpc/proto-loader');

// // const PROTO_PATH = __dirname + '/ftl.proto';

// // const grpcServerAddress = 'localhost:8080'

// // const packageDefinition = protoLoader.loadSync(
// //   PROTO_PATH, {
// //   keepCase: true,
// //   longs: String,
// //   enums: String,
// //   defaults: true,
// //   oneofs: true,
// // });

// // // Use Package name to fetch the ftl proto object
// // const ftlProto = grpc.loadPackageDefinition(packageDefinition).schema.ftl.v1;

// // function main() {
// //   // Sample for HealthService
// //   const healthClient = new ftlProto.HealthService(grpcServerAddress, grpc.credentials.createInsecure());
// //   healthClient.Get({}, function (err, response) {
// //     console.log('Data:', response); // API response
// //     console.log(err);
// //   });

// //   // Sample for OwnerService
// //   const ownerClient = new ftlProto.OwnerService(grpcServerAddress, grpc.credentials.createInsecure());
// ownerClient.Create({
//   name: 'name',
//   namespace: 'nss'
// }, function (err, response) {
//   console.log('Data:', response); // API response
//   console.log(err);
// });
// // }


// // main();
