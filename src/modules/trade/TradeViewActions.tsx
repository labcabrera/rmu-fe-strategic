import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RmuBreadcrumbs } from '@labcabrera-rmu/rmu-react-shared-lib';

const TradeViewActions: FC = () => {
  const { t } = useTranslation();
  const breadcrumbs = [
    { name: t('home'), link: '/' },
    { name: t('strategic-module'), link: '/strategic' },
    { name: t('characters'), link: '/strategic/characters' },
    { name: t('trade') },
  ];

  return (
    <>
      <RmuBreadcrumbs items={breadcrumbs}></RmuBreadcrumbs>
    </>
  );
};

export default TradeViewActions;
