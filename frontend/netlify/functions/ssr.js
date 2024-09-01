const server = require('path-to-your-server-main-file'); // Adjust this path accordingly

exports.handler = async (event, context) => {
  const response = await new Promise((resolve, reject) => {
    const app = server.app(); // Assuming 'app' is the exported Angular server app
    const res = {
      statusCode: 200,
      headers: {},
      body: '',
    };

    app(event, res, (result) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: res.body,
      });
    });
  });

  return response;
};
