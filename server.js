import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { SessionsClient } from '@google-cloud/dialogflow';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000; // Server port

app.use(bodyParser.json());

// Statik dosyaları sunmak için
app.use(express.static(path.join(__dirname, 'public')));

// DialogFlow API endpoint
app.post('/send-message', async (req, res) => {
    const sessionClient = new SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
        'YOUR_PROJECT_ID', // DialogFlow projesi ID'si
        'unique-session-id' // Her kullanıcı için farklı bir ID oluşturabilirsiniz
    );

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: req.body.message, // Frontend'den gelen mesaj
                languageCode: 'tr', // DialogFlow dil ayarı
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        res.json(responses[0].queryResult); // Bot cevabını frontend'e gönder
    } catch (error) {
        console.error('Dialogflow API Error:', error);
        res.status(500).send('Dialogflow API request failed.');
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
