let grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader'); 

const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:5001";

let paymentsProto = grpc.loadPackageDefinition(
    protoLoader.loadSync("payments.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

let payments = [];

function list(call, callback) {
    callback(null, payments);
}

function insert(call, callback) {
    var payment = call.request;
    payments.push(payment);
    callback(null, {});
}

function get(call, callback) {
    for (var i = 0; i < payments.length; i++) {
        if (payments[i].id == call.request.id) {
            return callback(null, payments[i]);
        }
    }
    callback({
        code: grpc.status.NOT_FOUND,
        details: 'Not found'
    });
}

function destroy(call, callback) {
    for (var i = 0; i < payments.length; i++) {
        if (payments[i].id == call.request.id) {
            payments.splice(i, 1);
            return callback(null, {});
        }
    }
    callback({
        code: grpc.status.NOT_FOUND,
        details: 'Not found'
    });
}

server.addService(paymentsProto.payments.PaymentService.service, { 
    list: list, 
    insert: insert,
    get: get,
    destroy: destroy
});

server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
server.start();