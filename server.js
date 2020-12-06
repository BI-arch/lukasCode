const server = require("connect")();
const static = require("serve-static");
const port = 80
const MSSQL = require('mssql')
const body = require('body-parser')

/* const pool = new MSSQL.ConnectionPool({
    user: 'lukasz',
    password: 'Szukasz2020',
    server: 'biarchsql.database.windows.net',
    database: 'BI001_CST'
}) */

/* pool.connect(err => {
    if(err) {
        console.log('Error: ', err)
      }
      // If no error, then good to go...
      else {
          console.log("sql connected succesfully")
      }
}) */

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
server.use("/getVendors", getVendors)

//Display products list for path /products
server.use("/getProducts", getProducts)

//Add vendors to data base
server.use("/addVendor", addVendor)

//response Fack You for all other urls
server.use((req, res) => {
    res.end("Fuck You, there is no " + req.url)
})

server.listen(port)
console.log("server listening on port: " + port )

async function getVendors(req, res) {
    let query = "Select vendorName from dim.Vendor "
    //const result = await pool.query(query)
    const result = {recordset: [{name: "Biedra"}]}
    res.end(JSON.stringify(result.recordset))
}

async function getProducts(req, res) {
    let query = "Select productName from dim.Product "
    //const result = await pool.query(query)
    const result = {recordset: [{name: "Biedra"}]}
    res.end(JSON.stringify(result.recordset))
}


async function addVendor(req, res) {
    let newVendor = req.body
    let query = `Insert into dim.Vendor values('${newVendor}')`
    try {
        //const result = await pool.query(query)
        const result = {recordset: [{name: "Biedra"}]}
        console.log(result)
        res.end(`dodano ${newVendor}`)
    }
    catch (err) {
        console.log(err)
        res.end(err.message)
    }

}
