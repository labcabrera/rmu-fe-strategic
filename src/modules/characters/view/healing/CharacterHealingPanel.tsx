import React, { FC } from 'react';
import { CategorySeparator, Character } from '@labcabrera-rmu/rmu-react-shared-lib';
import CharacterHealingForm from './CharacterHealingForm';
import CharacterPermanentInjuryForm from './CharacterPermanentInjuryForm';

const CharacterHealingPanel: FC<{ character: Character }> = ({ character }) => {
  return (
    <>
      <CategorySeparator text="Healing" />
      <CharacterHealingForm character={character} />
      <CharacterPermanentInjuryForm />
    </>
  );
};

export default CharacterHealingPanel;
