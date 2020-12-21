import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './pages/Login';
import Main from './pages/Main';

const AppNavigator = createSwitchNavigator({
  Login,
  Main,
});

const Routes = () => {
  const AppContainer = createAppContainer(AppNavigator);

  return (
    <AppContainer />
  );
}

export default Routes;
