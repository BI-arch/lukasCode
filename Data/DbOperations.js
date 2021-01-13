const {pool, MSSQL} = require('./connect');
const fs = require('fs');
var rawdata = fs.readFileSync('./Data/queries.json');
var queries = JSON.parse(rawdata);


class DbOperations
{
    async getVendors(req, res) {
        let query = queries.getVendors
        const result = await pool.query(query)
        res.end(JSON.stringify(result.recordset))
    }

    async getProducts(req, res) {
        let query = queries.getProducts
        const result = await pool.query(query)
        res.end(JSON.stringify(result.recordset))
    }

    
async addVendor(req, res) {
    let newVendor = req.body
    newVendor = JSON.parse(newVendor)
    try {
        //const result = await pool.query(query)
        const result = await pool.request()
        .input('newVendor', MSSQL.NVarChar, newVendor.newVendor)
        .query(queries.addVendor)
        console.log(result.recordset)
        res.end(`dodano ${newVendor.newVendor}`)
    }
    catch (err) {
        console.log(err)
        res.end(err.message)
    }
}

async addBill(req, res) {
    let newBill = JSON.parse(req.body)
    console.log(newBill)
    //let query = `Insert into fct.Order OUTPUT INSERTED.OrderID values ('${newBill.vendorID.match(/\[(.+)\]/)[1]}','1','${newBill.orderDate}')`
    let query = `insert into [fct].[Order] OUTPUT INSERTED.OrderID values ('${newBill.vendorID.match(/\[(.+)\]/)[1]}', '1', '${newBill.orderDate}')`
    try {
        const result = await pool.query(query)
        newBill.lines.forEach(line => {
            console.log(`Insert for each order line - orderID: ${result.recordset[0].OrderID}, productID: ${line.productID}`)
        });
        res.end(`dodano ${result.recordset[0].OrderID}`)
    }
    catch (err) {
        console.log(err)
        res.end(err.message)
    }
}
}
const dbOperations = new DbOperations()
module.exports = dbOperations;