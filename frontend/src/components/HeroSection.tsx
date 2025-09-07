'use client';

import React, { useState, useEffect } from 'react';

const HeroSection: React.FC = () => {
   return (
        <section style={{ width: '100%', padding: '2rem 0', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to Our Shop!</h1>
            <p style={{ fontSize: '1.25rem', color: '#555' }}>
                Discover our exclusive collection and enjoy your shopping experience.
            </p>
        </section>
    );

  
};

export default HeroSection;