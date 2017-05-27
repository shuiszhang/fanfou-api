/**
 * Created by shuis on 2017/5/27.
 */
const sa = require('superagent');
const hmacsha1 = require('hmacsha1');
const qs = require('qs');
const OAuth = require('./oauth');

class Fanfou {
  constructor(options) {
    this.oauth = OAuth({
      consumer: {
        key: options.key,
        secret: options.secret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function: function (base_string, key) {
        return hmacsha1(key, base_string);
      }
    });

    this.username = options.username;
    this.password = options.password;
    this.oauth_token = options.oauth_token;
  }

  auth(callback) {
    let request_data = {
      url: 'http://fanfou.com/oauth/access_token',
      method: 'GET',
      data: {
        x_auth_username: this.username,
        x_auth_password: this.password,
        x_auth_mode: 'client_auth',
      }
    };
    let header = this.oauth.authHeader(this.oauth.authorize(request_data));
    sa
      .get(request_data.url)
      .set(header)
      .end((err, res) => {
        if (err) {
          callback(err, null);
        } else {
          this.oauth_token = qs.parse(res.text);
          callback(null, this.oauth_token);
        }
      });
  }

  get(request_data, callback){
    let header = this.oauth.toHeader(this.oauth.authorize(request_data, {
      key: this.oauth_token.oauth_token,
      secret: this.oauth_token.oauth_token_secret,
    }));

    sa
      .get(request_data.url)
      .set(header)
      .query(request_data.data)
      .end((err, res) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, res.body);
        }
      });
  }

  post(request_data, callback){
    let header = this.oauth.toHeader(this.oauth.authorize(request_data, {
      key: this.oauth_token.oauth_token,
      secret: this.oauth_token.oauth_token_secret,
    }));

    sa
      .post(request_data.url)
      .set(header)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(request_data.data)
      .end((err, res) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, res.body);
        }
      });
  }
}

module.exports = Fanfou;