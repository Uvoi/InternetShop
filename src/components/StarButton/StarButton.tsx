import React from 'react';
import './styles.css'
import { Link } from 'react-router-dom';

interface StarButtonProps{
    to: string,
    children : React.ReactNode,
  }

const StarButton:React.FC<StarButtonProps>  = ({to, children})=>
{
    return(
        <Link to={to} className="starButton">
        <button className='bot_line'> 
        {children}
                        
    <div className="star-1">
        <svg viewBox="0 0 784.11 815.53">
        <g id="Layer_x0020_1">
            <path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0"></path>
        </g>
        </svg>
    </div>
    <div className="star-2">
        <svg viewBox="0 0 784.11 815.53">
        <g id="Layer_x0020_1">
            <path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0"></path>
        </g>
        </svg>
    </div>
    <div className="star-3">
        <svg viewBox="0 0 784.11 815.53">
        <g id="Layer_x0020_1">
            <path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0"></path>
        </g>
        </svg>
    </div>
    <div className="star-4">
        <svg viewBox="0 0 784.11 815.53">
        <g id="Layer_x0020_1">
            <path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0"></path>
        </g>
        </svg>
    </div>
    <div className="star-5">
        <svg viewBox="0 0 784.11 815.53">
        <g id="Layer_x0020_1">
            <path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0"></path>
        </g>
        </svg>
    </div>
    <div className="star-6">
        <svg viewBox="0 0 784.11 815.53">
        <g id="Layer_x0020_1">
            <path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0"></path>
        </g>
        </svg>
    </div>
        </button>
        </Link>
    );
};

export default StarButton;