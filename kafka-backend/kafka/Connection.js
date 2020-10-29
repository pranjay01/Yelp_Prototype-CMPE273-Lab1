/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable func-names */
const kafka = require('kafka-node');
const config = require('../config');

function ConnectionProvider() {
  this.getConsumer = function (topic_name) {
    this.client = new kafka.Client(config.kafkaZookeeper);
    this.kafkaConsumerConnection = new kafka.Consumer(this.client, [
      { topic: topic_name, partition: 0 },
    ]);
    this.client.on('ready', function () {
      console.log('client ready!');
    });

    return this.kafkaConsumerConnection;
  };

  // Code will be executed when we start Producer
  this.getProducer = function () {
    if (!this.kafkaProducerConnection) {
      this.client = new kafka.Client(config.kafkaZookeeper);
      const { HighLevelProducer } = kafka;
      this.kafkaProducerConnection = new HighLevelProducer(this.client);
      // this.kafkaConnection = new kafka.Producer(this.client);
      console.log('producer ready');
    }
    return this.kafkaProducerConnection;
  };
}
// eslint-disable-next-line no-multi-assign
exports = module.exports = new ConnectionProvider();
