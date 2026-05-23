import React, { Dispatch, FC, SetStateAction } from 'react';
import { AddItemDto, Section } from '@labcabrera-rmu/rmu-react-shared-lib';
import { ItemSelector } from '../items/ItemSelector';

const TradeViewItemSearch: FC<{
  formData: AddItemDto;
  setFormData: Dispatch<SetStateAction<AddItemDto>>;
}> = ({ formData, setFormData }) => {
  return (
    <Section>
      <ItemSelector formData={formData} setFormData={setFormData} />;
    </Section>
  );
};

export default TradeViewItemSearch;
