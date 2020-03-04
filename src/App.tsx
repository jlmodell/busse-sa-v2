import * as React from 'react';
import { observer } from 'mobx-react'
import Routes from './routes/Routes'
import LeftPane from './components/LeftPane';
// import Store from './store/store'

interface Props {}

const App: React.FC<Props> = observer(() => {
  return (
    <div className="flex">
      <div className="w-56 min-h-screen fixed">
        <LeftPane />
      </div>
      <div className="bg-gray-700 min-h-screen w-screen ml-56">
        <Routes />
      </div>
    </div>
  );
})

export default App;
