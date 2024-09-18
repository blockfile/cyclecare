import React, { useState, useEffect } from "react";
import { MdBloodtype } from "react-icons/md";
import "./calendar.css";
import axios from "axios";
import { Avatar } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import bg from "../../components/assets/videos/bg.mp4";
import Footer from "../../components/Footer/Footer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ovule from "../../components/assets/images/ovule.png";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
// Register required elements in Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

function CalendarMens() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showHistory, setShowHistory] = useState(true);
    const [menstruationPeriod, setMenstruationPeriod] = useState({
        start: null,
        end: null,
    });
    const [contextMenuPos, setContextMenuPos] = useState({
        visible: false,
        x: 0,
        y: 0,
        day: null,
    });
    const [hoverInfo, setHoverInfo] = useState({
        visible: false,
        content: "",
        position: { x: 0, y: 0 },
    });
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        avatar: "", // This will hold the Base64-encoded string
    });
    const [ovulationDays, setOvulationDays] = useState([]);
    const [lastMenstrualDate, setLastMenstrualDate] = useState(null);
    const [menstrualCycleLength, setMenstrualCycleLength] = useState(28);
    const [menstruationPeriods, setMenstruationPeriods] = useState([]);
    const [prediction, setPrediction] = useState(null);

    const predictNextMenstruation = (periods) => {
        if (periods.length < 2) return null;

        periods.sort((a, b) => new Date(a.start) - new Date(b.start));

        const cycleDifferences = periods
            .map((_, index) => {
                if (index === 0) return null;
                const prevPeriod = periods[index - 1];
                const currentPeriod = periods[index];
                const diff =
                    (new Date(currentPeriod.start) - new Date(prevPeriod.end)) /
                    (1000 * 60 * 60 * 24); // Difference in days
                return diff;
            })
            .filter(Boolean);

        const isIrregular = cycleDifferences.some((diff, index) => {
            if (index === 0) return false;
            return Math.abs(diff - cycleDifferences[index - 1]) > 3;
        });

        const averageCycleLength =
            cycleDifferences.reduce((a, b) => a + b, 0) /
            cycleDifferences.length;

        const lastPeriodEnd = new Date(periods[periods.length - 1].end);

        const nextPeriodStart = new Date(lastPeriodEnd.getTime());
        nextPeriodStart.setDate(
            lastPeriodEnd.getDate() +
                (isIrregular
                    ? averageCycleLength
                    : cycleDifferences[cycleDifferences.length - 1])
        );

        // Predict the 5 days around the expected start
        const day1 = new Date(nextPeriodStart.getTime());
        const day2 = new Date(nextPeriodStart.getTime());
        day2.setDate(nextPeriodStart.getDate() + 1);
        const day3 = new Date(nextPeriodStart.getTime());
        day3.setDate(nextPeriodStart.getDate() + 2);
        const day4 = new Date(nextPeriodStart.getTime());
        day4.setDate(nextPeriodStart.getDate() + 3);
        const day5 = new Date(nextPeriodStart.getTime());
        day5.setDate(nextPeriodStart.getDate() + 4);

        return {
            day1,
            day2,
            day3,
            day4,
            day5,
        };
    };

    useEffect(() => {
        const fetchPrediction = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(
                    "http://localhost:3001/periods",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data && response.data.periods) {
                    setPastPeriods(response.data.periods);
                    const predictedDates = predictNextMenstruation(
                        response.data.periods
                    );
                    setPrediction(predictedDates);
                }
            } catch (error) {
                console.error("Failed to fetch past periods:", error);
            }
        };

        fetchPrediction();
    }, []);
    const toggleHistory = () => {
        setShowHistory(!showHistory); // Toggle history visibility
    };
    const pieData = {
        labels: [
            `Day 1 (${prediction?.day1?.toLocaleDateString() || "N/A"})`,
            `Day 2 (${prediction?.day2?.toLocaleDateString() || "N/A"})`,
            `Day 3 (${prediction?.day3?.toLocaleDateString() || "N/A"})`,
            `Day 4 (${prediction?.day4?.toLocaleDateString() || "N/A"})`,
            `Day 5 (${prediction?.day5?.toLocaleDateString() || "N/A"})`,
        ],
        datasets: [
            {
                label: "Menstruation Prediction",
                data: [60, 70, 80, 90, 100], // Adjust likelihood percentages accordingly
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    useEffect(() => {
        const fetchUserCycleData = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(
                    "http://localhost:3001/user/info",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setMenstruationPeriod({
                        start: new Date(data.user.startDate),
                        end: new Date(data.user.endDate),
                    });
                    setMenstruationPeriods(
                        data.user.periods.map((period) => ({
                            start: new Date(period.start),
                            end: new Date(period.end),
                        }))
                    );
                } else {
                    console.error("Failed to fetch data");
                }
            } catch (error) {
                console.error("Error fetching user cycle data:", error);
            }
        };

        fetchUserCycleData();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/user/info",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                if (response.data && response.data.user) {
                    setUserData(response.data.user);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const addMenstruationPeriod = (newPeriod) => {
        setMenstruationPeriods((prevPeriods) => [...prevPeriods, newPeriod]);
    };

    const predictFuturePeriods = () => {
        let lastPeriodEnd = menstruationPeriod.end || new Date();
        const predictions = [];
        const ovulations = [];
        for (let i = 0; i < 24; i++) {
            const nextStart = new Date(lastPeriodEnd.getTime());
            nextStart.setDate(nextStart.getDate() + menstrualCycleLength);
            const nextEnd = new Date(nextStart.getTime());
            nextEnd.setDate(nextEnd.getDate() + 5);

            const ovulationDay = new Date(nextStart.getTime());
            ovulationDay.setDate(nextStart.getDate() - 14);

            for (let j = -4; j <= 0; j++) {
                const fertileDay = new Date(ovulationDay);
                fertileDay.setDate(fertileDay.getDate() + j);
                ovulations.push(fertileDay);
            }

            predictions.push({ start: nextStart, end: nextEnd });
            lastPeriodEnd = nextEnd;
        }
        setMenstruationPeriods((prevPeriods) => [
            ...prevPeriods,
            ...predictions,
        ]);
        setOvulationDays(ovulations);
    };

    useEffect(() => {
        if (menstruationPeriod.end) {
            predictFuturePeriods();
        }
    }, [menstruationPeriod.end, menstrualCycleLength]);

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    const currentMonthName = monthNames[currentDate.getMonth()];
    const pieOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "right", // Or wherever you want the legend to appear
            },
        },
    };

    useEffect(() => {
        if (lastMenstrualDate) {
            const nextPeriod = predictNextPeriod(
                lastMenstrualDate,
                menstrualCycleLength
            );
            setMenstruationPeriod(nextPeriod);
        }
    }, [lastMenstrualDate, menstrualCycleLength]);

    const goToPreviousMonth = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    const goToNextMonth = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );

    const handleRightClick = (event, day) => {
        event.preventDefault();
        setContextMenuPos({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            day,
        });
    };
    const isAnyPeriodOpen = () => {
        return menstruationPeriods.some((period) => !period.end);
    };

    const markMenstruationStart = async (day) => {
        const token = localStorage.getItem("token");
        const startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );
        addMenstruationPeriod({ start: startDate, end: null });

        const response = await fetch("http://localhost:3001/periods/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ start: startDate }),
        });

        if (response.ok) {
            console.log("Period started successfully");
        } else {
            console.error("Failed to start period");
        }

        setContextMenuPos({ visible: false });
    };

    const markMenstruationEnd = async (day) => {
        const token = localStorage.getItem("token");
        const endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );

        const updatedPeriods = menstruationPeriods.map((period) => {
            if (!period.end && period.start <= endDate) {
                return { ...period, end: endDate };
            }
            return period;
        });

        setMenstruationPeriods(updatedPeriods);

        const response = await fetch("http://localhost:3001/periods/end", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ end: endDate }),
        });

        if (response.ok) {
            console.log("Period ended successfully");
        } else {
            console.error("Failed to end period");
        }

        setContextMenuPos({ visible: false });
    };

    const cancelMenstruationPeriod = () => {
        setMenstruationPeriods((prevPeriods) =>
            prevPeriods.filter((period) => period.end !== null)
        );

        setMenstruationPeriods((prevPeriods) =>
            prevPeriods.map((period) => {
                if (!period.end) {
                    return { ...period, end: new Date(period.start) };
                }
                return period;
            })
        );

        setContextMenuPos({ visible: false });
    };
    const predictNextPeriod = (date, cycleLength) => {
        const predictionStartDate = new Date(date.getTime());
        predictionStartDate.setDate(
            predictionStartDate.getDate() + cycleLength
        );
        const predictionEndDate = new Date(predictionStartDate.getTime());
        predictionEndDate.setDate(predictionEndDate.getDate() + 5);
        return { start: predictionStartDate, end: predictionEndDate };
    };
    const isOvulationDay = (day) => {
        const checkDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );
        return ovulationDays.some(
            (ovulationDay) =>
                ovulationDay.getFullYear() === checkDate.getFullYear() &&
                ovulationDay.getMonth() === checkDate.getMonth() &&
                ovulationDay.getDate() === checkDate.getDate()
        );
    };
    const isMenstruationDay = (day) => {
        const checkDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );
        checkDate.setHours(0, 0, 0, 0);

        return menstruationPeriods.some((period) => {
            const start = new Date(period.start).setHours(0, 0, 0, 0);
            const end = period.end
                ? new Date(period.end).setHours(23, 59, 59, 999)
                : new Date().setHours(23, 59, 59, 999);
            return checkDate >= start && checkDate <= end;
        });
    };
    const isWithinMenstruationPeriod = (day) => {
        const targetDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );

        const startDate = new Date(menstruationPeriod.start);
        const endDate = new Date(menstruationPeriod.end);

        return targetDate >= startDate && targetDate <= endDate;
    };

    const renderDayCells = () => {
        const daysInMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        ).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const menstruationDay =
                isMenstruationDay(day) || isWithinMenstruationPeriod(day);
            const ovulationDay = isOvulationDay(day);

            const handleMouseEnter = (event) => {
                if (ovulationDay) {
                    setHoverInfo({
                        visible: true,
                        content: "High chance of pregnancy",
                        position: {
                            x: event.clientX + 10,
                            y: event.clientY + 10,
                        },
                    });
                }
            };

            const handleMouseLeave = () => {
                setHoverInfo({
                    visible: false,
                    content: "",
                    position: { x: 0, y: 0 },
                });
            };

            return (
                <div
                    key={day}
                    className={`day ${isToday(day) ? "today" : ""} ${
                        menstruationDay ? "menstruation" : ""
                    } ${ovulationDay ? "ovulation" : ""}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onContextMenu={(e) => handleRightClick(e, day)}
                    style={{
                        backgroundColor: menstruationDay
                            ? "pink"
                            : ovulationDay
                            ? "lightgreen"
                            : "transparent",
                        position: "relative",
                    }}>
                    {day}
                    {menstruationDay && (
                        <MdBloodtype className="text-red-700 z-10 absolute bottom-0 left-0 my-2 mx-2" />
                    )}
                    {ovulationDay && (
                        <img
                            src={ovule}
                            className="z-10 absolute top-0 right-0 mx-1 my-2"
                            style={{ width: "20px", height: "20px" }}
                            alt="Ovulation"
                        />
                    )}
                </div>
            );
        });
    };

    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    useEffect(() => {
        const closeMenu = () =>
            setContextMenuPos((prev) => ({ ...prev, visible: false }));
        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, []);
    const [pastPeriods, setPastPeriods] = useState([]);

    useEffect(() => {
        const fetchPastPeriods = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(
                    "http://localhost:3001/periods",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data && response.data.periods) {
                    setPastPeriods(response.data.periods);
                }
            } catch (error) {
                console.error("Failed to fetch past periods:", error);
            }
        };

        fetchPastPeriods();
    }, []);

    return (
        <div
            className="relative overflow-x-hidden bg-pink-50"
            onClick={() => setContextMenuPos({ visible: false })}>
            <Navbar />
            <div className="relative z-10 flex flex-col items-center h-full mt-14 mx-auto text-justify">
                <div>
                    <div className="flex space-x-3 mx-2 py-1 pt-10 justify-center">
                        <div className="border rounded-full">
                            <Avatar
                                src={
                                    userData.avatar
                                        ? `data:image/jpeg;base64,${userData.avatar}`
                                        : undefined
                                }
                                alt="User Avatar"
                            />
                        </div>
                        <div className="my-auto uppercase text-3xl font-Comfortaa">
                            <span>{userData.username}</span>
                            <span>'S Calendar</span>
                        </div>
                    </div>
                    <div className="flex w-full">
                        {/* Calendar Section */}
                        <div
                            className={`relative my-4 rounded-l-xl flex-grow transition-all duration-500 ${
                                showHistory ? "w-2/3" : "w-full"
                            }`}>
                            <div className="calendar-container">
                                {hoverInfo.visible && (
                                    <div
                                        className="hover-info absolute p-2 bg-white border border-gray-300 z-10"
                                        style={{
                                            top: hoverInfo.position.y + 2,
                                            left: hoverInfo.position.x + 2,
                                        }}>
                                        {hoverInfo.content}
                                    </div>
                                )}
                                <header className="calendar-header flex justify-between items-center">
                                    <FaArrowLeft
                                        onClick={goToPreviousMonth}
                                        size={25}
                                        className="cursor-pointer hover:text-red-500"
                                    />
                                    <h1 className="font-Comfortaa">{`${currentMonthName.toUpperCase()} ${currentDate.getFullYear()}`}</h1>
                                    <FaArrowRight
                                        onClick={goToNextMonth}
                                        size={25}
                                        className="cursor-pointer hover:text-red-500"
                                    />
                                </header>
                                <div className="calendar-grid">
                                    {daysOfWeek.map((day, index) => (
                                        <div
                                            key={`${day}-${index}`}
                                            className="day-of-week">
                                            {day}
                                        </div>
                                    ))}
                                    {renderDayCells()}
                                </div>
                            </div>
                        </div>

                        {/* History Toggle Button */}
                        <div className="flex items-center">
                            {showHistory ? (
                                <AiOutlineLeft
                                    size={30}
                                    onClick={toggleHistory}
                                    className="cursor-pointer hover:text-pink-500 transition-transform duration-300"
                                />
                            ) : (
                                <AiOutlineRight
                                    size={30}
                                    onClick={toggleHistory}
                                    className="cursor-pointer hover:text-pink-500 transition-transform duration-300"
                                />
                            )}
                        </div>

                        {/* Menstrual History Section */}
                        <div
                            className={`bg-pink-100 py-4 px-8 rounded-lg h-[566px]   font-Comfortaa transition-all duration-500 overflow-hidden ${
                                showHistory
                                    ? "w-1/3 mt-4 mb-4 opacity-100 "
                                    : "w-0 opacity-0"
                            }`}>
                            {showHistory && (
                                <>
                                    {" "}
                                    <div className=" border-b-2 mb-2">
                                        <h2 className="text-xl font-bold mb-4 ">
                                            Menstrual History
                                        </h2>
                                    </div>
                                    {pastPeriods.length === 0 ? (
                                        <p>No past periods recorded.</p>
                                    ) : (
                                        <ul className="past-periods-list overflow-y-auto h-full">
                                            {pastPeriods.map(
                                                (period, index) => (
                                                    <li
                                                        key={index}
                                                        className="mb-2">
                                                        <strong>Start:</strong>{" "}
                                                        {new Date(
                                                            period.start
                                                        ).toLocaleDateString()}
                                                        <br />
                                                        <strong>
                                                            End:
                                                        </strong>{" "}
                                                        {new Date(
                                                            period.end
                                                        ).toLocaleDateString()}
                                                        <hr />
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {prediction && (
                    <div
                        className="my-8 py-4 px-8 rounded-lg w-full md:w-1/3"
                        style={{ minHeight: "300px" }}>
                        <h2 className="text-3xl font-bold mb-4 text-center font-Comfortaa">
                            Menstrual Prediction for Next Cycle
                        </h2>

                        <div
                            className="chart-container"
                            style={{ height: "300px", width: "100%" }}>
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                    </div>
                )}
            </div>
            <Footer />
            {contextMenuPos.visible && (
                <div
                    className="custom-context-menu"
                    style={{ top: contextMenuPos.y, left: contextMenuPos.x }}>
                    {!isAnyPeriodOpen() ? (
                        <div
                            className="context-menu-option"
                            onClick={() =>
                                markMenstruationStart(contextMenuPos.day)
                            }>
                            Start Menstrual
                        </div>
                    ) : (
                        <div
                            className="context-menu-option"
                            onClick={() =>
                                markMenstruationEnd(contextMenuPos.day)
                            }>
                            End Menstrual
                        </div>
                    )}
                    {isAnyPeriodOpen() && (
                        <div
                            className="context-menu-option"
                            onClick={cancelMenstruationPeriod}>
                            Cancel Period
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CalendarMens;
