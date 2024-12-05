import React, { useState, useEffect } from "react";
import { MdBloodtype } from "react-icons/md";
import "./calendar.css";
import axios from "axios";
import { Avatar } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
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
    const [isLoading, setIsLoading] = useState(true);
    const [currentOvulation, setCurrentOvulation] = useState(null);
    const [nextPredictionOvulation, setNextPredictionOvulation] =
        useState(null);

    const [nextPeriodPrediction, setNextPeriodPrediction] = useState(null);
    const predictNextMenstruation = (periods) => {
        if (periods.length < 2) return null;

        periods.sort((a, b) => new Date(a.start) - new Date(b.start));

        // Calculate average cycle length
        const cycleDifferences = periods
            .map((_, index) => {
                if (index === 0) return null;
                const prevPeriod = periods[index - 1];
                const currentPeriod = periods[index];
                return (
                    (new Date(currentPeriod.start) -
                        new Date(prevPeriod.start)) /
                    (1000 * 60 * 60 * 24)
                );
            })
            .filter(Boolean);

        const averageCycleLength = Math.round(
            cycleDifferences.reduce((a, b) => a + b, 0) /
                cycleDifferences.length
        );

        const lastPeriod = periods[periods.length - 1];
        const lastPeriodStart = new Date(lastPeriod.start);

        // Calculate next period start date
        const nextPeriodStart = new Date(lastPeriodStart);
        nextPeriodStart.setDate(lastPeriodStart.getDate() + averageCycleLength);

        // Only return prediction if it's in the next month
        const today = new Date();
        const nextMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
        );

        if (nextPeriodStart <= nextMonth) {
            return {
                expectedDate: nextPeriodStart,
                cycleLength: averageCycleLength,
            };
        }

        return null;
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
                    const nextPeriod = predictNextMenstruation(
                        response.data.periods
                    );

                    if (nextPeriod) {
                        const ovulationInfo = calculateOvulation(
                            nextPeriod.expectedDate,
                            nextPeriod.cycleLength
                        );

                        setOvulationDays(ovulationInfo.fertileWindow);
                        setPrediction({
                            nextPeriod: nextPeriod.expectedDate,
                            ovulation: ovulationInfo.ovulationDate,
                            fertileWindow: ovulationInfo.fertileWindow,
                        });
                    }
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

    const calculateOvulation = (nextPeriod, cycleLength) => {
        if (!nextPeriod) return null;

        // Ovulation typically occurs 14 days before the next period
        const ovulationDate = new Date(nextPeriod);
        ovulationDate.setDate(ovulationDate.getDate() - 14);

        // Fertile window is typically 5 days before ovulation
        const fertileWindow = [];
        for (let i = -4; i <= 1; i++) {
            // Fertile window: 4 days before and 1 day after ovulation
            const fertileDay = new Date(ovulationDate);
            fertileDay.setDate(ovulationDate.getDate() + i);
            fertileWindow.push(fertileDay);
        }

        return {
            ovulationDate,
            fertileWindow,
        };
    };

    const calculateFutureOvulations = () => {
        let lastPeriodEnd = menstruationPeriod.end || new Date();
        const ovulations = [];

        for (let i = 0; i < 24; i++) {
            const ovulationDay = new Date(lastPeriodEnd.getTime());
            ovulationDay.setDate(
                lastPeriodEnd.getDate() + menstrualCycleLength - 14
            );

            // Fertile window is typically 5 days before ovulation
            for (let j = -4; j <= 0; j++) {
                const fertileDay = new Date(ovulationDay);
                fertileDay.setDate(ovulationDay.getDate() + j);
                ovulations.push(fertileDay);
            }

            // Move to the next cycle
            lastPeriodEnd.setDate(
                lastPeriodEnd.getDate() + menstrualCycleLength
            );
        }

        setOvulationDays(ovulations);
    };

    useEffect(() => {
        if (menstruationPeriod.end) {
            calculateFutureOvulations();
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

    useEffect(() => {
        const fetchOvulationData = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(
                    "http://localhost:3001/user/info",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data?.user) {
                    const {
                        currentOvulation,
                        nextPredictionOvulation,
                        periods,
                    } = response.data.user;

                    console.log("Fetched ovulation data:", response.data.user); // Debug logging

                    setCurrentOvulation(
                        currentOvulation ? new Date(currentOvulation) : null
                    );
                    setNextPredictionOvulation(
                        nextPredictionOvulation
                            ? new Date(nextPredictionOvulation)
                            : null
                    );
                    setMenstruationPeriods(
                        periods.map((period) => ({
                            start: new Date(period.start),
                            end: period.end ? new Date(period.end) : null,
                        }))
                    );
                }
            } catch (error) {
                console.error("Failed to fetch ovulation data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOvulationData();
    }, []); // Empty dependency array means this runs once on component mount.

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

        // Check if the date falls within the 5-day ovulation range
        return menstruationPeriods.some((period) => {
            if (!period.start) return false;

            const ovulationDate = new Date(period.start);
            ovulationDate.setDate(ovulationDate.getDate() + 14); // 14 days after the start of the period

            const startOvulation = new Date(ovulationDate);
            startOvulation.setDate(startOvulation.getDate() - 2); // 2 days before ovulation

            const endOvulation = new Date(ovulationDate);
            endOvulation.setDate(endOvulation.getDate() + 2); // 2 days after ovulation

            // Debugging logs

            return checkDate >= startOvulation && checkDate <= endOvulation;
        });
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

    useEffect(() => {
        const fetchNextPrediction = async () => {
            setIsLoading(true); // Start loading
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(
                    "http://localhost:3001/user/info",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.data?.user) {
                    const { nextPeriodPrediction, periods } =
                        response.data.user;

                    // Update periods and prediction states
                    setMenstruationPeriods(
                        periods.map((period) => ({
                            start: new Date(period.start),
                            end: new Date(period.end),
                        }))
                    );
                    setNextPeriodPrediction(new Date(nextPeriodPrediction));

                    console.log(
                        "Fetched nextPeriodPrediction:",
                        nextPeriodPrediction
                    ); // Debug log
                }
            } catch (error) {
                console.error("Error fetching prediction:", error);
            } finally {
                setIsLoading(false); // End loading
            }
        };

        fetchNextPrediction();
    }, []);

    const renderDayCells = () => {
        if (isLoading) {
            return <div>Loading...</div>; // Render a loading indicator
        }

        const daysInMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        ).getDate();

        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
            );

            // Check if the day is a predicted next period day
            const isNextPeriodDay =
                nextPeriodPrediction &&
                dayDate >= nextPeriodPrediction &&
                dayDate <
                    new Date(
                        nextPeriodPrediction.getTime() + 4 * 24 * 60 * 60 * 1000
                    );

            // Check if the day is an ovulation day
            const isOvulation = isOvulationDay(day);

            // Check if the day is a menstruation day
            const isMenstruationDay = menstruationPeriods.some((period) => {
                const start = new Date(period.start).setHours(0, 0, 0, 0);
                const end = new Date(period.end || new Date()).setHours(
                    23,
                    59,
                    59,
                    999
                );
                return dayDate >= start && dayDate <= end;
            });

            const handleMouseEnter = (event) => {
                if (isOvulation) {
                    setHoverInfo({
                        visible: true,
                        content: "High Chance of Pregnancy",
                        position: {
                            x: event.clientX + 10,
                            y: event.clientY + 10,
                        },
                    });
                } else if (isNextPeriodDay) {
                    setHoverInfo({
                        visible: true,
                        content: "Expected Start of Period",
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
                    className={`day ${
                        isMenstruationDay ? "menstruation" : ""
                    } ${isOvulation ? "ovulation" : ""} ${
                        isNextPeriodDay ? "next-period" : ""
                    }`}
                    style={{
                        backgroundColor: isMenstruationDay
                            ? "pink"
                            : isNextPeriodDay
                            ? "lightblue"
                            : isOvulation
                            ? "lightgreen"
                            : "transparent",
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onContextMenu={(event) => {
                        event.preventDefault(); // Disable default context menu
                        handleRightClick(event, day); // Trigger custom menu logic
                    }}>
                    {day}
                    {isMenstruationDay && (
                        <MdBloodtype className="text-red-700" />
                    )}
                    {isOvulation && (
                        <img
                            src={ovule}
                            alt="Ovulation"
                            style={{ width: "20px", height: "20px" }}
                        />
                    )}
                    {isNextPeriodDay && (
                        <div className="next-period-indicator">
                            {/* Add a custom indicator for next period */}
                        </div>
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
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(
                    "http://localhost:3001/user/info",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.data?.user) {
                    const { currentOvulation, nextPredictionOvulation } =
                        response.data.user;
                    setOvulationDays([
                        new Date(currentOvulation),
                        new Date(nextPredictionOvulation),
                    ]);
                }
            } catch (error) {
                console.error("Error fetching ovulation data:", error);
            }
        };
        fetchData();
    }, []);

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
            className="min-h-screen flex flex-col bg-pink-50 overflow-x-hidden"
            onClick={() => setContextMenuPos({ visible: false })}>
            <Navbar />
            {/* Main Content */}
            <div className="flex-grow relative z-10 flex flex-col items-center mt-14 mx-auto text-justify">
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
                            className={`bg-pink-100 py-4 px-8 rounded-lg h-[566px] font-Comfortaa transition-all duration-500 overflow-hidden ${
                                showHistory
                                    ? "w-1/3 mt-4 mb-4 opacity-100 "
                                    : "w-0 opacity-0"
                            }`}>
                            {showHistory && (
                                <>
                                    <div className="border-b-2 mb-2">
                                        <h2 className="text-xl font-bold mb-4">
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
            {/* Footer */}
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
