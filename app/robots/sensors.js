
const dist = require("../sensors/distance.js");

exports.subscribe = (mqtt) => {
   dist.subscribe(mqtt);
}

exports.handleTopic = (mqtt, topic, messaage) => {

   if (topic== "v1/sensor/distance"){
      dist.handleTopic(mqtt, topic, messaage);

   }else{
      console.log("invalid topic")
      // Default option
   }
}
