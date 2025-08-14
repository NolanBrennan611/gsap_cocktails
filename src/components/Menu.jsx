'use client';

import {allCocktails} from '../../constants/index.js'
import {useRef, useState} from 'react'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap';

const Menu = () => {
    const contentRef = useRef();
    const cocktailImageRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(null); // Track animation direction

    useGSAP(() => {
        gsap.fromTo('#title', {opacity: 0}, {opacity: 1, duration: 1});

        // Animate cocktail image based on direction
        if (direction === 'next') {
            // Coming from right (next cocktail)
            gsap.fromTo('.cocktail img',
                {opacity: 0, xPercent: 100},
                {xPercent: 0, opacity: 1, duration: 1, ease: 'power2.out'}
            );
        } else if (direction === 'prev') {
            // Coming from left (previous cocktail)
            gsap.fromTo('.cocktail img',
                {opacity: 0, xPercent: -100},
                {xPercent: 0, opacity: 1, duration: 1, ease: 'power2.out'}
            );
        } else {
            // Initial load or direct tab click - default animation
            gsap.fromTo('.cocktail img',
                {opacity: 0, scale: 0.8},
                {scale: 1, opacity: 1, duration: 1, ease: 'power2.out'}
            );
        }

        gsap.fromTo('.details h2', {yPercent: 100, opacity: 0}, {
            yPercent: 0, opacity: 100, ease: 'power1.inOut', delay: 0.2
        });
        gsap.fromTo('.details p', {yPercent: 100, opacity: 0}, {
            yPercent: 0, opacity: 100, ease: 'power1.inOut', delay: 0.3
        });
    }, [currentIndex, direction]);

    const totalCocktails = allCocktails.length;

    const goToSlide = (index, animationDirection = null) => {
        const newIndex = (index + totalCocktails) % totalCocktails;

        // Set direction for animation
        setDirection(animationDirection);
        setCurrentIndex(newIndex);
    }

    const goNext = () => {
        goToSlide(currentIndex + 1, 'next');
    }

    const goPrev = () => {
        goToSlide(currentIndex - 1, 'prev');
    }

    const goToTab = (index) => {
        // Determine direction based on tab position relative to current
        let animationDirection = null;
        if (index > currentIndex) {
            animationDirection = 'next';
        } else if (index < currentIndex) {
            animationDirection = 'prev';
        }

        goToSlide(index, animationDirection);
    }

    const getCocktailAt = (indexOffset) => {
        return allCocktails[(currentIndex + indexOffset + totalCocktails) % totalCocktails]
    }

    const currentCocktail = getCocktailAt(0);
    const prevCocktail = getCocktailAt(-1);
    const nextCocktail = getCocktailAt(1);

    return (
        <section id="menu" aria-labelledby="menu-heading">
            <img src="/images/slider-left-leaf.png" alt="left-leaf" id="m-left-leaf" />
            <img src="/images/slider-right-leaf.png" alt="right-leaf" id="m-right-leaf" />

            <h2 id="menu-heading" className="sr-only">
                Cocktail Menu
            </h2>

            <nav className="cocktail-tabs !bg-transparent" aria-label="Cocktail Navigation">
                {allCocktails.map((cocktail, index) => {
                    const isActive = index === currentIndex;

                    return (
                        <button
                            key={cocktail.id}
                            className={`
                                ${isActive
                                ? 'text-white border-white'
                                : 'text-white/50 border-white/50'}
                                !bg-transparent
                            `}
                            onClick={() => goToTab(index)}
                        >
                            {cocktail.name}
                        </button>
                    )
                })}
            </nav>

            <div className="content">
                <div className="arrows">
                    <button className="text-left" onClick={goPrev}>
                        <span>{prevCocktail.name}</span>
                        <img src="/images/left-arrow.png" alt="previous cocktail" aria-hidden="true" />
                    </button>

                    <button className="text-left" onClick={goNext}>
                        <span>{nextCocktail.name}</span>
                        <img src="/images/right-arrow.png" alt="next cocktail" aria-hidden="true" />
                    </button>
                </div>

                <div className="cocktail">
                    <img
                        ref={cocktailImageRef}
                        src={currentCocktail.image}
                        className="object-contain"
                        alt={currentCocktail.name}
                    />
                </div>

                <div className="recipe">
                    <div ref={contentRef} className="info">
                        <p>Recipe for:</p>
                        <p id="title">{currentCocktail.name}</p>
                    </div>

                    <div className="details">
                        <h2>{currentCocktail.title}</h2>
                        <p>{currentCocktail.description}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Menu
