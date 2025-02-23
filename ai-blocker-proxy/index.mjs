// Deployed on AWS Lambda

export const handler = async (event) => {
  const saplingResponse = await fetch(
    "https://api.sapling.ai/api/v1/aidetect",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        // Key not included
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
    },
  };

  return response;
};
