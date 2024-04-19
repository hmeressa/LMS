import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs-extra';
import { join } from 'path';
require('dotenv').config();

@Injectable()
export class EmailService {
  /**
   *
   * @param recipient
   * @param message
   * @returns
   *
   * Send security alert while changing the password.
   */

  sendSecurityAlert(recipient: string, fullName: string) {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          // sender email is a host email, for the system.
          user: process.env.SENDER_EMAIL,
          // this password is known by the system admin only.
          pass: process.env.PASSWORD,
        },
      });

      const csspath = join(process.cwd(), 'templates', 'asset', 'css', 'all.css');
      const css = fs.readFileSync(csspath, 'utf8');

      const templatePath = join(process.cwd(), 'templates', 'security_alert.hbs');
      const template = fs.readFileSync(templatePath, 'utf8');

      const compiledTemplate = Handlebars.compile(template);
      const html = compiledTemplate({
        fullName: fullName,
        css: css,
      });

      const mail_configs = {
        from: process.env.SENDER_EMAIL,
        to: recipient,
        subject: `Security alert from IE Networks`,
        html: html,
      };
      transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
          throw new InternalServerErrorException(`Error happend while sending...`);
        }
        // return "Email sent successfully"
        return resolve({
          message: 'Email sent successfully',
        });
      });
    });
  }

  /**
   *
   * @param recipient
   * @param message
   * @returns
   *
   * send verification code while forgot password.
   */
  sendVerificationCode(recipient: string, code: string, fullName: string) {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const csspath = join(process.cwd(), 'templates', 'asset', 'css', 'all.css');
      const css = fs.readFileSync(csspath, 'utf8');

      const templatePath = join(process.cwd(), 'templates', 'verification_code.hbs');
      const template = fs.readFileSync(templatePath, 'utf8');

      const compiledTemplate = Handlebars.compile(template);
      const html = compiledTemplate({
        code: code,
        fullName: fullName,
        css: css,
      });

      const mail_configs = {
        from: process.env.SENDER_EMAIL,
        to: recipient,
        subject: `IE Networks Verification Code: ${code}`,
        html: html,
      };

      transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
          return new InternalServerErrorException(`Error happened while sending...`);
        }
        return resolve({
          message: 'We have sent an email.',
        });
      });
    });
  }

  /**
   *
   * @param recipient
   * @param password
   * @returns Object message.
   *
   * Send default password for the uses, while new account creation.
   */
  sendNoticeAccountCreated(recipient: string, password: string, fullName: string) {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const csspath = join(process.cwd(), 'templates', 'asset', 'css', 'all.css');
      const css = fs.readFileSync(csspath, 'utf8');

      const templatePath = join(process.cwd(), 'templates', 'account_created.hbs');
      const template = fs.readFileSync(templatePath, 'utf8');

      const compiledTemplate = Handlebars.compile(template);
      const html = compiledTemplate({
        password: password,
        fullName: fullName,
        css: css,
      });

      const mail_configs = {
        from: process.env.SENDER_EMAIL,
        to: recipient,
        subject: `New account for IE Networks LMS have been created for you!`,
        html: html,sendNoticeAccountCreated(recipient: string, password: string, fullName: string) {
          return new Promise((resolve, reject) => {
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.PASSWORD,
              },
            });
      
            const csspath = join(process.cwd(), 'templates', 'asset', 'css', 'all.css');
            const css = fs.readFileSync(csspath, 'utf8');
      
            const templatePath = join(process.cwd(), 'templates', 'account_created.hbs');
            const template = fs.readFileSync(templatePath, 'utf8');
      
            const compiledTemplate = Handlebars.compile(template);
            const html = compiledTemplate({
              password: password,
              fullName: fullName,
              css: css,
            });
      
            const mail_configs = {
              from: process.env.SENDER_EMAIL,
              to: recipient,
              subject: `New account for IE Networks LMS have been created for you!`,
              html: html,
            };
            transporter.sendMail(mail_configs, async function (error, info) {
              if (error) {
                // This error may not happen, but incase if we run the system without network at development stage, it may happen.
                // ! delete the registered user, if the password is not sent for him.
                await this.database.users.delete({
                  where: { email: recipient },
                });
                // return { message: `Error happened while sending...` }
                return new InternalServerErrorException(
                  `Error happened while sending... Hint: check your internet connection.`,
                );
              }
              // return "Email sent successfully"
              return resolve({
                message: 'Email sent successfully',
              });
            });
          });
        }
      };
      transporter.sendMail(mail_configs, async function (error, info) {
        if (error) {
          // This error may not happen, but incase if we run the system without network at development stage, it may happen.
          // ! delete the registered user, if the password is not sent for him.
          await this.database.users.delete({
            where: { email: recipient },
          });
          // return { message: `Error happened while sending...` }
          return new InternalServerErrorException(
            `Error happened while sending... Hint: check your internet connection.`,
          );
        }
        // return "Email sent successfully"
        return resolve({
          message: 'Email sent successfully',
        });
      });
    });
  }
}
