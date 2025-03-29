
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import WonderWhizLogo from "@/components/WonderWhizLogo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-wonderwhiz-gradient">
      <Helmet>
        <title>Page Not Found - WonderWhiz</title>
        <meta name="description" content="We couldn't find the page you were looking for. Let's explore something else!" />
      </Helmet>
      
      <div className="text-center p-8 max-w-lg">
        <div className="flex justify-center mb-6">
          <WonderWhizLogo className="h-20 w-20" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-wonderwhiz-blue mb-6">Oops! This page has gone on an adventure.</p>
        <p className="text-gray-300 mb-10">
          The page you're looking for seems to have wandered off. Let's find something more magical!
        </p>
        <Link to="/" className="jelly-button inline-block">
          Back to Wonder
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
