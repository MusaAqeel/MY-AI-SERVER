const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const port = 3001;
require("dotenv").config({ path: require("find-config")(".env") });
const cors = require("cors");
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: process.env.ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const dialogExample = [
  {
    speaker: "user",
    text: "Hello, how are you?",
  },
  {
    speaker: "bot",
    text: "I am doing well, thank you. How can I help you today?",
  },
];

async function request(req) {
  // console.log(req)
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: req.message,
    temperature: 0.5,
    max_tokens: 100,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  });
  return { result: completion.data.choices[0].text };
}

app.get("/api", (req, res) => {
  res.send("make a post request to get the response");
});

app.post("/api", (req, res) => {
  console.log(req.body);
  console.log(process.env.OPENAI_API_KEY);
  // res.send("hi")
  // let output = request().then((result) => console.log(result))
  let output = null;
  request(req.body)
    .then((result) => {
      res.json(result);
    })
    .then((data) => {
      output = data;
      console.log(data);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
