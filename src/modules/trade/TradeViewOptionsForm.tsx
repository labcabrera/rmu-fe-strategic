import React, { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';

export type TradeViewFormData = {
  option: 'buy' | 'sell';
  communications: string;
  population: string;
  economy: string;
  trade: string;
  itemType: string;
  languageOptions: string;
};

const communicationOptions = ['normal', 'poor', 'excelent'];
const economyOptions = ['normal', 'poor', 'wealthy', 'barter-economy'];
const population = ['normal', 'lightly-populated', 'heavily-populated'];
const tradeOptions = ['none', 'barter-economy'];
const itemTypes = ['normal', 'inusual', 'especially useful', 'specialty-item', 'expensive', 'very-expensive', 'ilegal'];
const languageOptions = ['none', 'fewer-than-tree-ranks', 'more-than-six-ranks'];

const TradeViewOptionsForm: FC<{
  formData: TradeViewFormData;
  setFormData: Dispatch<SetStateAction<TradeViewFormData>>;
}> = ({ formData, setFormData }) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={1}>
      <OptionSelect
        id="communications"
        label={t('communications')}
        options={communicationOptions}
        value={formData.communications}
        onChange={(value) => setFormData({ ...formData, communications: value })}
      />
      <OptionSelect
        id="population"
        label={t('population')}
        options={population}
        value={formData.population}
        onChange={(value) => setFormData({ ...formData, population: value })}
      />
      <OptionSelect
        id="economy"
        label={t('economy')}
        options={economyOptions}
        value={formData.economy}
        onChange={(value) => setFormData({ ...formData, economy: value })}
      />
      <OptionSelect
        id="trade-options"
        label={t('trade-options')}
        options={tradeOptions}
        value={formData.trade}
        onChange={(value) => setFormData({ ...formData, trade: value })}
      />
      <OptionSelect
        id="language-options"
        label={t('language-options')}
        options={languageOptions}
        value={formData.languageOptions}
        onChange={(value) => setFormData({ ...formData, languageOptions: value })}
      />
      <OptionSelect
        id="item-options"
        label={t('item-options')}
        options={itemTypes}
        value={formData.itemType}
        onChange={(value) => setFormData({ ...formData, itemType: value })}
      />
    </Grid>
  );
};

const OptionSelect = ({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Grid size={{ xs: 12, md: 3 }}>
      <FormControl fullWidth>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          value={value}
          label={label}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {t(opt)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default TradeViewOptionsForm;
