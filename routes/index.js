const { Router } = require('express');
const { Transaction } = require('braintree');
const logger = require('debug');
const gateway = require('../lib/gateway');
const invoicelist = require('../models/List');
const UserList = require('../models/User');
const router = Router(); // eslint-disable-line new-cap
const debug = logger('braintree_example:router');
const crypto = require("crypto");
const express = require('express');
const http = require('http');
var customerId;
var payment_method_token;
var subscription_global;
var transaction;
var customer_data;
var invoice_id;
var opn = require('opn');
// http://localhost:4200/#/view/view-receipt?transaction_id=k2632r70
var frontend_url = "http://localhost:4200/#/view/view-receipt?transaction_id="

const secretKey = require('secret-key');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var secret = secretKey.create('1EEA6DC-JAM4DP2-PHVYPBN-V0XCJ9X')
console.log(secretKey.create('1EEA6DC-JAM4DP2-PHVYPBN-V0XCJ9X'));


const TRANSACTION_SUCCESS_STATUSES = [
  Transaction.Status.Authorizing,
  Transaction.Status.Authorized,
  Transaction.Status.Settled,
  Transaction.Status.Settling,
  Transaction.Status.SettlementConfirmed,
  Transaction.Status.SettlementPending,
  Transaction.Status.SubmittedForSettlement
];

function formatErrors(errors) {
  let formattedErrors = '';

  for (let [, { code, message }] of Object.entries(errors)) {
    formattedErrors += `Error: ${code}: ${message}
`;
  }

  return formattedErrors;
}

function test_subscription() {
  console.log('called subscription')
}

function createResultObject({ status }) {
  let result;

  if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
    result = {
      header: 'Sweet Success!',
      icon: 'success',
      message:
        'Your test transaction has been successfully processed.'
    };
  } else {
    result = {
      header: 'Transaction Failed',
      icon: 'fail',
      message: `Your test transaction has a status of ${status}. Please try again.`
    };
  }

  return result;
}


router.get('/', (req, res) => {
  // res.redirect('/checkouts/new');
  // res.redirect('/checkouts/new_checkout');
});

router.get('/checkouts/new_checkout/:id', (req, res) => {
  console.log('transaction_id: ', req.params.id);
  
  invoicelist.findListByTransactionId(req.params.id, (err, lists)=> {
    if(err) {
      console.log('error finding transaction', err);
      opn(frontend_url+req.params.id);
      return;
    }
    else if (lists.length == 0) {
      console.log('error finding transaction, blank list ', lists);
      invoicelist.findListById(invoice_id, (err, lists)=> {
        if(err) {
            // res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
          if ((lists[0] && lists[0].status == 'Pending') || (customer_data && customer_data.status === 'Pending')) {
            console.log('updatinggggggggggggggggg', req.params.id);
            let subscription = this.subscription;
            let transc_status;
            gateway.transaction.find(req.params.id).then(transaction => {
              // result = createResultObject(transaction);
              result = createResultObject(transaction);
                transaction = transaction;
              console.log('front urlllllllllllllllllll ben: ', frontend_url+req.params.id);
              if (TRANSACTION_SUCCESS_STATUSES.indexOf(transaction.status) !== -1)
                  transc_status = 'Successfull'
              else
                  transc_status = 'Failed'
                  let newData = {
                    invoice_id: invoice_id,
                    customer_name: customer_data.customer_name,
                    customer_phone: customer_data.customer_phone,
                    customer_email: customer_data.customer_email,
                    customer_address: customer_data.customer_address,
                    invoice_date: customer_data.invoice_date,
                    amount: customer_data.amount,
                    service: customer_data.service,
                    status: transc_status,
                    transaction_id: req.params.id
                  }
                  console.log('updating data to: ', newData);
                  
                   //Call the model method updateListById
                   invoicelist.updateListById(invoice_id, newData, (err,list) => {
                    if(err) {
                      console.log('errorrrr: ', err);
                      
                        // res.json({success:false, message: `Failed to update the list. Error: ${err}`});
                    }
                    else if(list) {
                      console.log('updated: list');
                    }
                    else {
                      console.log('ifk');
                      
                    }
                        // res.json({success:false});
                  })
                // opens the url in the default browser 
                opn(frontend_url+req.params.id);
                res.render('checkouts/show', { transaction, result, subscription });
                // res.send({status: true, message: 'Transaction data fetched successfully', data: transaction})
                // console.log('result.............................................', transaction);
                // res.render('checkouts/new_checkout', { transaction, subscription , customer_data })
            });
          }
        }
      });
    }
    else {
      console.log('lists: ', lists, customer_data);
      customer_data = lists[0];
      if ((lists[0] && lists[0].status == 'Pending') || (customer_data && customer_data.status === 'Pending')) {
        console.log('updatinggggggggggggggggg');
        
        let newData = {
          invoice_id: invoice_id,
          customer_name: customer_data.customer_name,
          customer_phone: customer_data.customer_phone,
          customer_email: customer_data.customer_email,
          customer_address: customer_data.customer_address,
          invoice_date: customer_data.invoice_date,
          amount: customer_data.amount,
          service: customer_data.service,
          status: 'Successfull',
          transaction_id: req.params.id
        }
         //Call the model method updateListById
         invoicelist.updateListById(invoice_id, newData, (err,list) => {
          if(err) {
            console.log('errorrrr: ', err);
            
              // res.json({success:false, message: `Failed to update the list. Error: ${err}`});
          }
          else if(list) {
            console.log('updated: list');
          }
          else {
            console.log('ifk');
            
          }
              // res.json({success:false});
        })
      }
      let subscription = this.subscription;
      gateway.transaction.find(req.params.id).then(transaction => {
        // result = createResultObject(transaction);
        result = createResultObject(transaction);
          transaction = transaction;
          // opens the url in the default browser 
          console.log('front urlllllllllllllllllll: ', frontend_url);
          // opn(frontend_url);
          res.send({status: true, message: 'Transaction data fetched successfully', data: transaction})
          // console.log('result.............................................', transaction);
          // res.render('checkouts/new_checkout', { transaction, subscription, customer_data })
      }), (error) => {
        console.log('errpr while finding transactionsss:', error);
        
      };
        // res.write(JSON.stringify({success: true, lists:lists},null,2));
        // res.end();
    }
  });
})

