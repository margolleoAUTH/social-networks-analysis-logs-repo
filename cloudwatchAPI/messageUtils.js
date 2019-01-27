"use strict";

const strings = require("./strings");

const sozoData = (data, language) => {
    data.message = strings[language][data.code];
    return data;
};

const sozoError = (err, language) => {
    err.AWSmessage = err.message;
    err.message = strings[language][err.code] || strings[language].EXCEPTION;
    return err;
};

module.exports = {
    sozoData,
    sozoError
};