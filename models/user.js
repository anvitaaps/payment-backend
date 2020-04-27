//Require mongoose package
const mongoose = require('mongoose').set('debug', true);;

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

const UserList = module.exports = mongoose.model('UserList', UserListSchema, 'UserList' );

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
    UserList.find(req, 'user_type', result)
}

module.exports.auth_login =  (req, result) => {
    console.log('login credentials:', req);
    UserList.find({}, result)
}
