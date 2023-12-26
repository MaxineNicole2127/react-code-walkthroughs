import React, {useContext, useEffect, useState } from 'react';

const AppContext = React.createContext();

import axios from 'axios';

const allMealsURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const randomMealURL = "https://www.themealdb.com/api/json/v1/1/random.php";

const getFavoritesFromLocalStorage = () => {
    let favorites = localStorage.getItem("favorites");
    if(favorites) {
        favorites = JSON.parse(localStorage.getItem("favorites"));
    } else {
        favorites = [];
    }
    return favorites;
}

const AppProvider = ({ children }) => {
    // set a meals array
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [favorites, setFavorites] = useState(getFavoritesFromLocalStorage());

    const fetchMeals = async(url) => {
        setLoading(true);
        try {    
            const {data} = await axios(url);
            if(data.meals) {
                setMeals(data.meals);
            } else {
                setMeals([]);
            }
            console.log(data);
        } catch(error) {
            console.log(error.response);
        }
        setLoading(false);
    } 

    const fetchRandomMeal = () => {
        fetchMeals(randomMealURL);
    }

    const selectMeal = (idMeal, favoriteMeal) => {
        console.log(idMeal);
        let meal;
        if(favoriteMeal) {
            meal = favorites.find((meal) => meal.idMeal === idMeal);
        } else {
            meal = meals.find((meal) => meal.idMeal === idMeal);
        }
        setSelectedMeal(meal);
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const addToFavorites = (idMeal) => {
        console.log(idMeal);
        console.log(favorites);
        const meal = meals.find((meal) => meal.idMeal === idMeal);
        const alreadyFavorite = favorites.find((meal) => meal.idMeal === idMeal);
        if(alreadyFavorite) return
        const updatedFavorites = [...favorites, meal];
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }

    const removeFromFavorites = (idMeal) => {
        const updatedFavorites = favorites.filter((meal) => meal.idMeal !== idMeal);
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }

    useEffect(() => {
        fetchMeals(allMealsURL);
    }, [])

    useEffect(() => {
        if(!searchTerm) return;
        fetchMeals(`${allMealsURL}${searchTerm}`);
    }, [searchTerm])

    return <AppContext.Provider value={{ loading, meals, setSearchTerm, fetchRandomMeal, showModal, selectedMeal, selectMeal,closeModal, addToFavorites, removeFromFavorites, favorites }}>
        {children} {/* the application itself */}
    </AppContext.Provider>
}
export const useGlobalContext = () => {
    return useContext(AppContext);
}
export {AppContext, AppProvider};