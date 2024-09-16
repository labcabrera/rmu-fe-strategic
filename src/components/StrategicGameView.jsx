import React from "react";
import { useLocation, useParams } from "react-router-dom";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import StrategicGameViewActions from "./StrategicGameViewActions";


const StrategicGameView = () => {

    const debugMode = true;
    const { gameId } = useParams();
    const location = useLocation();
    const game = location.state?.game;

    return (
        <div class="tactical-game-view">

            <StrategicGameViewActions />

            <Box
                component="form"
                _sx={{ flexGrow: 1 }}
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            >
                <div>
                    <TextField
                        label="Name"
                        name="name"
                        value={game.name}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }} />
                </div>
                <div>
                    <TextField
                        label="Status"
                        name="status"
                        value={game.status}
                    ></TextField>
                </div>
                <div>
                    <TextField
                        label="Description"
                        name="description"
                        value={game.description}
                    ></TextField>
                </div>
                <div>
                    <TextField
                        label="User"
                        name="user"
                        value={game.user}
                    ></TextField>
                </div>
                <div>
                    <TextField
                        label="createdAt"
                        name="createdAt"
                        value={game.createdAt}
                    ></TextField>
                </div>
            </Box >
            {debugMode ? (
                <div>
                    <pre>
                        {JSON.stringify(game, null, 2)}
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
