import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Grid } from '@mui/material';
import {
  Character,
  fetchCharacters,
  LayoutBase,
  Page,
  RmuPagination,
  RefreshButton,
  RmuTextCard,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';
import { gridSizeCard } from '../../services/display';
import CharacterListSearch from './CharacterListSearch';

export default function CharacterList() {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showError } = useError();

  const [rsql, setRsql] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(24);
  const [pageData, setPageData] = useState<Page<Character>>();

  const bindCharacters = () => {
    fetchCharacters(rsql, page, pageSize, auth)
      .then((data) => setPageData(data))
      .catch((err) => showError(err.message));
  };

  useEffect(() => {
    bindCharacters();
  }, [rsql, page, pageSize]);

  return (
    <LayoutBase
      breadcrumbs={[
        { name: t('home'), link: '/' },
        { name: t('strategic-module'), link: '/strategic' },
        { name: t('characters') },
      ]}
      actions={[<RefreshButton onClick={() => bindCharacters()} />]}
    >
      <CharacterListSearch setRsql={setRsql} />
      <Grid container spacing={1}>
        {pageData === undefined ? (
          <CircularProgress />
        ) : (
          <>
            {pageData.content.map((c, index) => (
              <Grid key={index} size={gridSizeCard} sx={{ mt: 2 }}>
                <RmuTextCard
                  value={c.name}
                  subtitle={c.info.race.name}
                  image={c.imageUrl || ''}
                  onClick={() => navigate(`/strategic/characters/view/${c.id}`, { state: c })}
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
