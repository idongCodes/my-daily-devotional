"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon, CloudIcon, RainIcon, SnowIcon } from "./WeatherIcons";

interface WeatherData {
  current: {
    temperature: number;
    weathercode: number;
    is_day: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export default function DailyHeader() {
  const [dateString, setDateString] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Set Date
    const now = new Date();
    const formattedDate = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(
      now.getDate()
    ).padStart(2, "0")}/${now.getFullYear()}`;
    setDateString(formattedDate);

    // 2. Fetch Weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&timezone=auto`
            );
            
            if (!res.ok) throw new Error("Failed to fetch weather data");
            
            const data = await res.json();
            setWeather({
              current: data.current_weather,
              daily: data.daily,
            });
          } catch (err) {
            console.error(err);
            setError("Unable to load weather.");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error(err);
          setError("Location access denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
      setLoading(false);
    }
  }, []);

  const getWeatherIcon = (code: number, isDay: number) => {
    // WMO Weather Codes
    // 0: Clear sky
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // 45, 48: Fog
    // 51, 53, 55: Drizzle
    // 61, 63, 65: Rain
    // 71, 73, 75: Snow
    // 77: Snow grains
    // 80, 81, 82: Rain showers
    // 85, 86: Snow showers
    // 95: Thunderstorm
    // 96, 99: Thunderstorm with slight and heavy hail

    if (code === 0 || code === 1) {
      return isDay ? <SunIcon className="w-12 h-12 text-yellow-500" /> : <MoonIcon className="w-12 h-12 text-blue-300" />;
    }
    if (code === 2 || code === 3 || code === 45 || code === 48) {
      return <CloudIcon className="w-12 h-12 text-gray-400" />;
    }
    if (
      (code >= 51 && code <= 65) ||
      (code >= 80 && code <= 82) ||
      code === 95 ||
      code === 96 ||
      code === 99
    ) {
      return <RainIcon className="w-12 h-12 text-blue-500" />;
    }
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
      return <SnowIcon className="w-12 h-12 text-blue-200" />;
    }
    
    // Default
    return <CloudIcon className="w-12 h-12 text-gray-400" />;
  };

  return (
    <div className="flex flex-col items-start justify-center space-y-4 mb-8 w-full max-w-4xl">
      {/* Date */}
      <h2 className="text-2xl font-semibold tracking-wide">{dateString || "Loading..."}</h2>

      {/* Weather Card */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6 shadow-sm flex items-center space-x-6 min-w-[250px] justify-center">
        {loading ? (
          <span className="text-sm text-gray-500">Loading weather...</span>
        ) : error ? (
          <span className="text-sm text-red-400">{error}</span>
        ) : weather ? (
          <>
            <div className="flex-shrink-0">
              {getWeatherIcon(weather.current.weathercode, weather.current.is_day)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">
                  {Math.round(weather.daily.temperature_2m_max[0])}°
                </span>
                <span className="text-xl text-gray-500 dark:text-gray-400">
                  / {Math.round(weather.daily.temperature_2m_min[0])}°
                </span>
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                Today
              </span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
