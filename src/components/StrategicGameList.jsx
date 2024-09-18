import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

import StrategicGameListItem from "./StrategicGameListItem";

import { API_STRATEGIC_URL } from "../constants/environment";

const StrategicGameList = () => {

    const debugMode = true;
    const navigate = useNavigate();
    const [games, setGames] = useState([]);

    const [displayError, setDisplayError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getGames = async () => {
        const url = `${API_STRATEGIC_URL}/strategic-games`;
        try {
            console.log("fetch url: " + url);
            const response = await fetch(url, { method: "GET", });
            console.log("response: " + response);
            const data = await response.json();
            setGames(data.content);
        } catch (error) {
            setDisplayError(true);
            setErrorMessage(`Error loading strategic games from ${url}. ${error.message}`);
        }
    };

    const createNewGame = async () => {
        navigate("/strategic/creation");
    };

    const handleSnackbarClose = () => {
        setDisplayError(false);
    };

    useEffect(() => {
        getGames();
    }, []);


    return (
        <div>
            <div class="tactical-game-list-actions">
                <Stack spacing={2} direction="row" sx={{
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                }}>
                    <Button variant="outlined" onClick={createNewGame}>New</Button>
                </Stack>
            </div>
            <div class="tactical-game-list">
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {games.map((item) => (
                        <StrategicGameListItem key={item.id} game={item} />
                    ))}
                </List>
            </div>
            <Snackbar
                open={displayError}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={handleSnackbarClose}
                message={errorMessage}
                action={
                    <React.Fragment>
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            sx={{ p: 0.5 }}
                            onClick={handleSnackbarClose}>
                            <CloseIcon />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </div>
    );
}

export default StrategicGameList;