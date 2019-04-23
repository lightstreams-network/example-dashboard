'use strict';

/**
 * Dependencies
 */
let fs = require('fs');
let path = require('path');
let Promise = require('bluebird');
let readFile = Promise.promisify(fs.readFile);
let nodemailer = require('nodemailer');
let sendgrid = require('nodemailer-sendgrid-transport');
let SendMailError = require('../error/type/server/send-mail');
let config = require('../config');

/**
 * Constants
 */
const SENDGRID_API_KEY = config.SENDGRID_API_KEY;

/**
 * Create mailer
 */
let mailer = Promise.promisifyAll(
  nodemailer.createTransport(
    sendgrid({
      auth: {
        api_key: SENDGRID_API_KEY
      }
    })
  )
);

/**
 * Export mailer interface (wrapped in promise)
 */
module.exports = {

  /**
   * Helper to concatenate name and email address
   */
  concatNameEmail(name, email) {
    return name + ' <' + email + '>';
  },

  /**
   * Load an email (both plain text and html)
   */
  load(email, data) {

    //Get filenames
    let text = path.resolve('./app/emails/' + email + '.txt');
    let html = path.resolve('./app/emails/' + email + '.html');

    //Return promise
    return Promise.all([
      readFile(text, 'utf8'),
      readFile(html, 'utf8')
    ]).then(result => result.map(contents => replaceData(contents, data)));
  },

  /**
   * Send mail
   */
  send(email) {
    return mailer.sendMailAsync(email)
      .catch(error => {
        throw new SendMailError(error);
      });
  }
};

/**
 * Helper to replace data
 */
function replaceData(contents, data) {
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let regex = new RegExp('{{' + key + '}}', 'g');
      contents = contents.replace(regex, data[key]);
    }
  }
  return contents;
}
