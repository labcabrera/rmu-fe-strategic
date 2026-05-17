import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { ClearableTextField, fetchRealms, Realm } from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';

export default function StrategicGameListSearch({ setRsql }: { setRsql: Dispatch<SetStateAction<string>> }) {
  const auth = useAuth();
  const { t } = useTranslation();
  const { showError } = useError();
  const [searchName, setSearchName] = useState('');
  const [realmId, setRealmId] = useState('');
  const [realms, setRealms] = useState<Realm[]>([]);

  const append = (rsql: string, predicate: string) => {
    if (rsql === '') return predicate;
    return `${rsql};${predicate}`;
  };

  useEffect(() => {
    let queryString = '';
    if (searchName) {
      queryString = append(queryString, `name=re=${searchName}`);
    }
    if (realmId) {
      queryString = append(queryString, `realmId==${realmId}`);
    }
    setRsql(queryString);
  }, [searchName, realmId, setRsql]);

  useEffect(() => {
    fetchRealms('', 0, 100, auth)
      .then((response) => setRealms(response.content))
      .catch((err) => showError(err.message));
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, md: 3 }}>
        <ClearableTextField label={t('name')} name="name" value={searchName} onChange={(e) => setSearchName(e || '')} />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Autocomplete
          options={realms}
          getOptionLabel={(option) => option?.name || ''}
          value={realms.find((option) => option.id === realmId) || null}
          onChange={(_, newValue) => setRealmId(newValue?.id || '')}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          fullWidth
          size="small"
          renderInput={(params) => <TextField {...params} label={t('realm')} />}
          noOptionsText={t('no-options')}
        />
      </Grid>
    </Grid>
  );
}
