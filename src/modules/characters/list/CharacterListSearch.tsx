import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Autocomplete, Grid, TextField } from '@mui/material';
import {
  ClearableTextField,
  Faction,
  fetchFactions,
  fetchStrategicGames,
  StrategicGame,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';
import { gridSizeCard } from '../../services/display';

interface CharacterListSearchFormData {
  name: string;
  gameId: string;
  factionId: string;
}

export default function CharacterListSearch({ setRsql }: { setRsql: Dispatch<SetStateAction<string>> }) {
  const auth = useAuth();
  const { t } = useTranslation();
  const { showError } = useError();
  const [formData, setFormData] = useState<CharacterListSearchFormData>({
    name: '',
    gameId: '',
    factionId: '',
  });
  const [games, setGames] = useState<StrategicGame[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);

  const append = (rsql: string, predicate: string) => {
    if (rsql === '') return predicate;
    return `${rsql};${predicate}`;
  };

  useEffect(() => {
    let rsql = '';
    if (formData.name) rsql = append(rsql, `name=re=${formData.name}`);
    if (formData.gameId) rsql = append(rsql, `gameId==${formData.gameId}`);
    if (formData.factionId) rsql = append(rsql, `factionId==${formData.factionId}`);
    setRsql(rsql);
  }, [formData, setRsql]);

  useEffect(() => {
    fetchStrategicGames('', 0, 100, auth)
      .then((response) => setGames(response.content))
      .catch((err) => showError(err.message));
    fetchFactions('', 0, 100, auth)
      .then((response) => setFactions(response.content))
      .catch((err) => showError(err.message));
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid size={gridSizeCard}>
        <ClearableTextField label={t('name')} onChange={(e) => setFormData({ ...formData, name: e || '' })} />
      </Grid>
      <Grid size={gridSizeCard}>
        <Autocomplete
          options={games}
          getOptionLabel={(option) => option?.name || ''}
          value={games.find((option) => option.id === formData.gameId) || null}
          onChange={(_, newValue) => setFormData({ ...formData, gameId: newValue?.id || '' })}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          fullWidth
          renderInput={(params) => <TextField {...params} label={t('strategic-game')} />}
          noOptionsText={t('no-options')}
        />
      </Grid>
      <Grid size={gridSizeCard}>
        <Autocomplete
          options={factions}
          getOptionLabel={(option) => option?.name || ''}
          value={factions.find((option) => option.id === formData.factionId) || null}
          onChange={(_, newValue) => setFormData({ ...formData, factionId: newValue?.id || '' })}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          fullWidth
          renderInput={(params) => <TextField {...params} label={t('faction')} />}
          noOptionsText={t('no-options')}
        />
      </Grid>
    </Grid>
  );
}
