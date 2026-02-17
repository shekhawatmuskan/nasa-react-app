import React, { useEffect, useState } from "react";
import Footer from "./components/Footer";
import SideBar from "./components/SideBar";
import Main from "./components/Main";
import NavigationSidebar from "./components/NavigationSidebar";
import Gallery from "./components/Gallery";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showNavSidebar, setShowNavSidebar] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  function handleToggleModal() {
    setShowModal(!showModal);
  }

  function handleToggleNavSidebar() {
    setShowNavSidebar(!showNavSidebar);
  }

  function handleShowGallery() {
    setShowNavSidebar(false);
    setShowGallery(true);
    fetchGalleryImages();
  }

  async function handleShowToday() {
    setShowNavSidebar(false);
    setShowGallery(false);
    setShowModal(false);
    
    // Fetch today's image
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
          return;
        }
      } catch (error) {
        console.error("Invalid cached data, fetching new data...");
      }
    }

    try {
      setLoading(true);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Error fetching API: ${res.statusText}`);
      }
      const apiData = await res.json();
      localStorage.setItem(localKey, JSON.stringify(apiData));
      setData(apiData);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectImage(image) {
    setData(image);
    setShowGallery(false);
    setShowModal(false);
  }

  async function fetchGalleryImages() {
    const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
    if (!NASA_KEY) {
      console.error("NASA API key is missing. Check your .env file.");
      return;
    }

    // Fetch last 30 days of APOD images
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`;

    try {
      setGalleryLoading(true);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Error fetching API: ${res.statusText}`);
      }
      const apiData = await res.json();
      // API returns array in reverse chronological order, reverse it to show oldest first
      setGalleryImages(Array.isArray(apiData) ? apiData.reverse() : [apiData]);
    } catch (err) {
      console.error(err.message);
      setGalleryImages([]);
    } finally {
      setGalleryLoading(false);
    }
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
      {showGallery ? (
        <Gallery
          images={galleryImages}
          loading={galleryLoading}
          onSelectImage={handleSelectImage}
        />
      ) : (
        <div className={`appContainer ${showModal ? 'sidebarOpen' : ''}`}>
          {data && <Main data={data} showModal={showModal} />}
          {showModal && (
            <SideBar data={data} handleToggleModal={handleToggleModal} />
          )}
        </div>
      )}
      <NavigationSidebar
        isOpen={showNavSidebar}
        onClose={handleToggleNavSidebar}
        onShowGallery={handleShowGallery}
        onShowToday={handleShowToday}
      />
      {data && (
        <Footer
          data={data}
          handleToggleModal={handleToggleModal}
          handleToggleNavSidebar={handleToggleNavSidebar}
          showModal={showModal}
          showGallery={showGallery}
        />
      )}
    </>
  );
}

export default App;
