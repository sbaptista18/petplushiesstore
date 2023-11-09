import { Route, Switch } from 'react-router-dom';
import pages from 'pages';

const Content = () => (
  <>
    <Switch>
      {pages.map((props) => <Route {...props} key={props.path} />)}
    </Switch>
  </>
);


export default Content;