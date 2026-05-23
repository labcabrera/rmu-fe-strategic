import React, { Dispatch, FC, SetStateAction } from 'react';
import TradeViewOptionsForm, { TradeViewFormData } from './TradeViewOptionsForm';

const TradeViewOptions: FC<{
  formData: TradeViewFormData;
  setFormData: Dispatch<SetStateAction<TradeViewFormData>>;
}> = ({ formData, setFormData }) => {
  return <TradeViewOptionsForm formData={formData} setFormData={setFormData} />;
};

export default TradeViewOptions;
