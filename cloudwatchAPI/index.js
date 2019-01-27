"use strict";

const AWSCloudwatchlogsService = require("./aws-cloudwatch-service");
const messageUtils = require("./messageUtils");
const fs = require("fs");

const sozoDescribeLogGroup = (logGroupNamePath, language) => {
    return AWSCloudwatchlogsService.describeLogGroup(logGroupNamePath).then((data) => {
        return AWSCloudwatchlogsService.describeLogStreams(logGroupNamePath);
    }).then((data) => {
        let promiseArray = []
        for(let i=0; i<data.logStreams.length; i++){
            if(!isNaN(data.logStreams[i].lastIngestionTime)){
                promiseArray.push(AWSCloudwatchlogsService.getLogEvents(logGroupNamePath, data.logStreams[i].logStreamName));
            }
        }
        return Promise.all(promiseArray).then((data) => {
            let res = [];
            for(let i=0; i<data.length; i++){
                for(let j=0; j<data[i].events.length; j++){
                    if(!isNaN(data[i].events[j].message.charAt(0))){
                        res.push({logGroupName: logGroupNamePath.split("\/")[logGroupNamePath.split("\/").length - 1], timeStamp: data[i].events[j].ingestionTime});
                    }
                }
            }
            return res;
        }).catch((err) => {
            throw err;
        });
    }).then((data) => {
        return data;
    }).catch((err) => {
        throw messageUtils.sozoError(err, language);
    });
};

let auth_password_post = sozoDescribeLogGroup("/aws/lambda/auth_password_post", "en");
let auth_password_put = sozoDescribeLogGroup("/aws/lambda/auth_password_put", "en");
let auth_post = sozoDescribeLogGroup("/aws/lambda/auth_post", "en");
let clinics_extra_get = sozoDescribeLogGroup("/aws/lambda/clinics_extra_get", "en");
let clinics_get = sozoDescribeLogGroup("/aws/lambda/clinics_get", "en");
let clinics_post = sozoDescribeLogGroup("/aws/lambda/clinics_post", "en");
let clinics_put = sozoDescribeLogGroup("/aws/lambda/clinics_put", "en");
let promiseArray = [auth_password_post, auth_password_put, auth_post, clinics_extra_get, clinics_get, clinics_post, clinics_put];

Promise.all(promiseArray).then((data) => {
    let flatNorder = [];
    let res = "FirstNode,LastNode\n";
    for(let i=0; i<data.length; i++){
        for(let j=0; j<data[i].length; j++){
            flatNorder.push(data[i][j]);
        }
    }
    flatNorder.sort((a,b) => (a.timeStamp > b.timeStamp) ? 1 : ((b.timeStamp > a.timeStamp) ? -1 : 0));
    for(let i=1; i<flatNorder.length; i++){
        let EOL = "\n";
        if(i === flatNorder.length - 1){EOL = "";}
        res += flatNorder[i-1].logGroupName + "," + flatNorder[i].logGroupName + EOL;
    }
    fs.writeFile("C:\\Users\\Msi-PC\\Desktop\\example.csv", res, "utf8",(err) => {
        if (err) {
            console.log("Some error occured - file either not saved or corrupted file saved.");
        } else{
            console.log("Data Saved!");
        }
    });
}).catch((err) => {
    console.log(err);
});

module.exports = {
    sozoDescribeLogGroup
};