router.get('/set_invoice_id/:id', (req, res) => {
  console.log('inovice id received: ', req.params);
  
  invoice_id = req.params.id;
  res.sendStatus(200);
})

router.get('/checkouts/new', (req, res) => {
  console.log('params:', invoice_id);
  let data;
  let name;
  let service_name;
  invoicelist.findListById(invoice_id, (err, lists)=> {
    if(err) {
        res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
    }
    else {
        console.log('check lists',lists);
        data = lists[0];
        if (lists[0]) {
          name = data.customer_name;
          // if (customer_data) {
          customer_data = data;
          gateway.customer.create({
            firstName: data.customer_name,
            // lastName: "Smith",
            // company: "Braintree",
            email: data.customer_email,
            phone: data.customer_phone,
            // fax: "614.555.5678",
            // website: "www.example.com",
            payment_method_nonce: 'fake-valid-nonce',
          }, function (err, result) {
            console.log('customer created: '+err, result)
            customerId = result.customer.id;
            payment_method_token = result.customer.paymentMethods[0].token;
          });
          amount = data.amount;
          invoice_id = data.invoice_id;
          service_name = data.service;
          gateway.clientToken.generate(
            {
            // customerId: customerId
          }, function (err, response) {
          // console.log('token: ', response)
            clientToken = response.clientToken
            res.render('checkouts/new', {
              clientToken,
              amount,
              invoice_id,
              name,
              service_name,
              messages: req.flash('error')
            });
            // res.sendFile('checkouts/new.pug')
          });
        }
    }
  });
console.log('data see now: ', data);

  // let data = {
  //   invoice_id: 'a32ef7d47420d269b4a50d9f2194cf2f',
  //   customer_name: 'Anvita',
  //   customer_phone: '08851649229',
  //   customer_email: 'anvitaaps23@gmail.com',
  //   customer_address: 'D-14A, Bal Udyan road',
  //   service: 'aa222',
  //   amount: '0.10',
  // }
  this.customer_data = data;
  

  
  // gateway.clientToken.generate({}).then(({ clientToken }) => {
  //   // console.log('token: ', clientToken)
  //   res.render('checkouts/new', {
  //     clientToken,
  //     messages: req.flash('error')
  //   });
  // });
});

router.get('/checkouts/:id', (req, res) => {
  // console.log('checkout result: ', req)
  let ff = this;
  let result;
  const transactionId = req.params.id;
  let subscription;
  

  gateway.transaction.find(transactionId).then(transaction => {
    // result = createResultObject(transaction);
    gateway.subscription.create({
      paymentMethodToken: payment_method_token,
      planId: "3cqm",
      // merchantAccountId: "gbpAccount"
    }, function (err, result2) {
      // console.log(result);
      subscription = result2;
      ff.subscription = result2;
      subscription_global = result2;
      result = createResultObject(transaction);
      transaction = transaction;
      // console.log('result.............................................', transaction)
      res.render('checkouts/show', { transaction, result, subscription });
      // console.log(subscription)
    });
    // console.log(subscription)
    
    
  });
});

