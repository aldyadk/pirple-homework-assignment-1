/*
* create and export configuration variables
*
*/

//container for all the environments
var environments = {};

//staging as default env
environments.staging = {
  port: 3000,
  envName: 'staging',
};

//production 
environments.production = {
  port: 5000,
  envName: 'production',
};

//determine which env passed as a command-line argument
var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//check if the currentEnv is one of environments above
var envToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

//export the module

module.exports = envToExport;