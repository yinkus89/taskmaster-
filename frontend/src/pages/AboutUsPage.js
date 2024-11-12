import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext'; // Import the ThemeContext

const AboutUsPage = () => {
    const { theme } = useContext(ThemeContext); // Access theme context for styling

    return (
        <div style={{ backgroundColor: theme.background, color: theme.color, padding: '20px' }}>
            <h1>About Us</h1>
            <p>
                Welcome to our application! We are a team of passionate developers
                working to build innovative and user-friendly solutions. Our goal is
                to provide the best experience for our users while making sure that
                our platform is intuitive and easy to use.
            </p>
            <h2>Our Mission</h2>
            <p>
                Our mission is to create software that solves real-world problems
                and makes people's lives easier. We aim to deliver high-quality
                products that are reliable, scalable, and secure.
            </p>
            <h2>Our Team</h2>
            <p>
                We are a diverse group of developers, designers, and project
                managers who work together to bring ideas to life. Our team is
                committed to continuous learning and growth, always seeking
                innovative ways to improve our products.
            </p>
        </div>
    );
};

export default AboutUsPage;
