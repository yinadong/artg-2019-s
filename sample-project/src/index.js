import { 
	csv 
} from 'd3';

import { 
	parseTradeData,
	logDataSummary
} from './utils';


const data = csv('./data/wto/WtoData_20190109214054.csv', parseTradeData);

data.then(logDataSummary);
