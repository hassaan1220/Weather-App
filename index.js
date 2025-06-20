import axios from 'axios';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const api_key = "f28fdd9f87b8285ffab426678c232268";

// For ES module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
    res.render("index", { weather: null, error: null });
});

// Weather route
app.get('/weather', async (req, res) => {
    const city = req.query.city; // should match input name="city"

    if (!city) {
        return res.render("index", {
            weather: null,
            error: "Please enter a city name.",
        });
    }
    try {
        const result = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`
        );
        res.render("index.ejs", {
            weather: result.data,
            error: null,
        });
    } catch (error) {
        res.render("index.ejs", {
            weather: null,
            error: "Could not fetch data for this city.",
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
