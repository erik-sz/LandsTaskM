// services/weather.js
import axios from 'axios';
import Constants from 'expo-constants';

// Fetch current and forecast weather data from the OpenWeatherMap API based on the provided latitude and longitude
export async function fetchWeatherData(lat, lon) {
    const baseUrl = "https://api.openweathermap.org/data/2.5/forecast";
    const { OpenWeatherAPI } = Constants.expoConfig.extra;

    try {
        const response = await axios.get(`${baseUrl}?lat=${lat}&lon=${lon}&appid=${OpenWeatherAPI}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
};

// Fetch teh current wether data from the task table weather column based on the provided task ID and return the temperature and description
export async function fetchTaskWeatherData(taskId) {
		const { data, error } = await supabase.from('tasks').select('weather').eq('task_id', taskId);
		if (error) {
				console.error('Error fetching task weather data:', error);
				return null;
		}

		return data;
};

// Calculate the time until the event based on the provided date and time and return a string
export const shouldSendPushNotification = async (riskDescription, weatherData) =>{
    const notifications = [];

    for (const forecast of weatherData.list) {
        const { dt, wind, rain } = forecast;
        const timeUntilEvent = calculateTimeUntilEvent(dt);

        if (riskDescription === 'HeavyRain' && rain && rain['3h'] >= 10) {
            notifications.push({
                message: `Heavy rain expected in ${timeUntilEvent}. Consider rescheduling tasks related to Lawn Care or Planting.`,
                timeUntilEvent,
                eventType: 'Rain',
            });
        } else if (riskDescription === 'StrongWind' && wind.speed >= 25) {
            notifications.push({
                message: `Strong wind expected in ${timeUntilEvent}. Consider rescheduling tasks related to Fencing or Decking.`,
                timeUntilEvent,
                eventType: 'Wind',
            });
        } else if (riskDescription === 'Freezing' && forecast.main.temp_max < 273.15) {
            notifications.push({
                message: `Freezing temperatures expected in ${timeUntilEvent}. Be cautious with any water feature installations or masonry.`,
                timeUntilEvent,
                eventType: 'Temperature',
            });
        } else if (riskDescription === 'Heatwave' && forecast.main.temp_min > 303.15) {
            notifications.push({
                message: `Heatwave conditions expected in ${timeUntilEvent}. Consider rescheduling tasks that involve heavy physical activity.`,
                timeUntilEvent,
                eventType: 'Temperature',
            });
        }
    }

    return notifications.length > 0 ? notifications : null;
};