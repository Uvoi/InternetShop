import React, { useEffect, useState } from 'react';
import './styles.css';
import { Input, Button, RadioGroup, Radio, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useNotification } from '../Notification/Notification';
import { addNewProduct, getMeasurements } from '../../functions/product';
import { useTheme } from '../../themes/ThemeProvider';


interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  imgLink: string;
  composition: string;
}

interface Errors {
  name?: boolean;
  description?: boolean;
  price?: boolean;
  category?: boolean;
  imglink?: boolean;
  composition?: boolean;
  gender?: boolean,  
}

const AddNewProduct: React.FC = () => {

  const { theme } = useTheme();
  const showNotification = useNotification();  


  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    imgLink: '',
    composition: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [gender, setGender] = useState('');
  const [measurements, setMeasurements] = useState<{ male: Record<string, string>, female: Record<string, string> }>({
    male: {},
    female: {},
  });

  const [selectedMeasurements, setSelectedMeasurements] = useState<string[]>([]);

  const handleChangeMeasurements = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedMeasurements((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
    );
  };


  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name) newErrors.name = true;
    if (!formData.description) newErrors.description = true;
    if (!formData.price) newErrors.price = true;
    if (!formData.category) newErrors.category = true;
    if (!formData.imgLink) newErrors.imglink = true;
    if (!formData.composition) newErrors.composition = true;
    if (!gender) newErrors.gender = true;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeGender = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedGender = (event.target as HTMLInputElement).value;
    setGender(selectedGender);
    setSelectedMeasurements([]);
    setErrors((prev)=>({...prev, gender:false}))
  };
  

  const sendToServ = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      category: formData.category,
      imglink: formData.imgLink,
      composition: formData.composition,
      gender: gender,
      required_measurements: selectedMeasurements
    };
    
    const success = await addNewProduct(payload);    
    if (success) {
      showNotification!('Продукт успешно добавлен', 'green');
    }
  };
  
  const productFieldBorder = theme.palette.primary.ultra;
  const genderStyle = {
    color: errors.gender ? 'red' : theme.palette.text.ultra
  };
  const genderMeasuresStyle = {
    color: theme.palette.text.primary 
  };
  const genderMeasuresStyleDisabled = {
    color: theme.palette.text.disabled
  };



  useEffect(() => {
    async function fetchMeasurements() {
      try {
        const data = await getMeasurements();
        setMeasurements(data);
      } catch (error) {
        console.error("Ошибка при получении мерок:", error);
      }
    }
    fetchMeasurements();
  }, []);


  return (
    <div className='AddNewProduct'>
      <form className="AddToDB">
        <div className="DataANP">
          <Input
            type="text"
            name="name"
            placeholder="Title*"
            value={formData.name}
            onChange={handleInputChange}
            style={{ border: errors.name ? '1px solid red' : '1px solid ' + productFieldBorder}}
          />
          <Input
            type="text"
            name="description"
            placeholder="Description*"
            value={formData.description}
            onChange={handleInputChange}
            style={{ border: errors.description ? '1px solid red' : '1px solid ' + productFieldBorder}}
          />
          <Input
            type="number"
            name="price"
            placeholder="Price*"
            value={formData.price}
            onChange={handleInputChange}
            style={{ border: errors.price ? '1px solid red' : '1px solid ' + productFieldBorder}}
          />
          <Input
            type="text"
            name="category"
            placeholder="Category*"
            value={formData.category}
            onChange={handleInputChange}
            style={{ border: errors.category ? '1px solid red' : '1px solid ' + productFieldBorder}}
          />
          <Input
            type="text"
            name="imgLink"
            placeholder="Image link*"
            value={formData.imgLink}
            onChange={handleInputChange}
            style={{ border: errors.imglink ? '1px solid red' : '1px solid ' + productFieldBorder}}
          />
          <Input
            type="text"
            name="composition"
            placeholder="Composition*"
            value={formData.composition}
            onChange={handleInputChange}
            style={{ border: errors.composition ? '1px solid red' : '1px solid ' + productFieldBorder}}
          />
        </div>
          <RadioGroup className="GenderANP"
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={gender}
            onChange={handleChangeGender}
          >
            <div>
              <label>
                <Radio value="male"/>
                <p style={genderStyle}>Male</p>
              </label>
              <label
              style={{ color: errors.gender ? 'red' : 'inherit' }}>
                <Radio value="unisex"/>
                <p style={genderStyle}>Unisex</p>
              </label>
                <FormGroup className="maleMeasures">
                  {Object.entries(measurements.male).map(([key, value]) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          value={key}
                          checked={["male", "unisex"].includes(gender) && selectedMeasurements.includes(key)}
                          onChange={handleChangeMeasurements}
                          disabled={!["male", "unisex"].includes(gender)}
                        />
                      }
                      label={<p style={["male", "unisex"].includes(gender)?genderMeasuresStyle:genderMeasuresStyleDisabled}>{value}</p>}
                    />
                  ))}
                </FormGroup>
            </div>

            <div>
              <label>
                <Radio value="female"/>
                <p style={genderStyle}>Female</p>
              </label>
                <FormGroup className="femaleMeasures">
                  {Object.entries(measurements.female).map(([key, value]) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          value={key}
                          checked={gender === "female" && selectedMeasurements.includes(key)}
                          onChange={handleChangeMeasurements}
                          disabled={gender !== "female"}
                        />
                      }
                      label={<p style={gender == "female"?genderMeasuresStyle:genderMeasuresStyleDisabled}>{value}</p>}
                    />
                  ))}
                </FormGroup>
            </div>

          </RadioGroup>
      </form>
      <Button variant="contained" type="submit" onClick={sendToServ}>
        Add
      </Button>
    </div>
  );
};

export default AddNewProduct;
