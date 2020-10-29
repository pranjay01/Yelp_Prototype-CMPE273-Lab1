/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable new-cap */
// eslint-disable-next-line no-new-require
const connection = new require('./kafka/Connection');
const mongoose = require('mongoose');
const config = require('./config');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
const commonFunctionality = require('./common/loginLogout');
const staticFunctionality = require('./staticTables/staticTableFetch');
const customerFunctionality = require('./customer/customerProfile');
const restaurantFunctionality = require('./restaurant/restaurantProfile');
const { mongoDB } = require('./Models/config');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0,
};

mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log('MongoDB connection Failesd', err);
  } else {
    console.log('MongoDB Connected Succesfully', res);
  }
});

function handleTopicRequest(topic_name, fname) {
  // var topic_name = 'root_topic';
  const consumer = connection.getConsumer(topic_name);
  const producer = connection.getProducer();
  console.log('server is running ');
  consumer.on('message', function (message) {
    console.log(`message received for ${topic_name} `, fname);
    console.log(JSON.stringify(message.value));
    const data = JSON.parse(message.value);

    fname.handle_request(data.data, function (err, res) {
      console.log(`after handle${res}`);
      const payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, function (err2, resultdata) {
        console.log(err2);
        console.log(resultdata);
      });
    });
  });
}

// Add your TOPICs here
// first argument is topic name
// second argument is a function that will handle this topic request
handleTopicRequest(config.kafkacommontopic, commonFunctionality);
handleTopicRequest(config.kafkastatictopic, staticFunctionality);
handleTopicRequest(config.kafkacustomertopic, customerFunctionality);
handleTopicRequest(config.kafkaresturanttopic, restaurantFunctionality);
