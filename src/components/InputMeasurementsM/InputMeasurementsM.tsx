import React, { useState } from 'react';
import './styles.css'
import { Backdrop, Button, IconButton, Modal, TextField } from '@mui/material';
import { useTheme } from '../../themes/ThemeProvider';
import { HelpOutline } from '@mui/icons-material';

interface InputMeasurementsMprops
{
    open: boolean, 
    close: () => void, 
    measurements: Record<string, string>;
    getResult: (res:boolean) => void,
}

const InputMeasurementsM:React.FC<InputMeasurementsMprops> = ({open, close, measurements, getResult})=>
{
    const { theme } = useTheme();
    return(
        <Modal 
            open={open}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                timeout: 1000,
                },
            }}>  
            <div className='InputMeasurementsM' style={{background: theme.palette.background.paper }}>
                <form>
                    {Object.entries(measurements).map(([key,value]) => (
                        <div className='InputMeasurementsMInputs'>
                            <TextField
                            className='InputMeasurementsMTF'
                            key={key}
                            label={value}  
                            type='number'
                            
                            // onChange={handleChangeMeasurements}
                            
                            /> 
                            <p>мм.</p>
                            <IconButton><HelpOutline/></IconButton>
                        </div>
                    ))}
                </form>           
                <Button>Готово</Button>
            </div>
        </Modal>
    );
};

export default InputMeasurementsM;