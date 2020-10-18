module.exports = {
   HOST: process.env.MQTT_HOST,
   port: 1883,
   options: {
      port: 1883,
      clientId: process.env.MQTT_CLIENT,
      // username: process.env.MQTT_USER,
      // password: process.env.MQTT_PASS,
      clientId: 'server_' + Math.random().toString(16).substr(2, 8),
      username: (process.env.MQTT_USER || ''),
      password: (process.env.MQTT_PASS || ''),
   }
}
