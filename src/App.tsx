import * as React from 'react';
import { observer } from 'mobx-react'
import Routes from './routes/Routes'
import LeftPane from './components/LeftPane';
// import Store from './store/store'

interface Props {}

const App: React.FC<Props> = observer(() => {
  return (
    <div className="flex">
      <div className="w-64 h-screen">
        <LeftPane />
      </div>
      <div className="bg-gray-100 w-screen">
        <Routes />
      </div>
    </div>
  );
})

export default App;
