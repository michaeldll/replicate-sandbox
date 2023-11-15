export default async function handler(req, res) {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version:
        !req.body.no_lcm ?
          "fbbd475b1084de80c47c35bfe4ae64b964294aa7e237e6537eed938cfd24903d" : "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      // This is the text prompt that will be submitted by a form on the frontend
      input: {
        prompt: req.body.prompt,
        num_inference_steps: 19,
        width: parseFloat(req.body.width),
        height: parseFloat(req.body.height),
        disable_safety_checker: true
      }
    }),
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
