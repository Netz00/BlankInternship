import TextField from '@material-ui/core/TextField';
import  PropTypes  from 'prop-types';
import { useState } from 'react';

const initialFormData = Object.freeze({
    address: "",
    addressValid:true,
  });

function AddressInput({onTextChange}) {
    const ethereum_address = require('ethereum-address');
    const [formData, updateFormData] = useState(initialFormData);

 
    const handleChangeText = (e) => {
        const newMessageObj = { 
          address:e.target.value.trim(),
          addressValid: ethereum_address.isAddress(e.target.value.trim()) 
        };
        updateFormData(newMessageObj); 

        onTextChange(e);
      };

    return (
        <TextField
        backgroundcolor="transparent"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="address"
        label="Etherium address"
        type="text"
        id="address"
        autoComplete="current-address"
        onChange={handleChangeText}
        error={!formData.addressValid}
        helperText={!formData.addressValid ? 'Invalid etherium address.' : ''}
      />
    )
}

AddressInput.propTypes = {
    onTextChange: PropTypes.func.isRequired,
}

export default AddressInput