import React, { useState, useEffect, useContext } from 'react';
import './styles.css';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import ProductsContainer from '../../components/ProductsContainer/ProductsContainer';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminPanel from '../../components/AdminPanel/AdminPanel';
import { getCatalog } from '../../functions/product';
import { useTheme } from '../../themes/ThemeProvider';


const Catalog = () => {
  const { theme } = useTheme();

  const [asteroidData, setAsteroidData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        const data = await getCatalog();
        parseData(data);
    };

    const parseData = (data) => {
      const newData = {};
      if (Array.isArray(data)) {
        data.forEach(item => {
          newData[item.id] = {
            title: item.title,
            description: item.description,
            weight: item.weight,
            price: item.price,
            category: item.category,
            imgLink: item.imgLink
          };
        });
        setAsteroidData(newData); 
      }
       else {
        console.error('Полученные данные не являются массивом');
      }
    };
    fetchData();
  }, []);

  const selectCategories = {
    all: 'Все астероиды',
    iron: 'Железные',
    stone: 'Каменные',
    iron_stone: 'Железо-каменные',
    small: 'Малые',
    medium: 'Средние',
    big: 'Большие',
  };

  const parseFiltersFromUrl = (urlParams) => {
    const filters = urlParams.get('filters');
    if (filters) {
      const selectedFilters = filters.split(',').map(filter => {
        const normalizedFilter = filter.replace(/_/g, ' ');
        return Object.values(selectCategories).find(category => category.toLowerCase() === normalizedFilter);
      }).filter(Boolean);
      return selectedFilters.length > 0 ? selectedFilters : [selectCategories.all];
    }
    return [selectCategories.all];
  };

  const [selectCategoryValue, setSelectCategoryValue] = useState(parseFiltersFromUrl(searchParams));

  const handleChange = (event=null) => {
    let selectedValues;
    if (event){
      const { value } = event.target;
      selectedValues = typeof value === 'string' ? value.split(',') : value;
    }
    else{
      selectedValues=selectCategoryValue
    } 

  
    if (selectedValues.includes(selectCategories.all)) {
      if (selectedValues[selectedValues.length - 1] === selectCategories.all && selectedValues.length > 1) {
        selectedValues = [selectCategories.all];
      } else {
        selectedValues = selectedValues.filter(item => item !== selectCategories.all);
      }
    }
    if (selectedValues.length === 0) {
      selectedValues = [selectCategories.all];
    }
    setSelectCategoryValue(selectedValues);

    const normalizedSelectedValues = selectedValues.map(val => normalizeCategory(val));
  
    Object.keys(asteroidData).forEach(key => {
      const productCard = document.getElementById("ProductCard_" + key);
      const normalizedCategory = normalizeCategory(asteroidData[key].category);
      if (productCard) {
        if (normalizedSelectedValues.includes(normalizeCategory(selectCategories.all)) || 
        (normalizedSelectedValues.includes(normalizedCategory)) ||
        (selectedValues.includes(returnWeightCategory(asteroidData[key].weight))))
          {
          productCard.style.display = 'flex';
        } else {
          productCard.style.display = 'none';
        }
      }
    });
  };

  const normalizeCategory = (category) => {
    return category.slice(0, -1);
  };

  const returnWeightCategory = (weight) => {
    if ((weight > 0.000001) && (weight < 1)) 
      return 'Малые'
    if ((weight > 1) && (weight < 50))
      return 'Средние'
    if (weight > 50)
      return 'Большие'
  };
  
  
  

  useEffect(() => {
    const filterQuery = selectCategoryValue
      .filter(category => category !== selectCategories.all)
      .map(category => category.toLowerCase().replace(/ /g, '_'))
      .join(',');
      
    const newUrl = filterQuery ? `/catalog?filters=${filterQuery}` : '/catalog';
    navigate(newUrl, { replace: true });

  }, [selectCategoryValue, navigate]);

  useEffect(() => {
    if (Object.keys(asteroidData).length > 0) { // Проверяем, что данные загружены
      handleChange();
    }
  }, [asteroidData]);

  return (
    <div id='Catalog'>
      <div id='catalog'>
        <FormControl id='selectAsteroidForm'>
          <InputLabel style={{ background: theme.palette.background.default }} id="selectorCat-label">Категория</InputLabel>
          <Select
            labelId="selectorCat-label"
            id="selectorCat"
            multiple
            value={selectCategoryValue}
            onChange={handleChange}
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <Chip className='catalog_chips' key={value} label={value} />
                ))}
              </div>
            )}
          >
            {Object.values(selectCategories).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ProductsContainer>
          {Object.keys(asteroidData).map(key => (
            <ProductCard
              cardId = {key}            
              key={key}
              prdtTitle={asteroidData[key].title}
              prdtDescription={asteroidData[key].description}
              prdtWeight={asteroidData[key].weight}
              prdtPrice={asteroidData[key].price}
              prdtCategory={asteroidData[key].category}
              imgLink={asteroidData[key].imgLink}
            />
          ))}
        </ProductsContainer>
      </div>
      <AdminPanel add={'/admin/product/add'} addTitle={'Добавить продукт'}/>
    </div>
  );
};

export default Catalog;
