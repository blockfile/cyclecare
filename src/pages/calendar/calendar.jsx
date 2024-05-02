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
function CalendarMens() {
    const [currentDate, setCurrentDate] = useState(new Date());
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
            nextEnd.setDate(nextEnd.getDate() + 5); // Assuming period lasts 5 days

            // Predicting ovulation 14 days before the start of the next period
            const ovulationDay = new Date(nextStart.getTime());
            ovulationDay.setDate(nextStart.getDate() - 14);

            // Extend ovulation prediction to cover the fertile window
            for (let j = -4; j <= 0; j++) {
                // 5 days window: 4 days before and the day of ovulation
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
        // Add new period with only start date set
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

        setContextMenuPos({ visible: false }); // Hide context menu
    };

    const markMenstruationEnd = async (day) => {
        const token = localStorage.getItem("token");
        const endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );

        // Find the period that is open and set its end date
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
                Authorization: `Bearer ${token}`, // ensure you handle authentication
            },
            body: JSON.stringify({ end: endDate }),
        });

        if (response.ok) {
            console.log("Period ended successfully");
        } else {
            console.error("Failed to end period");
        }

        setContextMenuPos({ visible: false }); // Hide context menu
    };

    const cancelMenstruationPeriod = () => {
        // Option 1: Remove the last open period
        setMenstruationPeriods((prevPeriods) =>
            prevPeriods.filter((period) => period.end !== null)
        );

        setMenstruationPeriods((prevPeriods) =>
            prevPeriods.map((period) => {
                if (!period.end) {
                    return { ...period, end: new Date(period.start) }; // Mark end as the same as start
                }
                return period;
            })
        );

        setContextMenuPos({ visible: false }); // Hide context menu
    };
    const predictNextPeriod = (date, cycleLength) => {
        const predictionStartDate = new Date(date.getTime());
        predictionStartDate.setDate(
            predictionStartDate.getDate() + cycleLength
        );
        const predictionEndDate = new Date(predictionStartDate.getTime());
        predictionEndDate.setDate(predictionEndDate.getDate() + 5); // Assuming a period lasts for 5 days
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
        checkDate.setHours(0, 0, 0, 0); // Normalize the date for comparison

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

    return (
        <div
            className="relative overflow-x-hidden"
            onClick={() => setContextMenuPos({ visible: false })}>
            <video
                autoPlay
                loop
                muted
                playsInline
                className="object-cover h-full w-full absolute z-0">
                <source src={bg} type="video/mp4" />
            </video>
            <Navbar />
            <div className="relative z-10 flex flex-col items-center h-full mt-14 mx-auto text-justify">
                <div className="my-24 bg-red-300 py-10 px-24 rounded-lg">
                    <div className=" bg-red-500 relative my-4 rounded-xl">
                        <div className=" flex space-x-3 mx-2 py-1 ">
                            <div className=" border rounded-full">
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
                                <p>{userData.username}</p>
                            </div>
                        </div>
                    </div>
                    <div className="calendar-container">
                        {hoverInfo.visible && (
                            <div
                                className="hover-info"
                                style={{
                                    position: "absolute",
                                    top: hoverInfo.position.y + 2, // 10 pixels below the cursor
                                    left: hoverInfo.position.x + 2, // 10 pixels right of the cursor
                                    padding: "10px",
                                    background: "white",
                                    border: "1px solid #ccc",
                                    zIndex: 1000,
                                }}>
                                {hoverInfo.content}
                            </div>
                        )}
                        <header className="calendar-header flex justify-between items-center">
                            <FaArrowLeft
                                onClick={goToPreviousMonth}
                                size={25}
                                className="cursor-pointer  hover:text-red-500"
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
