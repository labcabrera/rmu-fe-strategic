import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import {
  Character,
  CharacterSkill,
  NumericInput,
  OpenEndedRollInput,
  Section,
} from '@labcabrera-rmu/rmu-react-shared-lib';

type TradeAction = 'buy' | 'sell';

type SelectedSkill = {
  skillId: string;
  specialization: string | null;
};

const defaultTradeSkill: SelectedSkill = {
  skillId: 'trade',
  specialization: null,
};

const TradeManeuverForm: FC<{
  character?: Character;
  action: TradeAction;
}> = ({ character, action }) => {
  const { t } = useTranslation();
  const [selectedSkill, setSelectedSkill] = useState<SelectedSkill>(defaultTradeSkill);
  const [openEndedRoll, setOpenEndedRoll] = useState<number | null>(null);
  const [customModifier, setCustomModifier] = useState<number | null>(0);

  const characterSkills = useMemo(() => character?.skills || [], [character]);

  const characterSkill = useMemo(() => {
    return findCharacterSkill(character, selectedSkill);
  }, [character, selectedSkill]);

  const selectedSkillKey = characterSkill ? getCharacterSkillKey(characterSkill) : '';
  const maneuverTotal =
    openEndedRoll === null || !characterSkill
      ? null
      : openEndedRoll + characterSkill.totalBonus + (customModifier || 0);

  useEffect(() => {
    setSelectedSkill(defaultTradeSkill);
  }, [character?.id]);

  return (
    <Section title={t('maneuver')}>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={0.5}>
            <Typography variant="overline" color="text.secondary">
              {t('skill')}
            </Typography>
            {characterSkill ? (
              <>
                <Typography variant="body1">{formatCharacterSkill(characterSkill, t)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('bonus')}: {characterSkill.totalBonus}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="warning.main">
                {t('not-found-skill')}: {t(selectedSkill.skillId)}
              </Typography>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="trade-maneuver-skill-label">{t('skill')}</InputLabel>
            <Select
              labelId="trade-maneuver-skill-label"
              id="trade-maneuver-skill"
              value={selectedSkillKey}
              label={t('skill')}
              onChange={(event) => {
                const skill = characterSkills.find((item) => getCharacterSkillKey(item) === event.target.value);
                if (skill) {
                  setSelectedSkill({
                    skillId: skill.skillId,
                    specialization: skill.specialization || null,
                  });
                }
              }}
            >
              <MenuItem value="" disabled>
                {t('not-found-skill')}
              </MenuItem>
              {characterSkills.map((skill) => (
                <MenuItem key={getCharacterSkillKey(skill)} value={getCharacterSkillKey(skill)}>
                  {formatCharacterSkill(skill, t)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <NumericInput
            label={t('custom-modifier')}
            value={customModifier}
            onChange={setCustomModifier}
            integer
            allowNegatives
          />
        </Grid>
        {maneuverTotal !== null && (
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('total')}: {maneuverTotal}
            </Typography>
          </Grid>
        )}
        <Grid size={{ xs: 12, md: 3 }}>
          <OpenEndedRollInput gridColumns={12} inputGridSize={12} onChange={setOpenEndedRoll} />
        </Grid>
        <Grid size={12}>
          <Button variant="contained" disabled={!characterSkill || openEndedRoll === null}>
            {t(action)}
          </Button>
        </Grid>
      </Grid>
    </Section>
  );
};

function findCharacterSkill(
  character: Character | undefined,
  selectedSkill: SelectedSkill
): CharacterSkill | undefined {
  return character?.skills.find((skill) => {
    const sameSkill = skill.skillId === selectedSkill.skillId;
    const sameSpecialization = (skill.specialization || null) === selectedSkill.specialization;
    return sameSkill && sameSpecialization;
  });
}

function getCharacterSkillKey(skill: CharacterSkill) {
  return `${skill.skillId}::${skill.specialization || ''}`;
}

function formatCharacterSkill(skill: CharacterSkill, t: (key: string) => string) {
  const skillName = t(skill.skillId);
  return skill.specialization ? `${skillName}: ${t(skill.specialization)}` : skillName;
}

export default TradeManeuverForm;
