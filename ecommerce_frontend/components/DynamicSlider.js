import { useState, useEffect } from "react";
import Link from "next/link";
import api from "../services/api";

export default function DynamicSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await api.get("/carousel/slides/active/");
        setSlides(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch carousel slides:", err);
        setError("Failed to load slides");
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Auto-advance every 5 seconds

      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden">
        <div className="container py-10 lg:py-14">
          <div className="h-96 rounded-2xl bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 animate-pulse flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400">
              Loading slides...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || slides.length === 0) {
    return (
      <section className="relative overflow-hidden">
        <div className="container py-10 lg:py-14">
          <div className="h-96 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-2">Welcome to Our Store</h2>
              <p className="text-lg mb-6">
                Discover amazing products at unbeatable prices
              </p>
              <Link
                href="#products"
                className="px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative overflow-hidden">
      <div className="container py-10 lg:py-14">
        <div
          className="relative h-96 rounded-2xl overflow-hidden shadow-lg"
          style={{
            background: currentSlideData.background_color
              ? `linear-gradient(135deg, ${currentSlideData.background_color} 0%, ${currentSlideData.background_color}dd 100%)`
              : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          }}
        >
          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full px-8">
              {/* Left Content - Text */}
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${currentSlideData.text_color}20`,
                      color: currentSlideData.text_color || "#ffffff",
                    }}
                  >
                    New season • Best deals
                  </span>
                </div>

                <h1
                  className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4"
                  style={{ color: currentSlideData.text_color || "#ffffff" }}
                >
                  {currentSlideData.title}
                </h1>

                {currentSlideData.subtitle && (
                  <p
                    className="text-lg mb-6 max-w-xl"
                    style={{
                      color: `${currentSlideData.text_color || "#ffffff"}dd`,
                    }}
                  >
                    {currentSlideData.subtitle}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <Link
                    href={currentSlideData.cta_link || "#products"}
                    className="px-6 py-3 rounded-full font-medium transition-colors"
                    style={{
                      backgroundColor: currentSlideData.text_color || "#ffffff",
                      color: currentSlideData.background_color || "#3b82f6",
                    }}
                  >
                    {currentSlideData.cta_text || "Shop Now"}
                  </Link>

                  <Link
                    href="#categories"
                    className="px-6 py-3 rounded-full border-2 font-medium transition-colors"
                    style={{
                      borderColor: currentSlideData.text_color || "#ffffff",
                      color: currentSlideData.text_color || "#ffffff",
                    }}
                  >
                    Browse Categories
                  </Link>
                </div>
              </div>

              {/* Right Content - Image */}
              <div className="flex items-center justify-center relative">
                {currentSlideData.image_url ? (
                  <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={currentSlideData.image_url}
                      alt={currentSlideData.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Optional overlay for better text readability */}
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  </div>
                ) : (
                  <div className="w-full h-80 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-white bg-opacity-30 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-16 h-16 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-white text-sm">No image available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-white"
                      : "bg-white bg-opacity-50 hover:bg-opacity-75"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
