const userlist = require('../models/User');

    
    module.exports.add_admin=function(data){
        console.log('init adminnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn', data);
        userlist.addList({
            user_type: data.user_type,
            user_email: data.user_email,
            user_password: data.user_password
            },(err, list) => {
            if(err) {
                console.log('not able to adddddd:',err);
            }
            else {
                console.log('successfully addedddd: ', list);
            }    
            });
        };
     
        
    module.exports.check_user_exits= async function(email) {
        let result;
        console.log('check user exists');
        
        userlist.findUserByEmail(email, (err, lists)=> {
            if(err) {
                console.log('user not foundddddd: ',err);
                result = false;
                // res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
            }
            else {
                console.log('data foundeddddd: ',lists);
                result = true;
                // res.write(JSON.stringify({success: true, lists:lists},null,2));
                // res.end();
        }
        });
        result = await (err ? false : true);
        return result
    }