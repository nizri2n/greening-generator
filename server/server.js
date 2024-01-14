const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAIAPI } = require('openai');

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
    console.error('OpenAI API key not found in the environment variables.');
    process.exit(1);
}

const openaiApi = new OpenAIAPI(openaiApiKey);

// Handle POST requests for generating greetings
app.post('/generate-greeting', async (req, res) => {
    try {
        const { occasion, personAge, relationship, academicDegree, greetingType, environment, responseCount = 1 } = req.body;

        // Build a prompt for OpenAI GPT based on the selected occasion and options
        let prompt = `Compose a`;
        if (personAge) prompt += ` ${personAge}-year-old`;
        prompt += ` ${occasion} greeting`;

        // Add additional details based on the occasion
        switch (occasion) {
            case 'birthday':
                // Include age-specific details
                break;
            case 'wedding':
                // Include relationship-specific details
                if (relationship) prompt += ` for the ${relationship}`;
                break;
            case 'graduation':
                // Include academic degree-specific details
                if (academicDegree) prompt += ` for the graduate with a ${academicDegree} degree`;
                break;
            // Add more cases for other occasions
            default:
                // Handle unknown occasions
                break;
        }

        // Include general options
        if (greetingType) prompt += ` of type ${greetingType}`;
        if (environment) prompt += ` in a ${environment} setting`;
        prompt += ' return 3 greetings in JSON format like: { "1": "first greeting", "2": "second greeting", "3": "third greeting" }';

        // Use the OpenAI API to generate greetings
        const generatedGreetings = await openaiApi.generate(prompt, responseCount);

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
