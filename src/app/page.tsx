"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Image from "next/image";
import { useRef } from "react";
import HeroImage from "../../public/Images/LandingPage/HeroSection.png";

export default function Home() {
    const features = [
        {
            title: "Express Delivery",
            description: "Same-day delivery for urgent packages across the state",
            icon: "/assets/icons/fast-delivery.svg",
        },
        {
            title: "Secure Handling",
            description: "Your packages handled with utmost care and security",
            icon: "/assets/icons/secure.svg",
        },
        {
            title: "Live Tracking",
            description: "Real-time tracking of your shipments from pickup to delivery",
            icon: "/assets/icons/tracking.svg",
        },
    ];

    const trackingRef = useRef(null);

    return (
        <div className={`min-h-screen`}>
            <Header />

            <section className="relative  overflow-hidden flex justify-center items-center bg-white min-[1000px]:pt-28 pt-5 max-[1000px]:pb-5" style={{ marginTop: "5rem" }}>
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8 2xl:px-0">
                    <div className="flex items-center justify-center 2xl:gap-60 md:gap-40">
                        <div className="text-center lg:text-left max-[1000px]:w-full w-2/4 ">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 leading-tight flex flex-col" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                                Fast & Reliable <span className="text-[#1A1C3C]">Delivery Service</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0" style={{ marginBottom: "1rem" }}>
                                Delivering excellence across Texas with speed, security, and technology-driven solutions.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a href="#" className="bg-BtnColorLight px-8 py-4 rounded-lg hover:bg-BtnColorLight transition-all transform hover:-translate-y-1 duration-300 shadow-lg text-white">
                                    Get Started
                                </a>
                                <a href="#features" className="border border-BtnColorLight text-BtnColorLight px-8 py-4 rounded-lg hover:bg-BtnColorLight/5 transition-all transform hover:-translate-y-1 duration-300">
                                    Learn More
                                </a>
                            </div>
                        </div>
                        <div className="relative flex max-[1000px]:hidden items-center justify-center bg-BtnColorLight/50 rounded-full overflow-hidden top-3 w-fit px-6 xl:pt-10 md:pt-10">
                            <Image src={"/Images/LandingPage/HereSection1.png"} width={500} height={500} alt="Decorative Star" className="xl:w-[25vw] md:w-[25vw] xl:h-auto" priority />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-BtnColorLight  flex justify-center items-center ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-28 text-center">
                        <div className="p-6 bg-white rounded-2xl shadow-lg transform transition-transform duration-300 hover:-translate-y-2 ">
                            <h3 className="text-4xl font-bold text-BtnColorLight mb-2" style={{ marginBottom: "0.5rem" }}>
                                98%
                            </h3>
                            <p className="text-gray-600">On-Time Delivery</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-lg transform transition-transform duration-300 hover:-translate-y-2 border-t-4 border-BtnColorLight" style={{ marginBottom: "0.5rem" }}>
                            <h3 className="text-4xl font-bold text-BtnColorLight mb-2">500+</h3>
                            <p className="text-gray-600">Business Clients</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-lg transform transition-transform duration-300 hover:-translate-y-2 border-t-4 border-BtnColorLight" style={{ marginBottom: "0.5rem" }}>
                            <h3 className="text-4xl font-bold text-BtnColorLight mb-2">24/7</h3>
                            <p className="text-gray-600">Customer Support</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-lg transform transition-transform duration-300 hover:-translate-y-2 border-t-4 border-BtnColorLight" style={{ marginBottom: "0.5rem" }}>
                            <h3 className="text-4xl font-bold text-BtnColorLight mb-2">5K+</h3>
                            <p className="text-gray-600">Deliveries Daily</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-20 px-4 relative overflow-hidden flex justify-center items-center bg-white">
                <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-headingOrange/10 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-BtnColorLight/10 rounded-full blur-3xl opacity-30"></div>

                <div className="absolute top-10 left-10 w-16 h-16 animate-pulse">
                    <img src="/assets/icons/circle-shape.svg" alt="Decorative Circle" className="w-full h-full" />
                </div>
                <div className="absolute bottom-10 right-10 w-12 h-12 animate-bounce">
                    <img src="/assets/icons/star-shape.svg" alt="Decorative Star" className="w-full h-full" />
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="inline-block px-4 py-1 bg-BtnColorLight/10 rounded-full text-BtnColorLight font-medium text-sm mb-4" style={{ marginBottom: "0.5rem" }}>
                            Our Services
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ marginBottom: "0.5rem" }}>
                            Why Choose <span className="text-headingOrange">Lone Star</span> Express
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="relative bg-white  p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                                <div className={`absolute -right-3 -top-3 w-24 h-24 rounded-full opacity-50 z-0 ${index % 2 === 0 ? "bg-headingOrange/20" : "bg-BtnColorLight/20"}`}></div>
                                <div className="relative z-10">
                                    <div className={`w-16 h-16 ${index % 2 === 0 ? "bg-headingOrange/20" : "bg-BtnColorLight/20"} rounded-lg mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <img src={feature.icon} alt={feature.title} className="w-8 h-8" />
                                    </div>
                                    <h3 className={`text-xl font-semibold mb-3 ${index % 2 === 0 ? "text-headingOrange" : "text-BtnColorLight"}`} style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}>
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 ">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-50 px-4 relative overflow-hidden flex justify-center items-center">
                <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-headingOrange/10 rounded-full blur-3xl opacity-30 transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-BtnColorLight/10 rounded-full blur-3xl opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>

                <div className="absolute top-10 right-10 w-14 h-14">
                    <img src="/assets/icons/square-shape.svg" alt="Decorative Square" className="w-full h-full animate-pulse" />
                </div>
                <div className="absolute bottom-32 left-20 w-20 h-20">
                    <img src="/assets/icons/star-shape.svg" alt="Decorative Star" className="w-full h-full rotate-12" />
                </div>

                <div className="absolute bottom-0 left-0 w-full">
                    <img src="/assets/icons/wave-shape.svg" alt="Decorative Wave" className="w-full h-16 opacity-30" />
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="inline-block px-4 py-1 bg-headingOrange/10 rounded-full text-headingOrange font-medium text-sm mb-4" style={{ marginBottom: "0.5rem" }}>
                            Simple Process
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ marginBottom: "1rem" }}>
                            How Our <span className="text-BtnColorLight">Delivery Works</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8 relative flex justify-center items-center">
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-headingOrange/30 to-BtnColorLight/30 -z-0 transform -translate-y-1/2 rounded-full"></div>

                        {["Request", "Pickup", "Transport", "Delivery"].map((step, idx) => (
                            <div key={step} className="relative bg-white p-8 rounded-xl shadow-lg text-center z-10 border-b-4 border-headingOrange group hover:-translate-y-2 transition-transform duration-300" style={{ marginBottom: "0.5rem" }}>
                                <div className={`w-14 h-14 ${idx % 2 === 0 ? "bg-headingOrange" : "bg-BtnColorLight"} text-white rounded-full mx-auto mb-6 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300`}>{idx + 1}</div>
                                <h3 className={`text-xl font-semibold mb-3 ${idx % 2 === 0 ? "text-headingOrange" : "text-BtnColorLight"}`} style={{ marginBottom: "0.5rem" }}>
                                    {step}
                                </h3>
                                <p className="text-gray-600 ">
                                    {idx === 0 && "Submit your delivery request through our app or website"}
                                    {idx === 1 && "Our courier will pick up your package at the specified time"}
                                    {idx === 2 && "We transport your package with care and security"}
                                    {idx === 3 && "Your package is delivered on time to the destination"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 relative overflow-hidden flex justify-center items-center">
                <div className="absolute top-1/4 left-0 -z-10 w-64 h-64 bg-headingOrange/10 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute bottom-1/4 right-0 -z-10 w-64 h-64 bg-BtnColorLight/10 rounded-full blur-3xl opacity-70"></div>

                <div className="absolute top-10 right-1/4 w-16 h-16">
                    <img src="/assets/icons/circle-shape.svg" alt="Decorative Circle" className="w-full h-full" />
                </div>
                <div className="absolute bottom-20 left-1/4 w-14 h-14 animate-bounce" style={{ animationDuration: "3s" }}>
                    <img src="/assets/icons/star-shape.svg" alt="Decorative Star" className="w-full h-full" />
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="inline-block px-4 py-1 bg-BtnColorLight/10 rounded-full text-BtnColorLight font-medium text-sm mb-4" style={{ marginBottom: "0.5rem" }}>
                            Testimonials
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ marginBottom: "1rem" }}>
                            What Our <span className="text-headingOrange">Clients Say</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Johnson",
                                position: "CEO, TechStart Inc.",
                                quote: "Lone Star Express has been instrumental in our business growth. Their reliable delivery service ensures our products reach customers on time, every time.",
                            },
                            {
                                name: "Michael Rodriguez",
                                position: "Operations Manager, HealthPlus",
                                quote: "For time-sensitive medical deliveries, we trust only Lone Star Express. Their dedicated team understands the urgency and handles everything professionally.",
                            },
                            {
                                name: "Emily Chen",
                                position: "Director, Retail Solutions",
                                quote: "The tracking capabilities and friendly service set Lone Star apart from other couriers. We've significantly reduced delivery issues since switching.",
                            },
                        ].map((testimonial, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-xl shadow-lg relative group hover:-translate-y-2 transition-transform duration-300">
                                <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 ${idx % 2 === 0 ? "bg-headingOrange/10" : "bg-BtnColorLight/10"} rounded-full opacity-50 z-0 group-hover:scale-110 transition-transform duration-300`}></div>
                                <div className="relative z-10">
                                    <svg className={`h-12 w-12 ${idx % 2 === 0 ? "text-headingOrange/20" : "text-BtnColorLight/20"} mb-4`} fill="currentColor" viewBox="0 0 32 32">
                                        <path
                                            d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"
                                            style={{ marginBottom: "0.5rem" }}
                                        />
                                    </svg>
                                    <p className="text-gray-600 mb-6 italic" style={{ marginBottom: "0.5rem" }}>
                                        "{testimonial.quote}"
                                    </p>
                                    <div className="flex items-center">
                                        <div className={`w-12 h-12 ${idx % 2 === 0 ? "bg-headingOrange/20" : "bg-BtnColorLight/20"} rounded-full mr-4 flex items-center justify-center`} style={{ marginRight: "0.5rem" }}>
                                            <span className={`text-xl font-bold ${idx % 2 === 0 ? "text-headingOrange" : "text-BtnColorLight"}`}>{testimonial.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold ${idx % 2 === 0 ? "text-headingOrange" : "text-BtnColorLight"}`} style={{ marginBottom: "0.5rem" }}>
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-gray-500 text-sm">{testimonial.position}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tracker... */}
            <section className="w-full gap-3 h-[400px] bg-no-repeat bg-cover bg-fixed bg-[#D8788C] flex items-center justify-center flex-col mt-[100px]" style={{ backgroundImage: "url('/assets/images/image.png')" }} ref={trackingRef}>
                <h1 className="text-white font-bold text-4xl">TRACK YOUR SHIPMENT</h1>
                <p className="text-white text-center">
                    Track your shipment in real-time with ease. Enter your tracking ID to view updates on your package's journey, <br /> estimated delivery time, and current location.
                </p>
                <div className="border-[5px] border-RoseRed flex w-2/4 m-[20px] rounded-[50px]">
                    <input
                        type="text"
                        value={"trackID"}
                        // onChange={(e) => {
                        //     handleTrackParcel(e.target.value);
                        //     setTrackID(e.target.value);
                        // }}
                        onChange={(e) => {
                            console.log("object");
                        }}
                        placeholder="Tracking ID #"
                        className="w-[100%] p-[10px] bg-white outline-0 rounded-[50px] text-black pl-[20px] text-[22px]"
                        maxLength={50}
                    />
                </div>
            </section>

            <section className="py-20 px-4 relative overflow-hidden flex justify-center items-center">
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-headingOrange/5 to-BtnColorLight/5 opacity-80"></div>
                <div className="absolute top-0 left-0 -z-10 w-64 h-64 bg-headingOrange/10 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute bottom-0 right-0 -z-10 w-64 h-64 bg-BtnColorLight/10 rounded-full blur-3xl opacity-70"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6" style={{ marginBottom: "1rem" }}>
                        Ready to experience the <span className="text-headingOrange">best courier service</span> in Texas?
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#" className="bg-headingOrange text-white px-8 py-4 rounded-lg hover:bg-[#d14c34] transition-all duration-300 shadow-lg transform hover:-translate-y-1">
                            Get Started Today
                        </a>
                        <a href="#" className="border border-BtnColorLight text-BtnColorLight px-8 py-4 rounded-lg hover:bg-BtnColorLight/5 transition-all duration-300 transform hover:-translate-y-1">
                            Contact Sales
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
