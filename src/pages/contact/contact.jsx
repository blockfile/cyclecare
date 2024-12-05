// src/pages/contact/Contact.js
import React from "react";
import "./contact.css"; // Optional for additional custom styling
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import user1 from "../../components/assets/images/user1.jpg"; // Assuming this image exists
import cycleLogo from "../../components/assets/images/cycle-logo.png"; // Replace with the correct path
// import user2 from "../../components/assets/images/user2.jpg";
// import user3 from "../../components/assets/images/user3.png";

function Contact() {
    return (
        <div className="relative bg-pink-100 object-cover h-full w-full overflow-x-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="container mx-auto p-8">
                {/* About Us Section */}
                <div className="flex flex-col md:flex-row items-center mb-16">
                    {/* Image */}
                    <div className="w-full md:w-1/2 mb-8 md:mb-0 mt-8 md:mt-0">
                        <img
                            src={cycleLogo}
                            alt="CycleCare Logo"
                            className="rounded-lg w-full max-w-sm mx-auto"
                        />
                    </div>

                    {/* Text */}
                    <div className="w-full md:w-1/2 text-center md:text-left px-4">
                        <h1 className="text-3xl md:text-4xl text-pink-400 font-SourGummy font-bold mb-4">
                            CYCLECARE: YOUR ONLINE MENSTRUAL TRACKER
                        </h1>
                        <p className="text-lg text-gray-600 font-SourGummy mb-6">
                            These applications provide features such as tracking
                            menstrual cycles,
                            <br />
                            identifying fertility windows, offering mood tracker
                            functionalities, and providing support tailored to
                            women's health and well-being.
                        </p>
                    </div>
                </div>

                {/* Contact Us Section */}
                <div>
                    <h2 className="text-4xl font-bold font-SourGummy text-center mb-12">
                        Contact Us
                    </h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {/* Contact Person 1 */}
                        <div className="flex flex-col items-center bg-pink-300 p-6 rounded-lg shadow-md w-72">
                            <img
                                src={user1}
                                alt="User 1"
                                className="w-25 h-25 object-cover rounded-full mb-4 aspect-square"
                            />
                            <h3 className="text-lg font-bold">
                                Perez Jr Renato
                            </h3>
                            <p className="text-sm text-gray-900">Dev</p>
                            <p className="text-sm text-gray-900">
                                +639161497989
                            </p>
                        </div>

                        {/* Contact Person 2 */}
                        <div className="flex flex-col items-center bg-pink-300 p-6 rounded-lg shadow-md w-72">
                            <img
                                src={user1}
                                alt="User 2"
                                className="w-25 h-25 object-cover rounded-full mb-4 aspect-square"
                            />
                            <h3 className="text-lg font-bold">Ramos Jenny</h3>
                            <p className="text-sm text-gray-900">
                                UI/UX Designer/Documentation
                            </p>
                            <p className="text-sm text-gray-900">
                                +639852849903
                            </p>
                        </div>

                        {/* Contact Person 3 */}
                        <div className="flex flex-col items-center bg-pink-300 p-6 rounded-lg shadow-md w-72">
                            <img
                                src={user1}
                                alt="User 3"
                                className="w-25 h-25 object-cover rounded-full mb-4 aspect-square"
                            />
                            <h3 className="text-lg font-bold">Bundoc Robec</h3>
                            <p className="text-sm text-gray-900">
                                Documentation/UI UX Designer
                            </p>
                            <p className="text-sm text-gray-900">
                                +639557331052
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default Contact;
