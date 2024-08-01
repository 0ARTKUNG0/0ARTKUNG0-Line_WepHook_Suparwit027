const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const port = 4000;

//create server
const app = express();

//middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("<h1>Welcome, this is a webhook for SE NPRU Line Chatbot !!!</h1>")
});

app.post("/webhook", (req, res) => {
    //create webhook client
    const agent = new WebhookClient({
        request: req,
        response: res
    });

    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function bodyMassIndex(agent) {
        let weight = agent.parameters.weight;
        let height = agent.parameters.height / 100;
        let bmi = (weight / (height * height)).toFixed(2);

        let result = "ขออภัย Tenno";

        if (bmi < 18.5) {
            result = "คุณผอมไป กินข้าวบ้างนะ Tenno";
        } else if (bmi >= 18.5 && bmi <= 22.9) {
            result = "คุณหุ่นนะ Tenno";
        } else if (bmi >= 23 && bmi <= 24.9) {
            result = "คุณเริ่มจะท้วมแล้วนะ Tenno";
        } else if (bmi >= 25.8 && bmi <= 29.9) {
            result = "คุณอ้วนละ ออกกำลังกายหน่อยนะ Tenno";
        } else if (bmi > 30) {
            result = "คุณอ้วนเกินไปละ หาหมอเหอะ Tenno";
        }
        const flexMessage = {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
                "type": "bubble",
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "BMI Calculation Result",
                            "weight": "bold",
                            "size": "lg",
                            "align": "center"
                        }
                    ]
                },
                "hero": {
                    "type": "image",
                    "url": "https://lirp.cdn-website.com/69c0b277/dms3rep/multi/opt/BMI+levels-1920w.jpg",
                    "size": "full",
                    "aspectRatio": "20:13",
                    "aspectMode": "cover"
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "Your BMI Result",
                            "weight": "bold",
                            "size": "md",
                            "margin": "md"
                        },
                        {
                            "type": "text",
                            "text": "Height: " + (height * 100) + " cm",
                            "size": "sm",
                            "margin": "sm"
                        },
                        {
                            "type": "text",
                            "text": "Weight: " + weight + " kg",
                            "size": "sm",
                            "margin": "sm"
                        },
                        {
                            "type": "separator",
                            "margin": "lg"
                        },
                        {
                            "type": "text",
                            "text": "BMI: " + bmi,
                            "weight": "bold",
                            "size": "xl",
                            "align": "center",
                            "margin": "lg",
                            "color": "#00b900"
                        },
                        {
                            "type": "text",
                            "text": result,
                            "align": "center",
                            "size": "sm",
                            "margin": "md"
                        }
                    ]
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "button",
                            "action": {
                                "type": "uri",
                                "label": "รายละเอียดเพิ่มเติม",
                                "uri": "https://samitivejchinatown.com/th/article/health/BMI-calculator"
                            },
                            "style": "primary",
                            "color": "#1DB446"
                        }
                    ]
                }
            }
        };

        let payload = new Payload("LINE", flexMessage, { sendAsMessage: true });
        agent.add(payload);
    }
    
    function calculateRectangleArea(agent) {
        let wide = agent.parameters.wide;
        let length = agent.parameters.length;
        let result = wide * length;
        console.log(wide, length, result);
        agent.add("พื้นที่รูปสี่เหลี่ยมขนาด กว้าง" + wide + "ซม. ยาว " + length + " = " + result + " ตร.ซม.");
    }


    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", fallback);
    intentMap.set("BMI - custom - yes", bodyMassIndex);
    intentMap.set("Calculate Rectangle Area", calculateRectangleArea);
    intentMap.set("Calculate Circle Area", calculateCircleArea);
    intentMap.set("Calculate Triangle Area", calculateTriangleArea);

    agent.handleRequest(intentMap);
});

app.listen(port, () => {
    console.log("Server is running at http://localhost:" + port);
});