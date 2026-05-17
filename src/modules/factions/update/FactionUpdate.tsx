import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CancelButton,
  EditableAvatar,
  Faction,
  LayoutBase,
  SaveButton,
  updateFaction,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';
import { getAvatarImages } from '../../services/image-service';
import FactionForm from '../form/FactionForm';

export default function FactionUpdate() {
  const auth = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { showError } = useError();

  const faction = location.state?.faction as Faction;
  const [formData, setFormData] = useState<Faction>({
    name: faction?.name || '',
    management: {
      availableGold: faction?.management?.availableGold || 0,
      availableXP: faction?.management?.availableXP || 0,
    },
    shortDescription: faction?.shortDescription || '',
    description: faction?.description || '',
    imageUrl: faction?.imageUrl || '',
  } as unknown as Faction);

  const onUpdate = async () => {
    updateFaction(faction.id, formData, auth)
      .then((data) => navigate(`/strategic/factions/view/${data.id}`, { state: { faction: data } }))
      .catch((err) => showError(err.message));
  };

  const onCancel = () => {
    navigate(`/strategic/factions/view/${faction.id}`, { state: { faction: faction } });
  };

  const onImageUpdated = (newImageUrl: string) => {
    setFormData({ ...formData, imageUrl: newImageUrl });
  };

  return (
    <LayoutBase
      breadcrumbs={[
        { name: t('home'), link: '/' },
        { name: t('strategic-module'), link: '/strategic' },
        { name: t('factions'), link: '/strategic/factions' },
        { name: t('edit') },
      ]}
      actions={[<CancelButton onClick={onCancel} />, <SaveButton onClick={onUpdate} />]}
      leftPanel={
        <EditableAvatar imageUrl={formData.imageUrl || ''} onImageChange={onImageUpdated} images={getAvatarImages()} />
      }
    >
      <FactionForm formData={formData} setFormData={setFormData} />
    </LayoutBase>
  );
}
