import React from "react";
import "./main.css";
import Navbar from "../../components/Navbar/Navbar";
import bg from "../../components/assets/videos/bg.mp4";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import article from "../../components/assets/images/article.webp";
import article2 from "../../components/assets/images/article2.webp";
import article3 from "../../components/assets/images/article3.webp";
import article4 from "../../components/assets/images/article4.webp";
import Footer from "../../components/Footer/Footer";
function Main() {
    function truncateText(text, wordLimit) {
        const wordsArray = text.split(" ");
        if (wordsArray.length > wordLimit) {
            return wordsArray.slice(0, wordLimit).join(" ") + "...";
        }
        return text;
    }

    const cards = [
        {
            title: "Can Stress Cause a Missed or Late Period?",
            description:
                "Stress can lead to irregular periods and changes to your menstrual cycle. This can include delayed or missed periods.",
            image: article,
            url: "https://tampax.com/en-us/period-health/stress-and-periods/",
        },
        {
            title: "What Are FSA and HSA Eligible Items?",
            description:
                "Flexible spending accounts (FSAs) and health savings accounts(HSAs) are now covering Feminine Care products.",
            image: article2,
            url: "https://tampax.com/en-us/period-health/feminine-care-products-now-covered-by-HSA-FSA/",
        },
        {
            title: "Everything You Need to Know About PMS",
            description:
                "PMS can result in changes to women's physical, emotional , and behavioral health before their period. Learn the signs and ways to ease your symptoms",
            image: article3,
            url: "https://tampax.com/en-us/period-health/what-is-premenstrual-syndrome-pms/",
        },
        {
            title: "The Facts on Menstrual Cycle Phases",
            description:
                "Learn what happens in the 28days of your menstrual cycle. View a breakdown of the menstrual, follicular, ovulation, and luteal phases.",
            image: article4,
            url: "https://tampax.com/en-us/period-health/menstrual-cycle-phases/",
        },
        {
            title: "Tips for Talking with Kids about Puberty & Periods",
            description:
                "Girls can get their first periods as early as 8 years old, making chats around body changes, puberty and menstruation difficult. Use this guide for help",
            image: article,
            url: "https://tampax.com/en-us/period-health/tips-for-talking-with-kids-about-periods-puberty/",
        },

        // Add more card data here
    ];
    return (
        <div className="relative   overflow-x-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="object-cover h-full w-full absolute z-0">
                <source src={bg} type="video/mp4" />
            </video>

            <div className="absolute z-5 h-full w-full bg-gradient-to-b from-transparent to-white"></div>

            <Navbar />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center h-full">
                <div className="text-center font-Comfortaa">
                    <div className="my-10">
                        <span className="text-5xl">Welcome to CycleCare!</span>
                    </div>
                    <div>
                        <span className="text-2xl text-gray-500 text-justify mx-auto">
                            Your Partner in Empowering Women's Health and
                            Well-being
                        </span>
                    </div>
                    <div className="my-10 md:mx-42 lg:mx-56 sm:mx-12 text-justify">
                        <span className="text-3xl text-gray-500">
                            Our very own free Menstrual Monitoring System helps
                            you to monitor your menstrual period. With this
                            Web-based Application, it helps you to be more aware
                            of your body and health.
                        </span>
                    </div>
                </div>
                <div
                    className="flex overflow-x-auto snap-x snap-mandatory space-x-4 p-2 my-10 rounded-xl"
                    style={{ maxWidth: "1065px" }}>
                    {cards.map((card, index) => (
                        <Card
                            key={index}
                            sx={{
                                display: "flex", // Make the Card use Flexbox
                                flexDirection: "column", // Arrange children in a column
                                maxWidth: 345,
                                height: "100%", // Ensure the card takes up the available height
                            }}
                            className="snap-center flex-shrink-0">
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={card.image}
                                    alt={card.title}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    {" "}
                                    {/* Make CardContent grow to use available space */}
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div">
                                        {card.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary">
                                        {truncateText(card.description, 20)}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions sx={{ justifyContent: "flex-start" }}>
                                <a
                                    href={card.url}
                                    style={{ textDecoration: "none" }}>
                                    <Button size="small" color="primary">
                                        View
                                    </Button>
                                </a>
                            </CardActions>
                        </Card>
                    ))}
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Main;
