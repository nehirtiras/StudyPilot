class WeatherService {


    static fallbackCoords = {
        lat: 39.9208,
        lon: 32.8541
    };


    static getUserCoords() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation not supported"));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    resolve({
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude
                    });
                },
                (err) => {

                    reject(err);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 8000,
                    maximumAge: 10 * 60 * 1000
                }
            );
        });
    }

    static async getWeather() {
        let coords;

        try {

            coords = await this.getUserCoords();
        } catch (e) {

            coords = this.fallbackCoords;
        }

        const { lat, lon } = coords;

        const url = `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${lat}` +
            `&longitude=${lon}` +
            `&current=temperature_2m,apparent_temperature,weather_code` +
            `&timezone=auto`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            const current = data.current || {};
            let temp = typeof current.apparent_temperature === "number"
                ? current.apparent_temperature
                : current.temperature_2m;


            if (typeof temp !== "number" || isNaN(temp)) {
                temp = "--";
            } else {

                temp = Math.round(temp);
            }

            const code = current.weather_code;
            const condition = this.getConditionText(code);
            const icon = this.getIcon(code);
            const suggestion = this.getSuggestion(temp, code);

            return { temp, condition, icon, suggestion };

        } catch (err) {

            return {
                temp: "--",
                condition: "Weather unavailable",
                icon: "❔",
                suggestion: "Unable to load live weather. Focus in a comfortable indoor space."
            };
        }
    }

    static getConditionText(code) {
        if (code === 0) return "Clear sky";
        if ([1, 2, 3].includes(code)) return "Partly cloudy";
        if ([45, 48].includes(code)) return "Foggy";
        if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
        if ([61, 63, 65, 80, 81, 82].includes(code)) return "Rainy";
        if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
        if ([95, 96, 99].includes(code)) return "Thunderstorm";
        return "Cloudy";
    }

    static getIcon(code) {
        const icons = {
            0: "☀️",
            1: "🌤️",
            2: "⛅",
            3: "☁️",
            45: "🌫️",
            48: "🌫️",
            51: "🌦️",
            53: "🌦️",
            55: "🌧️",
            56: "🌧️",
            57: "🌧️",
            61: "🌧️",
            63: "🌧️",
            65: "🌧️",
            71: "❄️",
            73: "❄️",
            75: "❄️",
            77: "❄️",
            80: "🌧️",
            81: "🌧️",
            82: "🌧️",
            85: "❄️",
            86: "❄️",
            95: "⛈️",
            96: "⛈️",
            99: "⛈️"
        };
        return icons[code] || "❔";
    }

    static getSuggestion(temp, code) {

        if (typeof temp !== "number") {
            return "Check the weather and choose a comfortable indoor place to study.";
        }


        if ([61, 63, 65, 80, 81, 82].includes(code)) {
            return "Rainy weather – perfect time to stay inside and focus.";
        }
        if ([71, 73, 75, 77, 85, 86].includes(code)) {
            return "Snowy and cold – stay warm indoors and study.";
        }
        if ([95, 96, 99].includes(code)) {
            return "Stormy weather – safest option is to stay inside and concentrate.";
        }

        if (temp <= 5) {
            return "Very cold – indoor study is strongly recommended.";
        }

        if (temp > 5 && temp <= 12) {
            return "Cool weather – cozy indoor study will help you stay focused.";
        }

        if (temp > 12 && temp <= 22) {
            return "Mild weather – you can study by a window or even outside if it’s quiet.";
        }

        if (temp > 22 && temp <= 30) {
            return "Warm – keep the room ventilated and stay hydrated while studying.";
        }


        return "Very hot – study in a cool, shaded indoor environment.";
    }
}
