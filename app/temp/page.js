"use client";
// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://htnm-api.rishav.co.in/api';
const LOGIN_API = `${BASE_URL}/auth/login`;
const CATEGORY_API = `${BASE_URL}/menu/category`;

function App() {
    const [token, setToken] = useState('');
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [level, setLevel] = useState(0);

    useEffect(() => {
        // Login on mount
        async function login() {
            try {
                const response = await axios.post(LOGIN_API, {
                    phoneNo: '918210925188',
                    password: '123456',
                });
                setToken(response.data.token);
                fetchCategories(response.data.token); // Fetch categories after login
            } catch (error) {
                console.error('Login failed', error);
            }
        }
        login();
    }, []);

    const fetchCategories = async (authToken) => {
        try {
            const response = await axios.get(CATEGORY_API, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setCategories(response.data.data);
            setLevel(response.data.data[0].screenLable.length);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const fetchSubcategories = async (id) => {
        console.log(id)
        try {
            let state = []
            for (let i = 0; i < level.length; i++) {
                if(i> 0){
                    id = state[i - 1].element[0]._id;
                }
                const response = await axios.get(`${CATEGORY_API}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response);
                let subcategories = response.data.data;

                state.push({
                    _id: id,
                    element: subcategories
                })
                
            }
            setSubcategories(state);
        } catch (error) {
            console.error('Failed to fetch subcategories', error);
        }

    };

    const handleCardClick = (id) => {
        fetchSubcategories(id);
    };

    return (
        <div className="App" style={{ padding: '20px' }}>
            <h1>Category Viewer</h1>
            {/* Render Categories */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {categories.map((category) => (
                    <div
                        key={category._id}
                        onClick={() => handleCardClick(category._id)}
                        style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            width: '200px',
                            cursor: 'pointer',
                        }}
                    >
                        <img
                            src={category.image}
                            alt={category.title}
                            style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                        />
                        <h3>{category.title}</h3>
                    </div>
                ))}
            </div>

            {/* Render Subcategories */}
            {subcategories.length > 0 && (
                <>
                    {subcategories.map((sub) => (
                        <div key={sub[0]._id} style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {sub.element.map((subcategory) => (
                                <div
                                    key={subcategory._id}
                                    onClick={() => handleCardClick(subcategory._id)}
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        width: '200px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img
                                        src={subcategory.image}
                                        alt={subcategory.title}
                                        style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                                    />
                                    <h3>{subcategory.title}</h3>
                                </div>
                            ))}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default App;
