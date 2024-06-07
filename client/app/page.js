"use client";
import LoginComponent from "@components/LoginComponent";
import Router, { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";

/**
 * This function renders a React component that checks if the user is authorized to access the page.
 *
 * @return {JSX.Element} Returns a JSX element that renders a LoginComponent inside a QueryClientProvider.
 */
export default function Page() {
  const [authorize, setAuthorize] = useState(false);

  const router = useRouter();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: Infinity,
      },
    },
  });
  const showNavBar = router.pathname === "/" ? false : true;

  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (username === "admin" && password === "admin") {
      setAuthorize(true);
    } else {
      router.replace("/");
      setAuthorize(false);
    }
  }, []);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LoginComponent />
      </QueryClientProvider>
    </>
  );
}
