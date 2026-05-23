import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useParams } from 'react-router-dom';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { Character, fetchCharacter, LayoutBase } from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../ErrorContext';
import TradeViewItemSearch from './TradeViewItemSearch';
import TradeViewOptions from './TradeViewOptions';
import { TradeViewFormData } from './TradeViewOptionsForm';

const tradeOptions: TradeViewFormData['option'][] = ['buy', 'sell'];

export default function TradeView() {
  const auth = useAuth();
  const { t } = useTranslation();
  const { showError } = useError();
  const { characterId } = useParams<{ characterId: string }>();
  const [character, setCharacter] = useState<Character>();
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<TradeViewFormData>({
    option: 'buy',
    communications: 'normal',
    population: 'normal',
    economy: 'normal',
    trade: 'none',
    itemType: 'normal',
    languageOptions: 'none',
  });

  useEffect(() => {
    if (characterId) {
      setLoading(true);
      fetchCharacter(characterId, auth)
        .then((c) => setCharacter(c))
        .catch((err) => showError(err.message))
        .finally(() => setLoading(false));
    }
  }, [characterId]);

  const onTradeOptionChange = (_event: SyntheticEvent, option: TradeViewFormData['option']) => {
    setFormData({ ...formData, option });
  };

  return (
    <LayoutBase
      breadcrumbs={[
        { name: t('home'), link: '/' },
        { name: t('strategic-module'), link: '/strategic' },
        { name: t('characters'), link: '/strategic/characters' },
        { name: t('trade') },
      ]}
      leftPanel={character?.name || t('resume')}
    >
      {loading ? (
        <p>{t('loading')}...</p>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={formData.option} onChange={onTradeOptionChange} variant="scrollable" scrollButtons="auto">
              {tradeOptions.map((option) => (
                <Tab
                  key={option}
                  label={t(option)}
                  value={option}
                  id={`trade-tab-${option}`}
                  aria-controls={`trade-tabpanel-${option}`}
                />
              ))}
            </Tabs>
          </Box>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TradeViewOptions formData={formData} setFormData={setFormData} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>{formData.option === 'buy' && <TradeViewItemSearch />}</Grid>
            <Grid size={12}>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </Grid>
          </Grid>
        </Box>
      )}
    </LayoutBase>
  );
}
