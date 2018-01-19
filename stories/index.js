import React from 'react';
import { storiesOf } from '@storybook/react';
import Menu from '../src/Components/Rounds.js';
import '../src/Components/Rounds.css';

storiesOf('Menu', module)
  .addDecorator(story => (
    <div style={{textAlign: 'center'}}>
      {story()}
    </div>
  ))
  .add('without props', () => <Menu />);