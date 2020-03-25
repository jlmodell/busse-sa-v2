import * as React from 'react';
import { observer } from 'mobx-react';
import Routes from './routes/Routes';
import LeftPane from './components/LeftPane';
import Store from './store/store';

interface Props {}

const App: React.FC<Props> = observer(() => {
	return (
		<div className="flex bg-white">
			<div className={Store.minBar ? 'absolute' : 'w-56 min-h-screen fixed opacity-80'}>
				<LeftPane />
			</div>
			<div
				className={
					Store.minBar ? (
						'bg-gray-700 min-h-screen w-screen opacity-80'
					) : (
						'bg-gray-700 min-h-screen w-screen ml-56 opacity-80'
					)
				}
			>
				<Routes />
			</div>
		</div>
	);
});

export default App;
