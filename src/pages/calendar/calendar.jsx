import React, { useState, useEffect } from "react";
import { MdBloodtype } from "react-icons/md";
import "./calendar.css";
import Navbar from "../../components/Navbar/Navbar";
import bg from "../../components/assets/videos/bg.mp4";
import Footer from "../../components/Footer/Footer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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

    const [lastMenstrualDate, setLastMenstrualDate] = useState(null);
    const [menstrualCycleLength, setMenstrualCycleLength] = useState(28);

    useEffect(() => {
        fetch("/api/menstrual-data")
            .then((response) => response.json())
            .then((data) => {
                if (data.startDate && data.endDate) {
                    setMenstruationPeriod({
                        start: new Date(data.startDate),
                        end: new Date(data.endDate),
                    });
                }
            })
            .catch((error) =>
                console.error("Error fetching menstrual data:", error)
            );
    }, []);

    const predictNextPeriod = (date, cycleLength) => {
        const predictionStartDate = new Date(date.getTime());
        predictionStartDate.setDate(
            predictionStartDate.getDate() + cycleLength
        );
        const predictionEndDate = new Date(predictionStartDate.getTime());
        predictionEndDate.setDate(predictionEndDate.getDate() + 5); // Assuming a period lasts for 5 days
        return { start: predictionStartDate, end: predictionEndDate };
    };

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

    const markMenstruationStart = () => {
        const startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            contextMenuPos.day
        );
        setMenstruationPeriod({
            ...menstruationPeriod,
            start: startDate,
            end: null, // Reset the end date whenever a new start is marked.
        });
        setContextMenuPos({ visible: false });
    };

    const markMenstruationEnd = () => {
        const endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            contextMenuPos.day
        );
        if (menstruationPeriod.start && endDate >= menstruationPeriod.start) {
            setMenstruationPeriod({
                ...menstruationPeriod,
                end: endDate,
            });
        }
        setContextMenuPos({ visible: false });
    };

    const cancelMenstruationPeriod = () => {
        setMenstruationPeriod({ start: null, end: null });
        setContextMenuPos({ visible: false });
    };

    const isMenstruationDay = (day) => {
        const { start, end } = menstruationPeriod;
        if (!start) return false; // If no start date is set, return false

        const checkDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );

        if (start && !end) {
            // Only mark the start day if no end date is provided
            return checkDate.getTime() === start.getTime();
        } else if (start && end) {
            // If end date is provided, mark all days between start and end, inclusive
            return checkDate >= start && checkDate <= end;
        }

        return false;
    };
    const renderDayCells = () => {
        const daysInMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        ).getDate();
        let cells = [];
        for (let day = 1; day <= daysInMonth; day++) {
            cells.push(
                <div
                    key={day}
                    className={`day ${isToday(day) ? "today" : ""} ${
                        isMenstruationDay(day) ? "menstruation" : ""
                    }`}
                    onContextMenu={(e) => handleRightClick(e, day)}>
                    {day}
                    {isMenstruationDay(day) && (
                        <MdBloodtype className=" text-red-700 z-0 absolute" />
                    )}
                </div>
            );
        }
        return cells;
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
                    <span>HELLO USER</span>
                    <div className="calendar-container">
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
                            {daysOfWeek.map((day) => (
                                <div key={day} className="day-of-week">
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
                    {menstruationPeriod.start && !menstruationPeriod.end ? (
                        <div
                            className="context-menu-option"
                            onClick={markMenstruationEnd}>
                            End Menstrual
                        </div>
                    ) : (
                        <div
                            className="context-menu-option"
                            onClick={markMenstruationStart}>
                            Start Menstrual
                        </div>
                    )}
                    {menstruationPeriod.start && (
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
