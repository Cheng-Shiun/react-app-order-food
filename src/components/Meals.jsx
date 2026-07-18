// import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import MealItem from "./MealItem";
import Error from "./UI/Error";

const requestConfig = {}; // 確保 useFetch 參數為固定的值，否則在 hook 中 useEffect 執行時會導致 {} 會改變而有無限循環

export default function Meals() {
  const { responseData: loadMeals, error, isLoading } = useFetch("https://react-app-order-food-backend.onrender.com/meals", requestConfig, []);

  // console.log(isLoading);
  if (isLoading) {
    return <p className="center">加載菜單中...</p>;
  }

  if (error) {
    return <Error title="加載菜單資料發生錯誤" message={error} />;
  }

  // const [loadMeals, setLoadMeals] = useState([]);
  // useEffect(() => {
  //   async function fetchMeals() {
  //     const response = await fetch("http://localhost:3000/meals");

  //     if (!response.ok) {
  //       // throw new Error('Failed to fetch meals...');
  //       return;
  //     }

  //     const meals = await response.json();
  //     setLoadMeals(meals);
  //   }

  //   fetchMeals();
  // }, []);

  return (
    <ul id="meals">
      {loadMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
