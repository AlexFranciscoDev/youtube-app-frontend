import { useEffect, useState } from "react";
import { Global } from "../helpers/Global";
import CategoryCard from "../components/CategoryCard";
import "./Categories.css";

type Category = {
    _id: string,
    name: string,
    description: string,
    image: string
}

export const Categories = () => {
  // Token used because you can only see data if it's logged in
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Starts being true, because we want it to be displayed at the beginning and when the data is loaded, hide it.
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getCategories();
  }, [])

  const getCategories = async () => {
    const url = `${Global.url}category/`;
    try {
        // Check if there's a token
        if (!token) {
            throw new Error("No token available");
        }
        // Fetch petition
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        // If ders no videos found, we set the videos to empty, otherwise we assign them
        if (response.status === 404) {
            setCategories([]);
            return;
        }
        // If the petition is not valid, send error
        if (!response.ok) throw new Error('Error getting the videos');
        // The petition is good
        const data = await response.json();
        setCategories(data.categories);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        setError(message);
        console.log(error);
    } finally {
        // After every operation, we change the loading status to false to stop displaying it
        setIsLoading(false);
    }
  };

  return (
    <div className="categories">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="categories__grid">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              _id={category._id}
              name={category.name}
              image={category.image}
            />
          ))}
        </div>
      )}
    </div>
  );
};
