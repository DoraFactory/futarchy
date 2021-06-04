import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { DebateProvider } from '../../contexts/debates';
import DebateDetail from './DebateDetail';
import DebateList from './DebateList';

const Debates = () => {
  return (
    <DebateProvider>
      <Switch>
        <Route exact path="/:id" component={DebateDetail} />
        <Route path="/" component={DebateList} />
      </Switch>
    </DebateProvider>
  );
};

export default Debates;
