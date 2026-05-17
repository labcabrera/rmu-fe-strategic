import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Grid } from '@mui/material';
import {
  Faction,
  fetchFactions,
  LayoutBase,
  Page,
  RefreshButton,
  RmuPagination,
  RmuTextCard,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';
import { gridSizeCard } from '../../services/display';
import FactionListSearch from './FactionListSearch';

export default function FactionList() {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showError } = useError();
  const [pageData, setPageData] = useState<Page<Faction>>();
  const [rsql, setRsql] = useState<string>('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(24);

  const bindFactions = () => {
    fetchFactions(rsql, page, pageSize, auth)
      .then((response) => setPageData(response))
      .catch((err) => showError(err.message));
  };

  useEffect(() => {
    bindFactions();
  }, [rsql, page, pageSize]);

  return (
    <LayoutBase
      breadcrumbs={[{ name: t('home'), link: '/' }, { name: t('factions') }]}
      actions={[<RefreshButton onClick={() => bindFactions()} />]}
    >
      <FactionListSearch setRsql={setRsql} />
      <Grid container spacing={1}>
        {pageData === undefined ? (
          <CircularProgress />
        ) : (
          <>
            {pageData.content.map((faction, index) => (
              <Grid key={index} size={gridSizeCard} sx={{ mt: 2 }}>
                <RmuTextCard
                  value={faction.name}
                  subtitle={faction.shortDescription || 'No description provided'}
                  image={faction.imageUrl || ''}
                  onClick={() => navigate(`/strategic/factions/view/${faction.id}`, { state: { faction } })}
                />
              </Grid>
            ))}
            {pageData.content.length === 0 && <>{t('no-data-found')}</>}
            <RmuPagination
              page={page}
              pageSize={pageSize}
              totalPages={pageData.pagination.totalPages}
              setPage={setPage}
              setPageSize={setPageSize}
            />
          </>
        )}
      </Grid>
    </LayoutBase>
  );
}
