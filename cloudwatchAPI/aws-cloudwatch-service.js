"use strict";

const AWS = require("aws-sdk");
//#region This is used only in client-side programming
AWS.config.update({
    accessKeyId: "AKIAI5JI2JI5S7AMK4HQ",
    secretAccessKey: "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",
    region: "eu-west-2"
});
//#endregion
const AWSCloudwatchlogs  = new AWS.CloudWatchLogs();
//#region This is used only in client-side programming
AWSCloudwatchlogs.config.update({
    accessKeyId: "AKIAI5JI2JI5S7AMK4HQ",
    secretAccessKey: "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",
    region: "eu-west-2"
});
//#endregion

// User-Admin Actions ==================================================================================================
const describeLogGroup = (logGroupNamePrefix) => {
    let params = {
        limit: 1,
        logGroupNamePrefix: logGroupNamePrefix
    };
    return AWSCloudwatchlogs.describeLogGroups(params).promise();
};

const describeLogStreams = (logGroupName) => {
    let params = {
        logGroupName: logGroupName
    };
    return AWSCloudwatchlogs.describeLogStreams(params).promise();
};

const getLogEvents = (logGroupName, logStreamName) => {
    let params = {
        logGroupName: logGroupName,
        logStreamName: logStreamName
    };
    return AWSCloudwatchlogs.getLogEvents(params).promise();
};

const tagLogGroup = (logGroupName, tagFacilityKey) => {
    var params = {
        logGroupName: logGroupName,
        tags: {
            "TagFacilityKey": tagFacilityKey,
        }
    };
    return AWSCloudwatchlogs.tagLogGroup(params).promise();
};

const listTagsLogGroup = (logGroupName) => {
    let params = {
        logGroupName: logGroupName
    };
    return AWSCloudwatchlogs.listTagsLogGroup(params).promise();
};


module.exports = {
    describeLogGroup,
    describeLogStreams,
    getLogEvents,
    tagLogGroup,
    listTagsLogGroup
};