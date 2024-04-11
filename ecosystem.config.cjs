module.exports = {
    apps : [{
      name: "APATE SERVER NEW",
      script: "index.js",
      watch: true,
      env: {
        "NODE_ENV": "development",
        "GOOGLE_APPLICATION_CREDENTIALS": "./credentials.json"
      }
    }]
  };