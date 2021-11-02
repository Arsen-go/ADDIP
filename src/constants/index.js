const http = require("http");
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const bodyParser = require("body-parser");
const uniqid = require("uniqid");
const yup = require("yup");
const phoneValidator = require("phone");
const emailValidator = require("email-validator");
const moment = require("moment");
const Twilio = require("twilio");
const jsonwebtoken = require("jsonwebtoken");
const { ApolloError, ValidationError, ForbiddenError } = require("apollo-server");
const AWS = require("aws-sdk");
const crypto = require("crypto");
const { withFilter, PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

// const phoneRegExp = /^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/;//only US numbers 
const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
// const phoneRegExp = /^\(?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;
module.exports = {
    phoneRegExp,
    http,
    ApolloServer,
    ApolloError,
    ValidationError,
    ForbiddenError,
    express,
    bodyParser,
    uniqid,
    yup,
    phoneValidator,
    emailValidator,
    moment,
    Twilio,
    jsonwebtoken,
    AWS,
    crypto,
    withFilter,
    pubsub,
};