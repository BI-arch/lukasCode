const server = require("connect")();
const static = require("serve-static");
const port = process.env.PORT || 80
const body = require('body-parser')
const dbOperations = require('./Data/DbOperations')

console.log(port)

//I have moved connect part into separate file.
var pool = require('./Data/connect');

//log details every request
server.use((req, res, next) => {
    console.log("request received on " + new Date())
    console.log("request received from " + req.headers.host + req.url)
    next()
})

server.use(body.text())

//serves content of public_luk if url request is /home
server.use("/home",static("public_luk"))

//serves content of public_bills if url request is /
server.use("/",static("public_bills"))

//Display vendors list for path /getVendors
server.use("/getVendors", dbOperations.getVendors)

//Display products list for path /products
server.use("/getProducts", dbOperations.getProducts)

//Add vendors to data base
server.use("/addVendor", dbOperations.addVendor)

//Add bills to data base
server.use("/addBill", dbOperations.addBill)


//response Fack You for all other urls
server.use((req, res) => {
    res.end("Fuck You, there is no " + req.url)
})

server.listen(port)
console.log("server listening on port: " + port )