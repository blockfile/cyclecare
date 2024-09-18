import React, { useState, useEffect, useRef } from "react";
import { MdNotifications } from "react-icons/md";

const PeriodNotification = ({ cycleData }) => {
    const [notificationMessage, setNotificationMessage] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const notificationRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
    const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (event) => {
        if (!dragging) return;

        // Calculate new position
        const dx = event.clientX - initialMousePos.x;
        const dy = event.clientY - initialMousePos.y;

        setPosition({
            x: initialPos.x + dx,
            y: initialPos.y + dy,
        });
    };

    const handleMouseDown = (event) => {
        setDragging(true);
        setInitialMousePos({ x: event.clientX, y: event.clientY });
        setInitialPos(position);
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    // Add event listeners for mousemove and mouseup
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, initialMousePos, initialPos]);

    useEffect(() => {
        console.log("Cycle Data:", cycleData); // Log the cycle data for debugging
        if (!cycleData || !cycleData.periods || cycleData.periods.length === 0)
            return;

        // Sort periods by start date in descending order and use the latest period
        const latestPeriod = cycleData.periods.sort(
            (a, b) => new Date(b.start) - new Date(a.start)
        )[0];

        const today = new Date();
        const startDate = new Date(latestPeriod.start); // Use the latest start date
        const endDate = new Date(latestPeriod.end); // Use the latest end date

        // Handle invalid cycle data
        if (startDate > endDate) {
            console.error("Invalid cycle data: start date is after end date.");
            setNotificationMessage(
                "There is an error with your cycle data. Please contact support."
            );
            return;
        }

        // Update notification based on the latest period
        if (today >= startDate && today <= endDate) {
            setNotificationMessage(
                `Your period is currently ongoing and will end on ${endDate.toLocaleDateString()}`
            );
        } else if (today < startDate) {
            setNotificationMessage(
                `Your next period is expected to start on ${startDate.toLocaleDateString()}`
            );
        } else {
            setNotificationMessage(""); // No message if no relevant data
        }
    }, [cycleData]);

    if (!notificationMessage) return null; // Don't show notification if there's no message

    return (
        <div
            ref={notificationRef}
            className="fixed p-2 bg-pink-500 text-white rounded-full shadow-lg cursor-pointer hover:bg-pink-600 transition duration-300"
            onMouseDown={handleMouseDown}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                bottom: "1rem", // Keeps it initially positioned at bottom right
                right: "1rem",
                zIndex: 9999, // Ensure notification is on top of all other elements
                position: "absolute", // Make sure it's positioned relative to the page for dragging
            }}>
            {isExpanded ? (
                <div
                    className="bg-pink-500 text-white p-4 rounded-lg shadow-lg"
                    onClick={() => setIsExpanded(false)}>
                    {notificationMessage}
                </div>
            ) : (
                <MdNotifications
                    size={24}
                    onClick={() => setIsExpanded(true)}
                />
            )}
        </div>
    );
};

export default PeriodNotification;
