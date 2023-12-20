const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();



const bodyParser = require('body-parser');
const { OpenAIAPI } = require('openai'); 

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

const openAIAPI = new OpenAIAPI('your-openai-api-key');

// Handle POST requests for generating greetings
app.post('/generate-greeting', async (req, res) => {
    try {
        const { event, age, relation, degree, type, atmosphere, numResponses = 1 } = req.body;

        // Build a prompt for OpenAI GPT based on the selected event and options
        let prompt = `Write me a`;
        if (age) prompt += ` ${age}-year-old`;
        prompt += ` ${event} greeting`;

        // Add additional details based on the event
        switch (event) {
            case 'birthday':
                // Include age-specific details
                break;
            case 'wedding':
                // Include relation-specific details
                if (relation) prompt += ` for the ${relation}`;
                break;
            case 'graduation':
                // Include degree-specific details
                if (degree) prompt += ` for the graduate with a ${degree} degree`;
                break;
            // Add more cases for other events
            default:
                // Handle unknown events
                break;
        }

        // Include general options
        if (type) prompt += ` of type ${type}`;
        if (atmosphere) prompt += ` in a ${atmosphere} atmosphere`;
        prompt += ' return 3 greetings in a parsable JSON format like follows: { "1": "first greeting", "2": "second greeting", "3": "third greeting" }'

        // Use the OpenAI API to generate greetings
        const generatedGreetings = await openAIAPI.generate(prompt, numResponses);

        // Send the generated greetings back to the client
        res.json({ greetings: generatedGreetings });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle other routes as needed

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
