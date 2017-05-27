/**
 * Created by shuis on 2017/5/27.
 */
const fanfou = require('./fanfou');

let options = {
  key: 'app key',
  secret: 'app secret',
  username : 'fanfou username',
  password : 'fanfou password',
  oauth_token : null,
};

let ff = new fanfou(options);

ff.auth((err, res) => {
  if (err) {
    console.log('auth err:', err)
  } else {
    let oauth_token = res.oauth_token;
    console.log('auth success. get oauth token:', oauth_token);
    //save oauth_token for next time use

    let request_data = {
      url: 'http://api.fanfou.com/account/verify_credentials.json',
      method: 'GET',
      data:{
        format: 'html',
        mode: 'lite'
      }
    };

    ff.get(request_data, (err, res) => {
      if (err) {
        console.log('get err:', err);
      } else {
        console.log('get success. res:', res);
      }
    });
  }
});


