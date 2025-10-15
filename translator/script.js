document.getElementById('translateButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const languageSelect = document.getElementById('languageSelect');
    const outputText = document.getElementById('outputText');

    if (fileInput.files.length === 0) {
        alert('Please select a file first.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        const targetLanguage = languageSelect.value;

        // **IMPORTANT**: Replace with your actual Azure Translator key and endpoint
        const azureKey = "YOUR_AZURE_TRANSLATOR_KEY";
        const azureEndpoint = "YOUR_AZURE_TRANSLATOR_ENDPOINT";
        const azureRegion = "YOUR_AZURE_REGION"; // e.g., 'eastus'

        if (azureKey === "YOUR_AZURE_TRANSLATOR_KEY" || azureEndpoint === "YOUR_AZURE_TRANSLATOR_ENDPOINT" || azureRegion === "YOUR_AZURE_REGION") {
            alert("Please replace 'YOUR_AZURE_TRANSLATOR_KEY', 'YOUR_AZURE_TRANSLATOR_ENDPOINT', and 'YOUR_AZURE_REGION' in script.js with your actual Azure Translator credentials.");
            return;
        }

        const url = `${azureEndpoint}/translate?api-version=3.0&to=${targetLanguage}`;

        const body = [{
            'text': text
        }];

        fetch(url, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': azureKey,
                'Ocp-Apim-Subscription-Region': azureRegion,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(data => {
            if (data && data[0] && data[0].translations && data[0].translations[0]) {
                outputText.textContent = data[0].translations[0].text;
            } else {
                outputText.textContent = 'Error: Could not translate the text.';
                console.error('Translation error:', data);
            }
        })
        .catch(error => {
            outputText.textContent = 'Error: ' + error.message;
            console.error('Fetch error:', error);
        });
    };

    reader.readAsText(file);
});
