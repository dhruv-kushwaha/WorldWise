import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCitiesData() {
      try {
        setIsLoading(true);
        const res = await axios.get(`${BASE_URL}/cities`);
        const data = res.data;
        setCities(data);
      } catch (err) {
        alert("An error occured");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCitiesData();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/cities/${id}`);
      const data = res.data;
      setCurrentCity(data);
    } catch (err) {
      alert("An error occured");
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true);

      const res = await axios.post(`${BASE_URL}/cities/`, newCity, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = res.data;
      setCities((cities) => [...cities, data]);
    } catch (err) {
      alert("An error occured while creating city");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await axios.delete(`${BASE_URL}/cities/${id}`);
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (err) {
      alert("An error occured while deleting the City");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        setCurrentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("CitiesContext is being used outside the CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
