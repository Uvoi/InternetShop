import React from 'react';

import './styles.css'
import load from '../../images/logoLoad.webp'


const Loading = ()=>
{
    return(
        <div id='Loading'>
            <img src={load} alt="" />
        </div>
    );
};

export default Loading;