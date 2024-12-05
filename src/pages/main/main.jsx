import React, { useEffect, useState } from "react";
import axios from "axios";
import "./main.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 1,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 1,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1,
    },
};

function Main() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "http://localhost:3001/articles",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setArticles(response.data.articles);
            } catch (error) {
                console.error(
                    "Error fetching articles:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    function truncateText(text, wordLimit) {
        const wordsArray = text.split(" ");
        if (wordsArray.length > wordLimit) {
            return wordsArray.slice(0, wordLimit).join(" ") + "...";
        }
        return text;
    }

    return (
        <div className="min-h-screen flex flex-col bg-pink-200">
            <Navbar />
            <div className="flex-grow relative z-10 flex flex-col items-center mt-14">
                <div className="text-center font-SourGummy">
                    <div className="my-10">
                        <span className="text-5xl">Welcome to CycleCare!</span>
                    </div>
                    <div>
                        <span className="text-2xl text-gray-700 text-justify mx-auto">
                            Your Partner in Empowering Women's Health and
                            Well-being
                        </span>
                    </div>
                </div>
                {loading ? (
                    <div className="text-center my-10">
                        <span>Loading articles...</span>
                    </div>
                ) : (
                    <div className="w-full max-w-5xl my-10">
                        <Carousel
                            swipeable={true}
                            draggable={true}
                            showDots={true}
                            responsive={responsive}
                            ssr={true}
                            infinite={true}
                            autoPlay={true}
                            autoPlaySpeed={3000}
                            keyBoardControl={true}
                            customTransition="all .5"
                            transitionDuration={500}
                            containerClass="carousel-container"
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                            dotListClass="custom-dot-list-style"
                            itemClass="carousel-item-padding-40-px">
                            {articles.map((article, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 mx-2 flex flex-col"
                                    style={{ width: "300px", height: "600px" }} // Set consistent width and height
                                >
                                    {/* Image Section */}
                                    <div
                                        className="relative"
                                        style={{
                                            height: "180px",
                                            overflow: "hidden",
                                        }} // Fixed image height
                                    >
                                        <img
                                            src={
                                                article.image ||
                                                "fallback-image-url.jpg"
                                            }
                                            alt={article.title || "Article"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h2 className="font-bold text-lg text-gray-800">
                                            {article.title}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-2 flex-grow">
                                            {truncateText(
                                                article.description,
                                                20
                                            )}
                                        </p>
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-pink-500 text-white text-sm px-4 py-2 rounded-full mt-4 hover:bg-pink-600 self-start">
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Main;
