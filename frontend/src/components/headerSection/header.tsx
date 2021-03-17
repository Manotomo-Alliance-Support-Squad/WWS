import React, { Component } from 'react'
import { useLocation } from 'react-router-dom';
import InPageNav from '../inPageNav/inPageNav';
import '../../shared/globalStyles/global.css';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import ArrowDropDownCircleOutlinedIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';

import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';

import './header.css';

interface HeaderState {
}

interface HeaderProps {
}

const AltNav = () => {
    const location = useLocation();
    if (location.pathname == "/home") {
        return <InPageNav navButtons={homeNav}/>;
    }
    return <span />
};

const homeNav = [
    {
        link: "/game",
        buttonContent: "Games",
        page: "",
        startIcon: <SportsEsportsIcon />
    },
    {
        link: 'https://github.com/Manotomo-Alliance-Support-Squad/holo-valentine-2021',
        buttonContent: "Credits",
        page: "",
        startIcon: <InfoIcon />
    },
]

export default class HeaderSection extends Component<HeaderProps, HeaderState>
{
    constructor(props: HeaderProps)
    {
        super(props);
    }

    renderDefaultSection(): JSX.Element
    {
        return (
            <header className="App-header">
            </header>
       )
    }

    render() {
        return this.renderDefaultSection();
    }
}
