const express=require('express');
const axios =require('axios');
const mongoose=require('mongoose');

const app=express();
const PORT= 3001;


mongoose.connect("mongodb://127.0.0.1:27017/weatherDB")
.then(()=>console.log('Mongo Connected'))
.catch((err)=>console.log(err));

const weatherSchema=new mongoose.Schema({
    temp: Number,
    feels_like: Number,
    temp_min: Number,
    temp_max: Number,
    pressure: Number,
    humidity:Number,
    sea_level:Number,
    grnd_level:Number

});

const Weather = mongoose.model('Weather',weatherSchema);


app.get('/save-weather', async (req, res) => {
    try {
      const apiKey = '9e07c728f0f2c78a9b7534ed1168fa4c';  // Your OpenWeatherMap API key
      const city = req.query.city;  // Get the city from query parameter
      
      // Check if city is provided in the query
      if (!city) {
        return res.status(400).json({ error: 'Please provide a city name' });
      }
  
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      
      // Fetch weather data
      const response = await axios.get(weatherUrl);
      
      // Extract the 'weather' data from the response
      const weatherData = response.data.main; // Extract only the first weather object
      console.log(weatherData);
      
      // Create a new weather document from the fetched data
      const newWeather = new Weather({
        temp: weatherData.temp,
        feels_like: weatherData.feels_like,
        temp_min: weatherData.temp_min,
        temp_max: weatherData.temp_max,
        pressure: weatherData.pressure,
        humidity: weatherData.humidity,
        sea_level: weatherData.sea_level,
        grnd_level: weatherData.grnd_level
      });
  
      // Save the weather data to MongoDB
      await newWeather.save();
  
      res.json({
        message: 'Weather data saved successfully!',
        weatherData: newWeather
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch or save weather data' });
    }
  });

app.listen(PORT,()=>{console.log(`server is running on port ${PORT}`)});
