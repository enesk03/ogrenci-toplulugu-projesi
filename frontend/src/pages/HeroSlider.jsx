import React, { useState, useEffect } from "react";
import "./HeroSlider.css"; 

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop",
            title: "Geleceği Birlikte Kodluyoruz",
            description: "Konya Teknik Üniversitesi'nin en aktif teknoloji topluluğuna hoş geldin.",
            buttonText: "Bize Katıl"
        },
        {
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1920&auto=format&fit=crop",
            title: "Etkinlikler ve Workshoplar",
            description: "Yazılım, siber güvenlik ve yapay zeka alanında kendini geliştir.",
            buttonText: "Etkinlikleri Gör"
        },
        {
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop",
            title: "Büyük Bir Aile",
            description: "Yüzlerce öğrenciyle network yap, projelerde yer al.",
            buttonText: "İletişime Geç"
        }
    ];

    const length = slides.length;

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            nextSlide();
        }, 5000);
        return () => clearTimeout(timer);
    }, [current]);

    if (!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }

    return (
        <section className="hero-slider">
            <div className="arrow arrow-left" onClick={prevSlide}>&#10094;</div>
            <div className="arrow arrow-right" onClick={nextSlide}>&#10095;</div>

            {slides.map((slide, index) => {
                return (
                    <div className={index === current ? "slide active" : "slide"} key={index}>
                        {index === current && (
                            <>
                                <img src={slide.image} alt="Slider Resim" />
                                <div className="slide-content">
                                    <h1>{slide.title}</h1>
                                    <p>{slide.description}</p>
                                    <button className="slider-btn">{slide.buttonText}</button>
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