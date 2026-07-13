import { useCallback, useEffect, useState } from "react";
async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);
  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || "Failed to send http request");
  }

  return resData;
}

export default function useFetch(url, config, initialVal) {
  const [responseData, setResponseData] = useState(initialVal);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  function clearResponseData() {
    setResponseData(initialVal);
  }

  const sendRequest = useCallback(async function sendRequest(data) {
    setIsLoading(true);
    try {
      const resData = await sendHttpRequest(url, { ...config, body: data });
      setResponseData(resData);
    } catch (error) {
      setError(error.message || "Something went wrong!");
    }
    setIsLoading(false);
  }, []);

  // 確保 method GET 會立刻執行
  useEffect(() => {
    if ((config && (config.methods === "GET" || !config.method)) || !config) {
      console.log("fetch is running...");
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    responseData,
    isLoading,
    error,
    sendRequest,
    clearResponseData,
  };
}
