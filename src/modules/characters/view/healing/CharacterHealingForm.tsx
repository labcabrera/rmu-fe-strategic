import React, { FC, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Character, NumericInput } from '@labcabrera-rmu/rmu-react-shared-lib';

type InjuryType = 'bone' | 'cutsBurns' | 'muscleTendon' | 'organ' | 'poisonDisease' | 'skinTissue';
type HealingType = 'none' | 'medicineSuccess' | 'medicineAbsoluteSuccess' | 'magicOrHerbalismSuccess' | 'magicAndHerbalismSuccess';

const injuryColumns: { key: InjuryType; label: string }[] = [
  { key: 'bone', label: 'Bone' },
  { key: 'cutsBurns', label: 'Cuts & Burns' },
  { key: 'muscleTendon', label: 'Muscle/Tendon' },
  { key: 'organ', label: 'Organ' },
  { key: 'poisonDisease', label: 'Poison/Disease' },
  { key: 'skinTissue', label: 'Skin/Tissue' },
];

const recoveryRows: { roll: string; values: Record<InjuryType, number> }[] = [
  { roll: '< 0', values: { bone: 10, cutsBurns: 12, muscleTendon: 15, organ: 20, poisonDisease: 25, skinTissue: 5 } },
  { roll: '1 - 50', values: { bone: 8, cutsBurns: 10, muscleTendon: 12, organ: 16, poisonDisease: 20, skinTissue: 4 } },
  { roll: '51 - 75', values: { bone: 6, cutsBurns: 8, muscleTendon: 9, organ: 12, poisonDisease: 15, skinTissue: 3 } },
  { roll: '76 - 99', values: { bone: 4, cutsBurns: 6, muscleTendon: 7, organ: 8, poisonDisease: 10, skinTissue: 2 } },
  { roll: '100-125', values: { bone: 3, cutsBurns: 4, muscleTendon: 5, organ: 6, poisonDisease: 8, skinTissue: 2 } },
  { roll: '126-175', values: { bone: 2, cutsBurns: 2, muscleTendon: 3, organ: 4, poisonDisease: 5, skinTissue: 1 } },
  { roll: '176+', values: { bone: 1, cutsBurns: 1, muscleTendon: 1, organ: 2, poisonDisease: 3, skinTissue: 1 } },
];

const severityRows = [
  { injuryPenalty: '-1 to -20', bleeding: '1-3/rd', severity: 'Light' },
  { injuryPenalty: '-21 to -40', bleeding: '4-6/rd', severity: 'Medium' },
  { injuryPenalty: '< -40', bleeding: '7+/rd', severity: 'Severe' },
];

const healingTypes: { key: HealingType; label: string; modifier: number }[] = [
  { key: 'none', label: 'None', modifier: -100 },
  { key: 'medicineSuccess', label: 'Medicine Success', modifier: 0 },
  { key: 'medicineAbsoluteSuccess', label: 'Medicine Absolute Success', modifier: 25 },
  { key: 'magicOrHerbalismSuccess', label: 'Magic or Herbalism Success', modifier: 50 },
  { key: 'magicAndHerbalismSuccess', label: 'Magic and Herbalism Success', modifier: 75 },
];

const CharacterHealingForm: FC<{ character: Character }> = ({ character }) => {
  const [injuryPenalty, setInjuryPenalty] = useState<number>(0);
  const [healingType, setHealingType] = useState<HealingType>('none');

  const bodyDevelopmentRanks = useMemo(
    () => character.skills.find(skill => skill.skillId === 'body-development')?.ranks || 0,
    [character.skills],
  );
  const constitutionBonus = character.statistics.co?.totalBonus || 0;
  const healingModifier = healingTypes.find(type => type.key === healingType)?.modifier || 0;
  const recoveryModifier = bodyDevelopmentRanks + constitutionBonus + healingModifier - injuryPenalty;

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Recovery roll: d100OE + Body Development ranks + Constitution bonus + type of healing - injury penalty.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="injuries and recovery table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Roll</TableCell>
                  {injuryColumns.map(column => (
                    <TableCell key={column.key} align="right" sx={{ fontWeight: 700 }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {recoveryRows.map(row => (
                  <TableRow key={row.roll}>
                    <TableCell component="th" scope="row">
                      {row.roll}
                    </TableCell>
                    {injuryColumns.map(column => (
                      <TableCell key={column.key} align="right">
                        {row.values[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ fontWeight: 700 }}>
                    Medium injuries x5
                  </TableCell>
                  <TableCell colSpan={3} align="center" sx={{ fontWeight: 700 }}>
                    Severe injuries x10
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="injury severity table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Injury Penalty</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Bleeding</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {severityRows.map(row => (
                    <TableRow key={row.severity}>
                      <TableCell>{row.injuryPenalty}</TableCell>
                      <TableCell>{row.bleeding}</TableCell>
                      <TableCell>{row.severity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TableContainer component={Paper}>
              <Table size="small" aria-label="healing modifier table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Type of Healing</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Modifier
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {healingTypes.map(type => (
                    <TableRow key={type.key}>
                      <TableCell>{type.label}</TableCell>
                      <TableCell align="right">{type.modifier > 0 ? `+${type.modifier}` : type.modifier}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <NumericInput
              integer
              label="Injury Penalty"
              value={injuryPenalty || null}
              onChange={value => setInjuryPenalty(value || 0)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Type of Healing"
              value={healingType}
              onChange={event => setHealingType(event.target.value as HealingType)}
            >
              {healingTypes.map(type => (
                <MenuItem key={type.key} value={type.key}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <SummaryValue label="BD ranks" value={bodyDevelopmentRanks} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <SummaryValue label="Co bonus" value={constitutionBonus} />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <SummaryValue label="Recovery modifier" value={recoveryModifier} strong />
          </Grid>
          <Grid size={12}>
            <Typography variant="body2" color="text.secondary">
              d100OE + {bodyDevelopmentRanks} + {constitutionBonus} + {healingModifier} - {injuryPenalty} = d100OE{' '}
              {recoveryModifier >= 0 ? '+' : '-'} {Math.abs(recoveryModifier)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
};

const SummaryValue: FC<{ label: string; value: number; strong?: boolean }> = ({ label, value, strong = false }) => (
  <Box>
    <Typography variant={strong ? 'h6' : 'body1'} sx={{ fontWeight: strong ? 700 : 500 }}>
      {value > 0 ? `+${value}` : value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

export default CharacterHealingForm;
