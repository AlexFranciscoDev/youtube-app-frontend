import React, { useState } from "react";
import { Global } from "../helpers/Global";

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

  const getCategories = async () => {
    const url = `${Global.url}category/`;
  };

  return <div>Categories</div>;
};
