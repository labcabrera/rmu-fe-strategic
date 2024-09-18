import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { API_STRATEGIC_URL } from "../constants/environment";

const StrategicGameViewActions = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const strategicGame = location.state?.strategicGame;

    const deleteStrategicGame = async () => {
        const url = `${API_STRATEGIC_URL}/strategic-games/${strategicGame.id}`;
        const response = await fetch(url, { method: "DELETE" });
        const deleteResponse = await response;
        if (deleteResponse.status == 204) {
            navigate("/strategic");
        } else {
            //TODO display error
            console.log("delete data: " + data);
        }
    };

    const handleEditClick = () => {
        navigate(`/strategic/edit/${strategicGame.id}`, { state: { strategicGame: strategicGame } });
    }

    const handleDeleteClick = () => {
        deleteStrategicGame();
    }

    return (
        <div class="strategic-game-view-actions">
            <Stack spacing={2} direction="row" sx={{
                justifyContent: "flex-end",
                alignItems: "flex-start",
            }}>
                <IconButton variant="outlined" onClick={handleEditClick}>
                    <EditIcon />
                </IconButton>
                <IconButton variant="outlined" onClick={handleDeleteClick}>
                    <DeleteIcon />
                </IconButton>
            </Stack>
        </div>
    );
}

export default StrategicGameViewActions;