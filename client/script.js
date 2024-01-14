document.addEventListener('DOMContentLoaded', () => {
    const eventSelect = document.getElementById('event');
    const additionalQuestionsDiv = document.getElementById('additionalQuestions');
    const greetingTypeInput = document.getElementById('greetingType');
    const environmentInput = document.getElementById('environment');
    const selectedOptionsDiv = document.getElementById('selectedOptions');
    const generatedGreetingDiv = document.getElementById('generatedGreeting');
    const generateButton = document.getElementById('generateButton');
    const changeGreetingButton = document.getElementById('changeGreetingButton');

    const greetingsData = [];
    let currentGreetingIndex = 0;

    function resetUI() {
        changeGreetingButton.style.display = 'none';
        generatedGreetingDiv.style.display = 'none';
        selectedOptionsDiv.innerHTML = '';
        generatedGreetingDiv.innerHTML = '';
    }

    function updateAdditionalQuestions() {
        resetUI();

        const selectedEvent = eventSelect.value;

        additionalQuestionsDiv.innerHTML = ''; // Clear previous questions

        if (selectedEvent === 'birthday') {
            additionalQuestionsDiv.innerHTML += '<label for="age">Enter age:</label>';
            additionalQuestionsDiv.innerHTML += '<input type="number" id="age" class="additionalQuestionsInput" placeholder="age">';
        } else if (selectedEvent === 'wedding') {
            additionalQuestionsDiv.innerHTML += '<label for="relation">Your relation to the couple:</label>';
            additionalQuestionsDiv.innerHTML += '<input type="text" id="relation" class="additionalQuestionsInput" placeholder="relation">';
        } else if (selectedEvent === 'graduation') {
            additionalQuestionsDiv.innerHTML += '<label for="degree">Enter degree:</label>';
            additionalQuestionsDiv.innerHTML += '<input type="text" id="degree" class="additionalQuestionsInput" placeholder="degree">';
        }

        const additionalQuestionsInput = document.querySelector(".additionalQuestionsInput");
        additionalQuestionsInput.addEventListener('input', resetUI);
    }

    async function generateGreeting() {
        const selectedEvent = eventSelect.value;
        const age = document.getElementById('age') ? document.getElementById('age').value : '';
        const relation = document.getElementById('relation') ? document.getElementById('relation').value : '';
        const degree = document.getElementById('degree') ? document.getElementById('degree').value : '';
        const greetingType = greetingTypeInput.value;
        const environment = environmentInput.value;

        selectedOptionsDiv.innerHTML = `<p><b>Event:</b> ${selectedEvent}</p>`;
        if (age) selectedOptionsDiv.innerHTML += `<p><b>Age:</b> ${age}</p>`;
        if (relation) selectedOptionsDiv.innerHTML += `<p><b>Relation:</b> ${relation}</p>`;
        if (degree) selectedOptionsDiv.innerHTML += `<p><b>Degree:</b> ${degree}</p>`;
        if (greetingType) selectedOptionsDiv.innerHTML += `<p><b>Type:</b> ${greetingType}</p>`;
        if (environment) selectedOptionsDiv.innerHTML += `<p><b>Environment:</b> ${environment}</p>`;

        try {
            const response = await fetch('http://localhost:3000/generate-greeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ event: selectedEvent, age, relation, degree, type: greetingType, atmosphere: environment }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            greetingsData.length = 0;
            currentGreetingIndex = 0;
            greetingsData.push(...Object.values(data.greetings));

            displayCurrentGreeting();
            changeGreetingButton.style.display = 'inline-block';
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displayCurrentGreeting() {
        if (greetingsData.length > 0) {
            generatedGreetingDiv.innerText = `${greetingsData[currentGreetingIndex]}`;
            generatedGreetingDiv.style.display = 'inline-block';
        } else {
            generatedGreetingDiv.innerHTML = '<p>No greetings available.</p>';
        }
    }

    function changeGreeting() {
        if (currentGreetingIndex === greetingsData.length - 1) {
            generateGreeting();
        } else {
            currentGreetingIndex = (currentGreetingIndex + 1) % greetingsData.length;
            displayCurrentGreeting();
        }
    }

    updateAdditionalQuestions();

    // Event listeners
    eventSelect.addEventListener('change', updateAdditionalQuestions);
    generateButton.addEventListener('click', generateGreeting);
    changeGreetingButton.addEventListener('click', changeGreeting);
});
