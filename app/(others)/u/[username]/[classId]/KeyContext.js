import React, { createContext, useState, useContext, useEffect } from 'react';

const KeyContext = createContext();

export const useKey = () => {
    return useContext(KeyContext);
};

export const KeyProvider = ({ children }) => {
    const [uniqueKey, setUniqueKey] = useState('');
    const [prevKey, setPrevKey] = useState('');

    // Generate secure unique key
    const generateUniqueKey = () => {
        let timestamp = Date.now() - Date.now() % 100000;
        timestamp = timestamp / 100000;
        return `key_${timestamp}`;
    };
    // return `key_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
        const updateKey = () => {
            const newKey = generateUniqueKey();
            
            // Store current key as previous key
            const currentKey = localStorage.getItem('uniqueKey');
            if (currentKey) {
                setPrevKey(currentKey);
            }

            // Save new key in localStorage and state
            localStorage.setItem('uniqueKey', newKey);
            setUniqueKey(newKey);
        };

        updateKey();
        const intervalId = setInterval(updateKey, 30000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <KeyContext.Provider value={{ 
            uniqueKey, 
            prevKey, 
            setUniqueKey 
        }}>
            {children}
        </KeyContext.Provider>
    );
};