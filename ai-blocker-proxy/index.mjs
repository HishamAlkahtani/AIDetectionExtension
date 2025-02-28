// Deployed on AWS Lambda

export const handler = async (event) => {
  try {

    const saplingResponse = await fetch(
      "https://api.sapling.ai/api/v1/aidetect",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          // API key not included
          /*key: "...",*/
          text: event.body.text,
        }),
      }
    );

    const saplingJson = await saplingResponse.json();

    const response = {
      statusCode: 200,
      body: JSON.stringify(saplingJson),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
    };
    //
    return response;
  } catch (error) {
    var response = {
      "statusCode": 500,
      "headers": {
        "Content-Type": "text/plain",
        "x-amzn-ErrorType": error.code,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      "isBase64Encoded": false,
      "body": error.code + ": " + error.message,
    }
    return response

  }
};
