let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

let paymentsProto = grpc.loadPackageDefinition(
    protoLoader.loadSync("payments.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

const REMOTE_SERVER = "0.0.0.0:5001";
let client = new paymentsProto.payments.PaymentService(REMOTE_SERVER, grpc.credentials.createInsecure());

function printResponse(error, response) {
    if (error) {
        console.log('Error: ', error);
    } else {
        console.log(response);
    }
}

function listPayments() {
    client.list({}, function(error, payments) {
        console.log(payments);
        printResponse(error, payments);
    });
}

function insertPayment(id, description, price) {
    var payment = {
        id: parseInt(id),
        description: description,
        price: parseInt(price)
    };

    client.insert(payment, function(error, empty) {
        printResponse(error, empty);
    });
}

function getPayment(id) {
    client.get({ id: parseInt(id)}, function(error, payment) {
        printResponse(error, payment);
    });
}

function destroyPayment(id) {
    client.destroy({ id: parseInt(id) }, function(error, empty) {
        printResponse(error, empty);
    });
}

const processName = process.argv.shift();
const scriptName = process.argv.shift();
const command = process.argv.shift();

switch (command) {
    case 'list':
        listPayments();    
        break;
    
    case 'insert':
        insertPayment(process.argv[0], process.argv[1], process.argv[2]);
        break;

    case 'get':
        getPayment(process.argv[0]);
        break;

    case 'destroy':
        destroyPayment(process.argv[0]);
        break;

    default:
        break;
}