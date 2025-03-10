import React, {useState, useEffect} from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

import './styles.css'
import homeMain from "../../images/home.jpg"
import homeMainWtBg from "../../images/home_wtbg.webp"
import { useNavigate } from 'react-router-dom';
import logoText from '../../images/logo_text.webp'
// import Excursion from '../../components/Excursion/Excursion';

const Home = ()=>
{
    const [asteroidClick, setaAsteroidClick] = useState(false);
    const asteroidMenuAnimation = useAnimation();
    const MainWtBgImgAnimation = useAnimation();
    
    let navigate = useNavigate();

    useEffect(() => {
        if (!asteroidClick) {
            MainWtBgImgAnimation.start("small");
            asteroidMenuAnimation.start("hidden");
        } else {
            MainWtBgImgAnimation.start("big");
            asteroidMenuAnimation.start("visible");
        }
      }, [asteroidClick]);

    const buttonsLeft = [
        { label: 'железо-каменные', id:1 },
        { label: 'железные', id:2 },
        { label: 'каменные', id:3 },
      ];

    const buttonsRight = [
        { label: 'малые', id:4 },
        { label: 'средние', id:5 },
        { label: 'большие', id:6 },
    ];


    const homeMainWtBgImgClicked = {
        small: { 
            scale: 1, 
            transition: {
                delay: 1.2, 
                stiffness: 100,
            },
        },
        big: { 
            scale: 1.1, 
            transition: {
                delay: 0.2, 
                stiffness: 100,
            },
        },
    };
    

      const getButtonAnimation = (index:number, len:number) => {
        return {
            hidden: { 
                x: len, 
                opacity: 0,
                transition: {
                    delay: ((5-index) * 0.2), 
                },
            },
            visible: { 
                x: 0, 
                opacity: 1,           
                transition: {
                    delay: index * 0.2 + 0.2, 
                }, 
            },
        };
      };
      const images = [logoText, logoText, logoText, logoText, logoText, logoText, logoText, logoText, logoText, logoText];

      const scrollVariant = {
          animate: {
              x: ['-100%', '0%'],
              transition: {
                  x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 15,
                      ease: "linear",
                  },
              },
          },
      };
      
      

    return(
        <div id='Home'>
            <motion.div id="mainImageHm">
                    <img src={homeMain} id='homeMainImg' onClick={()=>{setaAsteroidClick(false)}}/>
                    
                    {buttonsLeft.map((button) => (
                        <motion.button
                            key={button.id}
                            variants={getButtonAnimation(button.id-1, 200)}
                            animate={asteroidMenuAnimation}
                            className={`asteroidMenu ${!asteroidClick ? "asteroidMenuHidden" : ""}`}
                            initial="hidden"
                            onClick={()=>{navigate('/catalog?filters='+button.label)}}
                            disabled={!asteroidClick}
                        >
                            {button.label}
                        </motion.button>
                    ))}
                    <motion.img src={homeMainWtBg} 
                        id='homeMainWtBgImg'
                        onClick={()=>{setaAsteroidClick(!asteroidClick)}}
                        variants={homeMainWtBgImgClicked}
                        animate={MainWtBgImgAnimation}
                    />
                    {buttonsRight.map((button) => (
                        <motion.button
                            key={button.id}
                            variants={getButtonAnimation(button.id-1, -200)}
                            animate={asteroidMenuAnimation}
                            className={`asteroidMenu ${!asteroidClick ? "asteroidMenuHidden" : ""}`}
                            initial="hidden"
                            onClick={()=>{navigate('/catalog?filters='+button.label)}}
                            disabled={!asteroidClick}
                        >
                            {button.label}
                        </motion.button>
                    ))}
            </motion.div>
            <div className="scroll-container">
                <motion.div
                    className="scroll-content"
                    variants={scrollVariant}
                    animate="animate"
                >
                    {images.map((src, index) => (
                        <img key={index} src={src} alt={`Logo ${index}`} />
                    ))}
                    {images.map((src, index) => (
                        <img key={index + images.length} src={src} alt={`Logo ${index}`} />
                    ))}
                </motion.div>
            </div>
            {/* <Excursion/> */}
        </div>
    );
};

export default Home;