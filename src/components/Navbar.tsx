

import { useEffect, useState } from 'react';
import { SlMenu } from 'react-icons/sl'

import './Navbar.css'
import MyWallet from "../MyWallet";

const Navbar = () => {
    const [menu, setMenu] = useState(false)
    const handleClick = (flag: any) => {
        if (flag == 0 && menu == true) setMenu(false)
        else if (flag == 1) setMenu(!menu)
    }
    useEffect(() => {
        const func = () => {
            window.addEventListener("mousedown", function (event) {
                handleClick(0)
            })
        }
        func()
        return () => {
            window.removeEventListener('mousedown', func)
        }
    })
    return (
        <>
            <div style={{ background: 'black' }}>
                <div className='navbar'>
                    <img style={{ height: '110px', width: '170px' }} src='https://exchange.purebet.io/img/logo_dark.png' />
                    <div className='navbar-body'>
                        <div className='menu1'>
                            <div>TRY SWIPE!</div>
                            <div>HOME</div>
                            <div>SPORTS</div>
                            <div>BET HISTORY</div>
                            <div>DOCS</div>
                            <div>HOW IT WORKS</div>
                            <div>ABOUT US</div>
                            <div>ONBOARDING</div>
                        </div>
                        <svg style={{ cursor: 'pointer' }} fill="white" width={24} className="btn MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SettingsIcon"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"></path></svg>
                        <MyWallet />
                        <div className='menu2' onClick={() => handleClick(1)}>
                            <SlMenu style={{ cursor: 'pointer' }} />
                            {menu &&
                                <div className='resMenu'>
                                    <div className='menuItem'>TRY SWIPE!</div>
                                    <div className='menuItem'>HOME</div>
                                    <div className='menuItem'>SPORTS</div>
                                    <div className='menuItem'>BET HISTORY</div>
                                    <div className='menuItem'>DOCS</div>
                                    <div className='menuItem'>HOW IT WORKS</div>
                                    <div className='menuItem'>ABOUT US</div>
                                    <div className='menuItem'>ONBOARDING</div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Navbar