const userlist = require('../models/User');

    
    module.exports.add_admin=function(data){
        console.log('admin user added', data);
        userlist.addList({
            user_type: data.user_type,
            user_email: data.user_email,
            user_password: data.user_password
            },(err, list) => {
            if(err) {
                // console.log('not able to adddddd:',err);
            }
            else {
                console.log('successfully addedddd: ', list);
            }    
        });
    };
     
        
    module.exports.check_user_exits= async function(data) {
        let result;
        console.log('check user exists');
        let result_list = [];
        await userlist.findUserByEmail(data, (err, lists)=> {
            if(err) {
                console.log('user not foundddddd: ',err);
                result = false;
            }
            else {
                console.log('data foundeddddd: ',lists);
                result_list = lists;
                result = true;
                console.log('result list: ', result_list);
                
                // res.write(JSON.stringify({success: true, lists:lists},null,2));
                // res.end();
        }
        });
        result = (result_list.length != 0 ? true : false);
        console.log('result from controller', result, result_list);
        
        return await result_list;
    }