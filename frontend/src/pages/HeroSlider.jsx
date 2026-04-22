import React, { useState, useEffect } from "react";
import api from "../api/axios"; 
import "./HeroSlider.css";

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/sliders")
            .then((res) => {
                const data = res.data.data ? res.data.data : res.data;
                setSlides(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Slider verileri yüklenemedi:", err);
                setLoading(false);
            });
    }, []);

    const length = slides.length;

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };

    useEffect(() => {
        if (length === 0) return; 

        const timer = setTimeout(() => {
            nextSlide();
        }, 5000);
        return () => clearTimeout(timer);
    }, [current, length]);

    if (loading) return null; 
    if (length <= 0) return null;

    return (
        <section className="hero-slider">
            <div className="arrow arrow-left" onClick={prevSlide}>&#10094;</div>
            <div className="arrow arrow-right" onClick={nextSlide}>&#10095;</div>

            {slides.map((slide, index) => {
                return (
                    <div className={index === current ? "slide active" : "slide"} key={index}>
                        {index === current && (
                            <>
                                <img src={slide.image || slide.imageUrl} alt="Slider" />
                                <div className="slide-content">
                                    <h1>{slide.title}</h1>
                                    <p>{slide.description}</p>
                                    <button className="slider-btn">{slide.buttonText || "Detaylar"}</button>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </section>
    );
};

export default HeroSlider;