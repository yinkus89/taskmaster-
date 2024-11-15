import moment from 'moment';

const DateComponent = () => {
  const currentDate = moment().format('YYYY-MM-DD');
  
  return <div>Current Date: {currentDate}</div>;
};

export default DateComponent;
