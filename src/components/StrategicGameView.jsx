import React from "react";
import { useLocation } from "react-router-dom";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import StrategicGameViewActions from "./StrategicGameViewActions";


const StrategicGameView = () => {

    const debugMode = false;
    const location = useLocation();
    const strategicGame = location.state?.strategicGame;

    return (
        <div class="strategic-game-view">
            <StrategicGameViewActions />
            <Box component="form"
                sx={{ '& > :not(style)': { m: 1, width: '80ch' } }}>

                <TextField
                    label="Name"
                    name="name"
                    value={strategicGame.name}
                    disabled
                    size="small" />
                <TextField
                    label="Realm"
                    name="realm"
                    value={strategicGame.realm}
                    disabled
                    size="small" />
                <TextField
                    label="Description"
                    name="description"
                    value={strategicGame.description}
                    disabled
                    size="small"
                    multiline
                    maxRows={4} />
                <TextField
                    label="User"
                    name="user"
                    value={strategicGame.user}
                    disabled
                    size="small"
                />
                <TextField
                    label="Created"
                    name="createdAt"
                    value={strategicGame.createdAt}
                    disabled
                    size="small"
                />
                <TextField
                    label="Updated"
                    name="createdAt"
                    value={strategicGame.updatedAt}
                    disabled
                    size="small"
                />
            </Box >
            {debugMode ? (
                <div>
                    <pre>
                        {JSON.stringify(strategicGame, null, 2)}
                    </pre>
                    <pre>
                        {JSON.stringify(location.state, null, 2)}
                    </pre>
                </div>
            ) : null}
        </div >
    );
}

export default StrategicGameView;