router.post('/checkouts', (req, res) => {
  console.log('reached checkouts',req.body);
  let ff = this;
  // In production you should not take amounts directly from clients
  const { amount, payment_method_nonce: paymentMethodNonce, invoice_id } = req.body;

  gateway.transaction
    .sale({
      amount,
      paymentMethodNonce,
      options: { submitForSettlement: true }
    })
    .then(result => {
      const { success, transaction } = result;
      ff.invoice_id = invoice_id;
      res.redirect(`checkouts/new_checkout/${transaction.id}`);
      let newData = {
        customer_name: ff.customer_data.customer_name,
        customer_phone: ff.customer_data.customer_phone,
        customer_email: ff.customer_data.customer_email,
        customer_address: ff.customer_data.customer_address,
        amount: ff.customer_data.amount,
        service: ff.customer_data.service,
        status: 'Successfull'
      }
    })
    .catch(({ errors }) => {
      console.log('error in checkouts',errors);
      req.flash('error', { msg: 'Transaction failed!!' });
      res.redirect('checkouts/new');
    });

});

//POST HTTP method to /bucketlist
router.post('/create_invoice', (req,res,next) => {
  console.log('got request:', req.body);
  
  const id = crypto.randomBytes(16).toString("hex");
  
  invoicelist.addList({
    invoice_id: id,
    customer_name: req.body.customer_name,
    customer_phone: req.body.customer_phone,
    customer_email: req.body.customer_email,
    customer_address: req.body.customer_address,
    amount: req.body.amount,
    service: req.body.service,
    invoice_date: req.body.invoice_date
    },(err, list) => {
    // console.log('called add list', newlist);
    
      if(err) {
        console.log('err:',err);
          res.json({success: false, message: `Failed to create a new list. Error: ${err}`});
      }
      else {
        console.log('list: ', list);
        
        res.json({success:true, invoice_id: id, message: "Invoice created successfully."});
      }    
    });
});

//GET HTTP method to /bucketlist
router.get('/get_invoices',(req,res) => {
  invoicelist.getAllLists((err, lists)=> {
      if(err) {
          res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
      }
      else {
          res.write(JSON.stringify({success: true, lists:lists},null,2));
          res.end();

  }
  });
});

//GET HTTP method to /bucketlist
router.get('/get_invoice_by_id/:id',(req,res) => {
  invoicelist.findListById(req.params.id, (err, lists)=> {
      if(err) {
          res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
      }
      else {
          res.write(JSON.stringify({success: true, lists:lists},null,2));
          res.end();
  }
  });
});

//PUT HTTP method to /bucketlist
router.put('/update_invoice/:id', (req,res,next) => {
  console.log('update: ', req.params, req.body);
  
  //access the parameter which is the id of the item to be updated
  let id = req.params.id;
  let newData = {
    // customer_name: req.body.customer_name,
    // customer_phone: req.body.customer_phone,
    // customer_email: req.body.customer_email,
    // customer_address: req.body.customer_address,
    // amount: req.body.amount,
    // service: req.body.service,
    status: 'Successfull'
  }

  //Call the model method updateListById
  invoicelist.updateListById(id, newData, (err,list) => {
      if(err) {
          res.json({success:false, message: `Failed to update the list. Error: ${err}`});
      }
      else if(list) {
          res.redirect('http://localhost:4200/view-invoice');
          res.json({success:true, message: "Updated successfully"});
      }
      else
          res.json({success:false});
  })
});

//GET HTTP method to /invoicelist
router.get('/get_invoice_list',(req,res) => {
  invoicelist.getAllLists((err, lists)=> {
      if(err) {
          res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
      }
      else {
          res.write(JSON.stringify({success: true, lists:lists},null,2));
          res.end();
  }
  });
});

//GET HTTP method to /bucketlist
router.post('/auth_login',(req,res) => {
  UserList.auth_login(req.body, (err, result)=> {
    console.log('..............', result);
    
      if(err) {
          res.json({success:false, message: `Failed to login. Error: ${err}`});
      }
      else if(result.length == 0) {
        res.status(401)
        res.json({success:false, message: `User not found`});
      }
      else {
          // create a token
          var token = jwt.sign(req.body, secret.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          res.write(JSON.stringify({success: true, message: 'Successfully login!', token: token},null,2));
          res.end();
      }
  });
});

router.get('/get_invoice_by_transaction_id/:id',(req,res) => {
  invoicelist.findListByTransactionId(req.params.id, (err, lists)=> {
      if(err) {
          res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
      }
      else {
          res.write(JSON.stringify({success: true, lists:lists},null,2));
          res.end();
  }
  });
});

module.exports = router;
