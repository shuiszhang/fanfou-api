/**
 * Created by shuis on 2017/5/27.
 */
const OAuth = require('oauth-1.0a');

Object.assign(OAuth.prototype, {
  authHeader(request_data){
    let header = this.toHeader(request_data);
    let header_value = header.Authorization;

    let xauth = {
      x_auth_username: request_data.x_auth_username,
      x_auth_password: request_data.x_auth_password,
      x_auth_mode: request_data.x_auth_mode,
    };
    for(let key in xauth){
      header_value += this.percentEncode(key) + '="' + this.percentEncode(xauth[key]) + '"' + this.parameter_seperator;
    }

    header.Authorization = header_value.substr(0, header_value.length - this.parameter_seperator.length); //cut the last chars

    return header;
  }
});

module.exports = OAuth;