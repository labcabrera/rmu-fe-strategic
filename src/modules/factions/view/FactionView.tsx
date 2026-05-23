import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Box, ToggleButton, ToggleButtonGroup, Grid } from '@mui/material';
import {
  CategorySeparator,
  RmuTextCard,
  AddButton,
  TechnicalInfo,
  fetchStrategicGame,
  StrategicGame,
  Character,
  Faction,
  fetchCharacters,
  fetchFaction,
  LayoutBase,
  DeleteDialog,
  deleteFaction,
  RefreshButton,
  EditButton,
  DeleteButton,
  Section,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';
import { gridSizeCard } from '../../services/display';
import FactionViewAttributes from './FactionViewAttributes';
import FactionViewCharactersTable from './FactionViewCharacterTable';
import FactionViewCharacters from './FactionViewCharacters';
import FactionViewResume from './FactionViewResume';

const STORAGE_KEY = 'faction-display-character-table';

export default function FactionView() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const { showError } = useError();

  const { factionId } = useParams<{ factionId: string }>();
  const [faction, setFaction] = useState<Faction>();
  const [game, setGame] = useState<StrategicGame>();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [displayCharacterTable, setDisplayCharacterTable] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  const bindFaction = (factionId: string) => {
    fetchFaction(factionId, auth)
      .then((data) => setFaction(data))
      .catch((err) => showError(err.message));
  };

  const onDelete = async () => {
    deleteFaction(faction!.id, auth)
      .then(() => navigate(`/strategic/games/view/${faction!.gameId}`))
      .catch((error) => showError(error.message));
  };

  const onEdit = () => {
    navigate(`/strategic/factions/edit/${faction!.id}`, { state: { faction, strategicGame: game } });
  };

  const handleViewModeChange = (_e: any, val: string | null) => {
    if (val === null) return;
    const table = val === 'table';
    setDisplayCharacterTable(table);
    try {
      localStorage.setItem(STORAGE_KEY, table ? 'true' : 'false');
    } catch (err) {}
  };

  const onCharacterCreate = () => {
    navigate(`/strategic/characters/create?gameId=${faction!.gameId}&factionId=${faction!.id}`, { state: { faction } });
  };

  useEffect(() => {
    if (faction) {
      fetchStrategicGame(faction.gameId, auth)
        .then((data: StrategicGame) => setGame(data))
        .catch((err) => showError(err.message));
      fetchCharacters(`faction.id==${faction.id}`, 0, 100, auth)
        .then((data) => setCharacters(data.content))
        .catch((err) => showError(err.message));
    }
  }, [faction]);

  useEffect(() => {
    if (location.state?.faction) {
      setFaction(location.state.faction);
    } else if (factionId) {
      bindFaction(factionId);
    }
  }, [location.state, factionId]);

  return (
    <LayoutBase
      breadcrumbs={[
        { name: t('home'), link: '/' },
        { name: t('strategic-module'), link: '/strategic' },
        { name: t('factions'), link: '/strategic/factions' },
        { name: t('view') },
      ]}
      actions={[
        <RefreshButton onClick={() => bindFaction(faction!.id)} />,
        <EditButton onClick={() => onEdit()} />,
        <DeleteButton onClick={() => setDeleteDialogOpen(true)} />,
      ]}
      leftPanel={<FactionViewResume faction={faction} setFaction={setFaction} game={game} />}
    >
      <Grid container spacing={1}>
        <Grid size={12}>
          <Section title={t('strategic-game')} elevation={0}>
            <Grid container spacing={1}>
              <Grid size={3}>
                <RmuTextCard
                  value={game?.name || ''}
                  subtitle={t('strategic-game')}
                  image={game?.imageUrl || ''}
                  onClick={() => navigate(`/strategic/games/view/${game?.id}`, { state: { strategicGame: game } })}
                />
              </Grid>
            </Grid>
          </Section>
        </Grid>
        <Grid size={12}>
          <Section title={t('information')} elevation={0}>
            <FactionViewAttributes faction={faction} characters={characters} />
          </Section>
        </Grid>
        <Grid size={12}>
          <Section
            title={t('characters')}
            elevation={0}
            actions={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <AddButton onClick={onCharacterCreate} />
                <ToggleButtonGroup
                  value={displayCharacterTable ? 'table' : 'list'}
                  exclusive
                  size="small"
                  onChange={handleViewModeChange}
                  aria-label="view-mode"
                >
                  <ToggleButton value="list" aria-label="list">
                    <ViewListIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="table" aria-label="table">
                    <TableRowsIcon fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            }
          >
            {displayCharacterTable ? (
              <FactionViewCharactersTable characters={characters} />
            ) : (
              <FactionViewCharacters faction={faction} characters={characters} />
            )}
          </Section>
        </Grid>
      </Grid>
      <DeleteDialog
        message={t('delete-confirmation')}
        onDelete={() => onDelete()}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      />
      <TechnicalInfo>
        <pre>Faction: {JSON.stringify(faction, null, 2)}</pre>
      </TechnicalInfo>
    </LayoutBase>
  );
}
