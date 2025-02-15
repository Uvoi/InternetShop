import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

import './styles.css'
import visaLogo from '../../images/visa.webp'
import mastercardLogo from '../../images/mastercard.webp'
import bitcoinLogo from '../../images/bitcoin.webp'
import ethereumLogo from '../../images/ethereum.webp'
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
                        <li><img src={bitcoinLogo} alt=""/></li>
                        <li><img src={ethereumLogo} alt=""/></li>
                        <li><img src={qiwiLogo} alt=""/></li>
                        <li><img src={paypalLogo} alt=""/></li>
                    </ul>
                    <span style={{color: theme.palette.text.secondary}}>
                        www.asteroid.shop, owned and operated by Baobab Media Inc. (registration number 3301) with its registered office at Ratmanov Island, Chukotka District and legal address at Bolshoy Lyakhovsky Island in the Bulunsky Ulus district of the Republic of Sakha, welcomes you to our online store. At Asteroid Media, we are dedicated to providing our customers with a wide selection of high-quality space objects that meet their individual needs and interests. Our goal is to provide a one-stop shop for all their space exploration and collection needs.The terms and conditions of your participation in the Purchases are governed by the laws of Atlantis. The terms relating to payment collection and transactions, on the other hand, are governed by the applicable laws of Asia and Oceania. You agree that, unless otherwise specified, Purchases take place in Atlantean territory and your participation therein takes place within the aforementioned territory as well. Any contractual arrangements between you and our company shall be considered completed and executed in Atlantis, at the registered office. The Parties agree that any disputes, contradictions, or claims arising out of, or in connection with, these Terms and Conditions as well as any violations, termination, or invalidity thereof shall be subject to the exclusive jurisdiction of the courts in Atlantis. However, claims arising from payment-related transactions shall be submitted to the courts of either Atlantis or the courts of East Asia or Oceania, depending on which applies.
                    </span>
                </div>
            </div>

            <span id="rights" style={{color: theme.palette.text.ultra}}>© Baobab, 1988-2024. Все права защищены. </span>
        
        </footer>
    );
};

export default Footer;