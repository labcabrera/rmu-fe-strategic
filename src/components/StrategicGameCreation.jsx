import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const StrategicGameCreation = () => {
    const navigate = useNavigate();

    const debugMode = false;

    const [formData, setFormData] = useState({
        name: '',
        realm: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        };
        fetch("http://localhost:3003/v1/strategic-games", requestOptions)
            .then(response => response.json())
            .then(data => navigate("/strategic/view/" + data.id, { state: { game: data } }));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required />
                <TextField
                    label="Realm"
                    variant="outlined"
                    name="realm"
                    value={formData.realm}
                    onChange={handleChange}
                    fullWidth
                    margin="normal" />
                <TextField
                    label="Description"
                    variant="outlined"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    margin="normal" />
                <Button type="submit" variant="outlined" color="primary">
                    Create
                </Button>
            </form>
            {debugMode ? (
                <pre>
                    {JSON.stringify(formData, null, 2)}
                </pre>
            ) : null}
        </div>
    );
}

export default StrategicGameCreation;