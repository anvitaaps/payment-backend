//Require mongoose package
const mongoose = require('mongoose');

//Define InvoiceList with title, description and category
const InvoiceListSchema = mongoose.Schema({
    invoice_id: {
        type: String,
        required: true
    },
    customer_name: String,
    customer_phone: String,
    customer_address: String,
    customer_email: {
        type:String,
        required: true,
        unique: true
    },
    amount: String,
    service: String,
    status: String,
    transaction_id:  String,
    invoice_date: Date,
    transaction_date: Date
});

const InvoiceList = module.exports = mongoose.model('InvoiceList', InvoiceListSchema, 'InvoiceList' );

//InvoiceList.find() returns all the lists
module.exports.getAllLists = (callback) => {
    console.log('call invoice')
    InvoiceList.find(callback);
}

//newList.save is used to insert the document into MongoDB
module.exports.addList = (newList, callback) => {
    console.log('new list: ', newList);
    var user = new InvoiceList();
        user.invoice_id = newList.invoice_id;
        user.customer_name = newList.customer_name;
        user.customer_phone = newList.customer_phone;
        user.customer_email = newList.customer_email;
        user.customer_address = newList.customer_address;
        user.service = newList.service;
        user.amount = newList.amount;
        user.invoice_date = newList.invoice_date;
        user.status = 'Pending'
        user.save(callback)
        // user.save(function(err, data) {
        //     console.log('err: ',err, data);
            
        // })
}

//Here we need to pass an id parameter to InvoiceList.find
module.exports.findListById = (id, callback) => {
    let query = {invoice_id: id};
    InvoiceList.find(query, callback);
}

//Here we need to pass an id parameter to InvoiceList.find
module.exports.findListByTransactionId = (id, callback) => {
    console.log('fgg');
    
    let query = {transaction_id: id};
    InvoiceList.find(query, callback);
}

//Here we need to pass an id parameter to InvoiceList.remove
module.exports.deleteListById = (id, callback) => {
    let query = {_id: id};
    InvoiceList.remove(query, callback);
}

//Here we need to pass an id parameter to InvoiceList.updateOne
module.exports.updateListById = (id, newData,callback) => {
    let query = {invoice_id: id};
    InvoiceList.replaceOne(query, newData, callback);
}