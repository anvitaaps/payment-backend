//Require mongoose package
const mongoose = require('mongoose');

//Define UserList with title, description and category
const UserListSchema = mongoose.Schema({
    user_type: {
        type: String,
        required: true
    },
    user_email: {
        type:String,
        required: true,
        unique: true
    },
    user_password: {
        type: String,
        required: true
    }
});

const UserList = module.exports = mongoose.model('UserList', UserListSchema );

//newList.save is used to insert the document into MongoDB
module.exports.addList = (newList, callback) => {
    // console.log('new list: ', newList);
    var user = new UserList();
        user.user_type = newList.user_type;
        user.user_email = newList.user_email;
        user.user_password = newList.user_password;
        user.save(callback)
}

//Here we need to pass an id parameter to InvoiceList.find
module.exports.findUserByEmail =  (req, result) => {
    console.log('emaillllllllllllllll:', req);
    UserList.find({ 'user_email': req.email , 'user_password': req.password}, 'user_type', result)
    
}
