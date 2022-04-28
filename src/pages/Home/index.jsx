import { useState } from 'react';
import { useSubscription } from '@apollo/client';
import PropTypes from 'prop-types';

// MUI Components
import Box from '@mui/material/Box';

// Global Components
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import SummaryTransaction from '../../components/SummaryTransaction';
import TransactionList from '../../components/TransactionList';
import AddTransaction from '../../components/AddTransaction';

// GraphQL Subscriptions
import { Subscription } from '../../services/apollo/transactions';

// Utils
import ErrorHandler from '../../utils/ErrorHandler';

const Home = ({ user }) => {
  const [alertMessage, setAlertMessage] = useState(null);

  const {
    data: { result: transactions } = { result: [] },
    loading: getTransactionsLoading,
    error: getTransactionError,
  } = useSubscription(
    Subscription.GetUserTransactions,
    { variables: { userId: user.id } },
  );

  const onCloseHandler = () => {
    setAlertMessage(null);
  };

  if (getTransactionError) {
    ErrorHandler.alert(getTransactionError, setAlertMessage);
  }

  if (getTransactionsLoading) {
    return (<Loading title="Fetching Transactions ..." />);
  }

  return (
    <Box sx={{ mt: '1.5rem' }}>
      <SummaryTransaction transactions={transactions} />

      <TransactionList transactions={transactions} />

      <AddTransaction />

      <Alert title="Error Occured !" message={alertMessage || ''} openTrigger={!!alertMessage} onCloseHandler={onCloseHandler} />
    </Box>
  );
};

Home.propTypes = {
  user: PropTypes.any,
};

Home.defaultProps = {
  user: null,
};

export default Home;
