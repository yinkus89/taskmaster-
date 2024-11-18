import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const AboutUsPage = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <div style={{
            backgroundColor: theme.background,
            color: theme.color,
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.6',
        }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>About Us</h1>
            <p style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'justify' }}>
                <strong>Taskmaster</strong> is a modern task management application designed to help individuals
                and teams achieve their goals effortlessly. With a user-friendly interface and powerful features,
                Taskmaster enables you to:
            </p>
            <ul style={{ maxWidth: '800px', margin: '20px auto', textAlign: 'left', paddingLeft: '20px' }}>
                <li>Organize your tasks efficiently.</li>
                <li>Prioritize what matters most.</li>
                <li>Track progress seamlessly.</li>
            </ul>
            <h2 style={{ textAlign: 'center', margin: '40px 0 20px' }}>Our Mission</h2>
            <p style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'justify' }}>
                At Taskmaster, our mission is to simplify task management for everyone. We strive to build tools
                that solve real-world problems, enhance productivity, and bring clarity to your workflow.
            </p>
            <h2 style={{ textAlign: 'center', margin: '40px 0 20px' }}>Why Choose Taskmaster?</h2>
            <p style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'justify' }}>
                Whether you’re managing personal tasks or collaborating with a team, Taskmaster adapts to your needs.
                By staying focused on what matters most, you can transform plans into achievements with ease.
            </p>
        </div>
    );
};

export default AboutUsPage;
