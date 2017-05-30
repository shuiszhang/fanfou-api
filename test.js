/**
 * Created by shuis on 2017/5/27.
 */
const fanfou = require('./fanfou');
const qs = require('qs');

let options = {
  key: 'app key',
  secret: 'app secret',
  username: 'fanfou username',
  password: 'fanfou password',
  oauth_token : null,
  oauth_token_secret : null,
};

//use callback
let callback_test = () => {
  let ff1 = new fanfou(options);
  ff1.auth((err, res) => {
    if (err) {
      console.log('auth err:', err)
    } else {
      console.log('auth success. get oauth token:', res);
      //save oauth_token for next time use

      options.oauth_token = res.oauth_token;
      options.oauth_token_secret = res.oauth_token_secret;
      let ff2 = new fanfou(options);
      let request_data = {
        url: 'http://api.fanfou.com/account/verify_credentials.json',
        method: 'GET',
        data:{
          format: 'html',
          mode: 'lite'
        }
      };

      ff2.get(request_data, (err, res) => {
        if (err) {
          console.log('get err:', err);
        } else {
          console.log('get success. res:', res);
        }
      });
    }
  });
};
console.log('callback_test start');
let res1 = callback_test();
console.log('callback_test end');

//use async/await
let async_test = async () => {
  try {
    let ff2 = new fanfou(options);
    let res = await ff2.auth_async();
    console.log('res:', res.text);
    let oauth_token = qs.parse(res.text);
    console.log('auth_async success. get oauth token:', oauth_token);
    //save oauth_token for next time use
    options.oauth_token = oauth_token.oauth_token;
    options.oauth_token_secret = oauth_token.oauth_token_secret;

    let ff3 = new fanfou(options);
    let request_data = {
      url: 'http://api.fanfou.com/account/verify_credentials.json',
      method: 'GET',
      data:{
        format: 'html',
        mode: 'lite'
      }
    };
    let user_info = await ff3.request_async(request_data);
    console.log('user_info:', user_info.body);
  } catch (err) {
    console.log('err:', err);
  }
};
console.log('async_test start');
let res2 = async_test();
console.log('async_test end');

