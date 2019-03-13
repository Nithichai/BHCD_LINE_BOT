'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
// const bodyParser = require("body-parser");
const axios = require('axios');

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

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

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
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // get message from rich menus
  var msg = event.message.text;
  var userID = event.message.userId;

  // Found เริ่มต้นใช้งาน
  if (msg === "Getting started") {

    // create a echoing image
    const echo = {
      "type": 'image', 
      "originalContentUrl": "https://i.imgur.com/GcU2NS9.jpg",
      "previewImageUrl": "https://i.imgur.com/GcU2NS9.jpg" 
    }

    // use reply API
    return client.replyMessage(event.replyToken, echo);
  } else if (msg === "Edit data") {

    // create a echoing image
    const echo = {
      "type": "imagemap",
      "baseUrl": "https://i.imgur.com/ZdUE0ih.jpg",
      "altText": "การตั้งค่า",
      "baseSize": {
          "width": 1040,
          "height": 550
      },
      "actions": [
        {
            "type": "uri",
            "thumbnailImageUrl": "https://i.imgur.com/ZdUE0ih.jpg",
            "linkUri": "https://numpapick.herokuapp.com/main.php?userid=" + userID,
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
  } else if (msg === "Health Information") {
    
    // create a echoing image
    const echo = {  
      "type":"uri",
      "label":"ดูข้อมูลสุขภาพ",
      "uri":"https://www.google.com/",
      "altUri": {
          "desktop" : "https://www.google.com/"
      }
    }

    // use reply API
    return client.replyMessage(event.replyToken, echo);
  } else if (msg === "Ask for help") {
    
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
}

app.post('/device-online', (req, res) => {
  const axios = require('axios')

  var esp = req.body.data.esp
  
  axios({
    method: 'post',
    url: 'https://bhcd-api.herokuapp.com/user-line-device-info/check/esp',
    headers: {
      'Content-Type' : 'application/json'
    },
    data: {
        "data" : {
          "esp" : esp
        }
    }
  }).then((response) => {
    var lineID = response.data.data.id
    const echo = {
      "type": "text",
      "text": response.data.data.esp + " online"
    }
    client.pushMessage(lineID, echo)
    res.end()
  }).catch((error) => {
    console.log(error.message)
  })
})

app.post('/falling', (req, res) => {

  var esp = req.body.data.esp
  
  axios({
    method: 'post',
    url: 'https://bhcd-api.herokuapp.com/user-line-device-info/check/esp',
    headers: {
      'Content-Type' : 'application/json'
    },
    data: {
        "data" : {
          "esp" : esp
        }
    }
  }).then((response) => {
    var lineID = response.data.data.id
    const echo = {
      "type": "template",
      "altText": "คุณ " + response.data.data.name,
      "template": {
          "type": "buttons",
          "thumbnailImageUrl": "https://i.imgur.com/h3ujqrZ.jpg",
          "imageAspectRatio": "square",
          "imageSize": "cover",
          "imageBackgroundColor": "#FFFFFF",
          "title": "หมายเลขอุปกรณ์ : " + esp,
          "text": "คุณ " + response.data.data.name,
          "defaultAction": {
              "type": "message",
              "label": "ตอบรับ",
              "text": "Acknowledge:" + esp
          },
          "actions": [
              {
                "type": "message",
                "label": "ตอบรับ",
                "text": "Acknowledge:" + esp
              },
              {
                "type": "uri",
                "label": "โทร",
                "uri": "tel:" + response.data.data.phone
              }
          ]
      }
    }
    client.pushMessage(lineID, echo)
    res.end()
  }).catch((error) => {
    console.log(error.message)
  })
})

app.post('/help', (req, res) => {

  var esp = req.body.data.esp
  
  axios({
    method: 'post',
    url: 'https://bhcd-api.herokuapp.com/user-line-device-info/check/esp',
    headers: {
      'Content-Type' : 'application/json'
    },
    data: {
        "data" : {
          "esp" : esp
        }
    }
  }).then((response) => {
    var lineID = response.data.data.id
    const echo = {
      "type": "template",
      "altText": "คุณ " + response.data.data.name,
      "template": {
          "type": "buttons",
          "thumbnailImageUrl": "https://i.imgur.com/oWiGMzD.jpg",
          "imageAspectRatio": "square",
          "imageSize": "cover",
          "imageBackgroundColor": "#FFFFFF",
          "title": "หมายเลขอุปกรณ์ : " + esp,
          "text": "คุณ " + response.data.data.name,
          "defaultAction": {
              "type": "message",
              "label": "ตอบรับ",
              "text": "Acknowledge:" + esp
          },
          "actions": [
              {
                "type": "message",
                "label": "ตอบรับ",
                "text": "Acknowledge:" + esp
              },
              {
                "type": "uri",
                "label": "โทร",
                "uri": "tel:" + response.data.data.phone
              }
          ]
      }
    }
    client.pushMessage(lineID, echo)
    res.end()
  }).catch((error) => {
    console.log(error.message)
  })
})

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
