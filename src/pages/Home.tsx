import { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';

export const Home = () => {
  const token = localStorage.getItem("token");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getVideos();
  }, [])

  const getVideos = async () => {
    const url = "http://localhost:3000/api/video/";
    try {
      if (!token) {
        throw new Error("No token available");
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      });
      if (!response.ok) throw new Error("Error getting the videos");
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Home</h1>
      
    </div>
  )
}
