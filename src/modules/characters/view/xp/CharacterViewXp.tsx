import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Badge, Box, Divider, Grid, Stack, Typography } from '@mui/material';
import {
  AddButton,
  NumericInput,
  RmuDialog,
  RmuTextCard,
  addCharacterXP,
  Character,
  StrategicGame,
  Section,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../../ErrorContext';
import { imageBaseUrl } from '../../../services/config';

const grayscale = 0.7;
const gridSizeCard = { xs: 10, sm: 5, md: 5, lg: 3, xl: 2 } as const;

const CharacterViewExperience: FC<{
  character: Character;
  strategicGame: StrategicGame;
  setCharacter: Dispatch<SetStateAction<Character | undefined>>;
}> = ({ character, strategicGame, setCharacter }) => {
  const { showError } = useError();
  const { t } = useTranslation();
  const auth = useAuth();
  const [openAddXpDialog, setOpenAddXpDialog] = useState(false);
  const [baseXp, setBaseXp] = useState<number>();
  const [error, setError] = useState<boolean>(false);
  const experienceMultiplier = strategicGame.options?.experienceMultiplier || 1;
  const totalXp = Math.max(0, Math.round((baseXp || 0) * experienceMultiplier));

  if (!character) return <div>Loading...</div>;

  function handleClose() {
    setOpenAddXpDialog(false);
    setBaseXp(undefined);
    setError(false);
  }

  function handleAdd() {
    if (!baseXp || baseXp < 1 || totalXp < 1) {
      setError(true);
      return;
    }
    addCharacterXP(character.id, totalXp, auth)
      .then((response) => {
        setCharacter(response);
        handleClose();
      })
      .catch((err) => showError(err.message));
  }

  return (
    <>
      <Section title={t('experience')} actions={<AddButton onClick={() => setOpenAddXpDialog(true)} />}>
        <Grid container spacing={1} columns={10}>
          <Grid size={gridSizeCard}>
            <RmuTextCard
              value={character.experience.availableLevel}
              subtitle={t('level')}
              image={`${imageBaseUrl}images/generic/experience.png`}
              grayscale={grayscale}
            />
          </Grid>
          <Grid size={gridSizeCard}>
            <Badge
              color="success"
              badgeContent={`+${character.experience.availableLevel - character.experience.level}`}
              invisible={character.experience.availableLevel <= character.experience.level}
              sx={{ display: 'block' }}
            >
              <RmuTextCard
                value={character.experience.level}
                subtitle={t('current-level')}
                image={`${imageBaseUrl}images/generic/experience.png`}
                grayscale={grayscale}
              />
            </Badge>
          </Grid>
          <Grid size={gridSizeCard}>
            <RmuTextCard
              value={new Intl.NumberFormat('en-US').format(character.experience.xp)}
              subtitle={t('xp')}
              image={`${imageBaseUrl}images/generic/experience.png`}
              grayscale={grayscale}
            />
          </Grid>
          <Grid size={gridSizeCard}>
            <Badge
              color="success"
              badgeContent={`+${character.experience.availableDevPoints}`}
              invisible={character.experience.availableDevPoints < 1}
              sx={{ display: 'block' }}
            >
              <RmuTextCard
                value={`${character.experience.availableDevPoints} / ${character.experience.devPoints}`}
                subtitle={t('dev-points')}
                image={`${imageBaseUrl}images/generic/trait-combat.png`}
                grayscale={grayscale}
              />
            </Badge>
          </Grid>
        </Grid>
      </Section>
      <RmuDialog
        open={openAddXpDialog}
        title={t('add-xp')}
        subtitle={`${t('experience-multiplier')}: x${experienceMultiplier}`}
        onCancel={handleClose}
        onConfirm={handleAdd}
        onConfirmDisabled={!baseXp || baseXp < 1 || totalXp < 1}
      >
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Personal events award experience when the character fulfills a personal desire or learns from a meaningful
            failure. Use the base award and the game multiplier to calculate the final XP.
          </Typography>
          <Stack spacing={0.5}>
            <Typography variant="body2">
              <strong>Minor Personal Event:</strong> 10-100 EP
            </Typography>
            <Typography variant="body2">
              <strong>Moderate Personal Event:</strong> 100-500 EP
            </Typography>
            <Typography variant="body2">
              <strong>Major Personal Event:</strong> 500-1000 EP
            </Typography>
          </Stack>
          <Divider />
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
          >
            <Box sx={{ width: { xs: '100%', sm: 180 } }}>
              <NumericInput
                value={baseXp || null}
                onChange={(v) => {
                  setBaseXp(v || undefined);
                  if (v && v > 0) setError(false);
                }}
                integer
                min={1}
                label={t('xp')}
                error={error}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              x {experienceMultiplier}
            </Typography>
            <Typography variant="h6">{new Intl.NumberFormat('en-US').format(totalXp)} XP</Typography>
          </Stack>
          {error && (
            <Typography variant="body2" color="error">
              Enter a base experience value greater than zero.
            </Typography>
          )}
        </Stack>
      </RmuDialog>
    </>
  );
};

export default CharacterViewExperience;
