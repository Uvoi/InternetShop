import React, { useState } from 'react';
import './styles.css';
import { Backdrop, Button, IconButton, Modal, TextField } from '@mui/material';
import { useTheme } from '../../themes/ThemeProvider';
import { HelpOutline } from '@mui/icons-material';

interface InputMeasurementsMprops {
    open: boolean;
    close: () => void;
    measurements: Record<string, string>;
    getResult: (res: Record<string, number>) => void;
}

const InputMeasurementsM: React.FC<InputMeasurementsMprops> = ({ open, close, measurements, getResult }) => {
    const { theme } = useTheme();

    const [inputValues, setInputValues] = useState<Record<string, number>>({});

    const handleChange = (key: string, value: string) => {
        setInputValues(prev => ({
            ...prev,
            [key]: value ? parseInt(value, 10) || 0 : 0,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        getResult(inputValues);
        console.log(inputValues)
        close();
    };

    return (
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
            }}
        >
            <div className='InputMeasurementsM' style={{ background: theme.palette.background.paper }}>
                <form id='measurementForm' onSubmit={handleSubmit}>
                    {Object.entries(measurements).map(([key, value]) => (
                        <div className='InputMeasurementsMInputs' key={key}>
                            <TextField
                                className='InputMeasurementsMTF'
                                label={value}
                                type='number'
                                value={inputValues[key] || ''}
                                onChange={(e) => handleChange(key, e.target.value)}
                            />
                            <p style={{ color: theme.palette.text.primary }}>мм.</p>
                            <IconButton><HelpOutline /></IconButton>
                        </div>
                    ))}
                </form>
                <Button type="submit" form="measurementForm">Готово</Button>
            </div>
        </Modal>
    );
};

export default InputMeasurementsM;
