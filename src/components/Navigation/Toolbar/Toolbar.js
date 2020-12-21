import React from 'react';

import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

const Toolbar = props => (
  <header className={classes.Toolbar}>
    <DrawerToggle clicked={props.drawerToggleClicked} />
    {/* I can use logo class here even though I'm already using it in the Logo component cuz due to css modules it will convert my css class names into different names and to scope names so that even though I write two identical classes in the development mode it actually converts that to two different css classes */}
    <div className={classes.Logo}>
      {/* <Logo height="80%" /> */}
      <Logo />
    </div>
    <nav className={classes.DesktopOnly}>
      <NavigationItems isAuthenticated={props.isAuth} />
    </nav>
  </header>
);

export default Toolbar;
