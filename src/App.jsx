import React, { useEffect, useState } from "react";
import Footer from "./components/Footer";
import SideBar from "./components/SideBar";
import Main from "./components/Main";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function handleToggleModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
      if (!NASA_KEY) {
        console.error("NASA API key is missing. Check your .env file.");
        return;
      }

      const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`;
      const today = new Date().toDateString();
      const localKey = `NASA-${today}`;
      const cachedData = localStorage.getItem(localKey);

      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          if (parsedData && parsedData.date === today) {
            setData(parsedData);
            console.log("Fetched from cache today");
            return;
          }
        } catch (error) {
          console.error("Invalid cached data, fetching new data...");
        }
      }

      // Clear storage and fetch new data
      localStorage.clear();

      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Error fetching API: ${res.statusText}`);
        }
        const apiData = await res.json();
        localStorage.setItem(localKey, JSON.stringify(apiData));
        setData(apiData);
        console.log("Fetched from API today");
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAPIData();
  }, []);

  return (
    <>
      {loading && (
        <div className="loadingState">
          <i className="fa-solid fa-gear"></i> Loading...
        </div>
      )}
      {data && <Main data={data} />}
      {showModal && (
        <SideBar data={data} handleToggleModal={handleToggleModal} />
      )}
      {data && <Footer data={data} handleToggleModal={handleToggleModal} />}
    </>
  );
}

export default App;
