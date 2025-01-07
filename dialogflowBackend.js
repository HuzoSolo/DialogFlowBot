import express from 'express';
import bodyParser from 'body-parser';
import { SessionsClient } from '@google-cloud/dialogflow';

const app = express();
app.use(bodyParser.json());

const PORT = 4000; // Backend server port

app.post('/send-message', async (req, res) => {
    const sessionClient = new SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
        'yetkinlik-k-t-phanesi_1736166536110', // DialogFlow projesi ID'si
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

app.listen(PORT, () => {
    console.log(`DialogFlow backend is running on http://localhost:${PORT}`);
});
