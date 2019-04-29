'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const axios = require('axios');
const MicroGear = require('microgear');

const APPID  = process.env.APPID;
const KEY    = process.env.APPKEY;
const SECRET = process.env.APPSECRET;

var queue = []

const microgear = MicroGear.create({
  key : KEY,
  secret : SECRET
});

microgear.on('connected', function() {
  setInterval(function() {
    var device = queue.splice(-1, 1)
    if (device.length > 0) {
      microgear.chat(device[0], 'ACK');
    }
  })
})

microgear.connect(APPID);

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type === 'follow') {

    // create a echoing welcome message
    const echo = {
      "type": "text",
      "text": "ยินดีต้อนรับสู่ Basic Health Care Device โปรดลงทะเบียนที่เว็บไซต์ของเรา https://basic-health-care-device.herokuapp.com"
    }

    // use reply API
    return client.replyMessage(event.replyToken, echo);
  } else if (event.type === 'message' && event.message.type === 'text') {
    // get message from rich menus
    var msg = event.message.text;
    var userID = event.message.userId;

    // Found เริ่มต้นใช้งาน
    if (msg.search("Acknowledge") !== -1) {
      var dataList = msg.split(":")
      var device = dataList[1]
      queue.push(device)
      return Promise.resolve(null)
    } else if (msg === "เริ่มต้นใช้งาน") {

      // create a echoing image
      const echo = {
        "type": 'image', 
        "originalContentUrl": "https://i.imgur.com/vXVIOmm.png",
        "previewImageUrl": "https://i.imgur.com/vXVIOmm.png" 
      }

      // use reply API
      return client.replyMessage(event.replyToken, echo);
    } else if (msg === "แก้ไขข้อมูล") {

      // create a echoing image
      const echo = {
        "type": "imagemap",
        "baseUrl": "https://i.imgur.com/ZdUE0ih.jpg",
        "altText": "แก้ไขข้อมูล",
        "baseSize": {
            "width": 1040,
            "height": 550
        },
        "actions": [
          {
              "type": "uri",
              "thumbnailImageUrl": "https://i.imgur.com/ZdUE0ih.jpg",
              "linkUri": "https://basic-health-care-device.herokuapp.com/device-setting",
              "area": {
                  "x": 0,
                  "y": 0,
                  "width": 1040,
                  "height": 550
              }
          }
        ]
      }

      // use reply API
      return client.replyMessage(event.replyToken, echo);
    } else if (msg === "ข้อมูลสุขภาพ") {
      
      // create a echoing image
      const echo = {
        "type": "text",
        "text": "https://basic-health-care-device.herokuapp.com/health-info"
      }

      // use reply API
      return client.replyMessage(event.replyToken, echo);
    } else if (msg === "ขอความช่วยเหลือ") {
      
      // create a echoing image
      const echo = {
        "type": "template",
        "altText": "ขอความช่วยเหลือ",
        "template": {
            "type": "confirm",
            "text": "โทรหา 1669 ?",
            "actions": [
                {
                  "type": "uri",
                  "label": "โทร",
                  "uri": "tel:1669"
                },
                {
                  "type": "message",
                  "label": "ยกเลิก",
                  "text": "ยกเลิก"
                }
            ]
        }
      }

      // use reply API
      return client.replyMessage(event.replyToken, echo);
    }
  } else {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
