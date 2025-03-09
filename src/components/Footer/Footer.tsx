import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

import './styles.css'
import visaLogo from '../../images/visa.webp'
import mastercardLogo from '../../images/mastercard.webp'
import qiwiLogo from '../../images/qiwi.webp'
import paypalLogo from '../../images/paypal.webp'
import telegramLogo from '../../images/telegram.webp'
import vkLogo from '../../images/vk.webp'
import githubLogo from '../../images/github.svg'
import logof from '../../images/logof.webp'
import { useTheme } from '../../themes/ThemeProvider';

const Footer = ()=>
{
    const { theme } = useTheme();
    return(
        <footer id='Footer' style={{backgroundColor: theme.palette.header.primary}}>
            <div id="contact_aboutF">
                <div id="contactsF">
                    <Link to={'/'}>
                        <img src={logof} alt="" id='logofF'/>
                    </Link>
                    <div id='contactIconsF'>
                        <a href='https://vk.com/asteroid_shop_proj' target='_blank' rel='noopener noreferrer'><img src={vkLogo} alt="VK" /></a>
                        <a href='https://github.com/Uvoi/AsteroidShop' target='_blank' rel='noopener noreferrer'><img src={githubLogo} alt="GitHub" /></a>
                        <a href='https://t.me/asteroid_shop_proj' target='_blank' rel='noopener noreferrer'><img src={telegramLogo} alt="Telegram" /></a>
                    </div>
                    <p>+7 (330) 133-01-33</p>
                    <p>+7 (27) 922-41-469</p>
                    <Button variant="contained"><Link to='/help'>Задать вопрос</Link></Button>
                </div>
                <div id="aboutUsF">
                    <ul id="payingF">
                        <li><img src={visaLogo} alt=""/></li>
                        <li><img src={mastercardLogo} alt=""/></li>
                        <li><img src={qiwiLogo} alt=""/></li>
                        <li><img src={paypalLogo} alt=""/></li>
                    </ul>
                    <span style={{color: theme.palette.text.secondary}}>
                    www.clothes.shop, a company owned and operated by Clothes Media Inc. (registration number 3301), registered on Ratmanov Island, Chukotka District, and whose legal address is Bolshoy Lyakhovsky Island in the Bulunsky district of the Sakha Republic, welcomes you to our online store. Clothes Media Company strives to provide our clients with a wide range of high-quality and stylish clothes that meet their individual needs and interests. Our goal is to provide a one-stop service to meet all their clothing and fashion needs.The terms of your participation in the procurement are governed by the laws of Atlantis. On the other hand, the terms and conditions regarding the collection of payments and transactions are governed by the applicable laws of Asia and Oceania. You agree that, unless otherwise stated, purchases are made on the territory of Atlantis, and your participation in them is also carried out on the aforementioned territory. Any contractual agreements between you and our company are considered concluded in Atlantis, according to the registered office. The Parties agree that any disputes, contradictions or claims arising out of or in connection with these Terms and Conditions, as well as any violations, termination or invalidity thereof, are subject to the exclusive jurisdiction of the courts of Atlantis. However, claims arising in connection with payment transactions must be filed either in the courts of Atlantis, or in the courts of East Asia or Oceania, whichever is applicable.
                    </span>
                </div>
            </div>

            <span id="rights" style={{color: theme.palette.text.ultra}}>© Clothes, 1988-2024. Все права защищены. </span>
        
        </footer>
    );
};

export default Footer;