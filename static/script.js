
document.querySelector('button[name="search"]').addEventListener('click', async function() {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();

        const city = document.getElementById('cityInput').value;
        if (!city) {
            alert('Please enter a valid city name.');
            return;
        }

        try {
            let CITY_WEATHER = await fetch(`/weather?city=${city}`);
            let weather = await CITY_WEATHER.json();

            if (weather.error) {
                document.querySelector('.Today').textContent = weather.error;
                return;
            }
            console.log(weather);
            document.querySelector('.Today').innerHTML = `
                <h2>${city}</h2>
                <h1>${weather.main.temp}&deg;F</h1>
                <h3>${weather.weather[0].description}</h3>`;

            let forecastResponse = await fetch(`/forecast?city=${encodeURIComponent(city)}`);
            let forecast = await forecastResponse.json();

            document.querySelector('.Forecast .header').innerHTML = '5 day Forecast';
            const forecastList = forecast.list;

            const dailyData = {};
            forecastList.forEach(entry => {
                const date = new Date(entry.dt_txt);
                const day = date.toDateString();

                if (!dailyData[day]) {
                    dailyData[day] = [];
                }

                dailyData[day].push(entry);
            });

            const daysArr = Object.keys(dailyData).slice(0, 5);
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            daysArr.forEach((dayStr, i) => {
                const entries = dailyData[dayStr];

                const temps = entries.map(e => e.main.temp);
                const minTemp = Math.min(...temps);
                const maxTemp = Math.max(...temps);

                const descriptions = entries.map(e => e.weather[0].description);
                const freq = {};
                descriptions.forEach(d => freq[d] = (freq[d] || 0) + 1);
                const mostCommon = Object.entries(freq).reduce((a, b) => a[1] > b[1] ? a : b)[0];

                const dateObj = new Date(dayStr);
                const dayName = dayNames[dateObj.getDay()];

                document.querySelector(`.day${i + 1}`).innerHTML = `
                    <th>${dayName}</th>
                    <td>Min: ${minTemp.toFixed(1)}°F</td>
                    <td>Max: ${maxTemp.toFixed(1)}°F</td>
                    <td>${mostCommon}</td>
                `;
            });

            
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error fetching weather data');
            
        }
    

    
})
