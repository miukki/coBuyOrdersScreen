import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { connect } from 'react-redux';

import CoBuyOrders from './CoBuyOrders';
import withPaypalStateListening from '../../components/PaypalStateListenerHOC';

import { approveCoBuyAction, coBuyJoinerPayAction, setOrderId } from '../../redux/actions';
import { isCoBuyOrderClosed as isCoBuyOrderClosedSelector } from '../../selectors';
import { coBuyOrderAction as coBuyOrderActionLoading } from '../../constants/loaders';
import { PAYPAL_CHECKOUT } from '../../constants/endpoints';

@withPaypalStateListening
@connect(state => ({
  orders: state.orders.coBuyOrders,
  userId: state.user.id,
  loading: state.loader[coBuyOrderActionLoading],
  isCoBuyOrderClosed: isCoBuyOrderClosedSelector(state),
  sizes: state.dictionaries.sizes,
  orderId: state.orders.orderId,
}), ({ approveCoBuyAction, coBuyJoinerPayAction, setOrderId }))
export default class CoBuyOrdersScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    orders: PropTypes.array,
    sizes: PropTypes.array,
    userId: PropTypes.any,
    approveCoBuyAction: PropTypes.func,
    isCoBuyOrderClosed: PropTypes.bool,
    loading: PropTypes.any,
    coBuyJoinerPayAction: PropTypes.func,
    orderId: PropTypes.number,
    isFocused: PropTypes.bool,
    setOrderId: PropTypes.func,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.orderId !== this.props.orderId && this.props.orderId !== null && this.props.isFocused) {
      Linking.openURL(`${PAYPAL_CHECKOUT}/${this.props.orderId}`);
    }
  }

  componentWillUnmount() {
    const fromChat = this.props.navigation.getParam('fromChat');
    if (!fromChat) {
      this.props.setOrderId(null);
    }
  }

  onBackPress = () => {
    this.props.navigation.goBack();
  }

  onApprovePress = (orderId, listingId, userId, proceedWithPayment) => () => {
    if (this.props.orderId) {
      Linking.openURL(`${PAYPAL_CHECKOUT}/${this.props.orderId}`);
      return;
    }
    this.props.approveCoBuyAction({ orderId, listingId, userId, proceedWithPayment });
  }

  onPickUpPress = (orderId, listingId, userId) => () => {
    this.props.approveCoBuyAction({
      orderId,
      listingId,
      userId,
      type: 'pickup',
    });
  }

  onJoinerPayPress = (orderId, listingId, userId) => () => {
    if (this.props.orderId) {
      Linking.openURL(`${PAYPAL_CHECKOUT}/${this.props.orderId}`);
      return;
    }
    this.props.coBuyJoinerPayAction({ orderId, listingId, userId });
  }

  render() {
    const {
      orders, userId, isCoBuyOrderClosed, loading, sizes,
    } = this.props;
    return (
      <CoBuyOrders
        onBackPress={this.onBackPress}
        orders={orders}
        userId={userId}
        onApprovePress={this.onApprovePress}
        onPickUpPress={this.onPickUpPress}
        isCoBuyOrderClosed={isCoBuyOrderClosed}
        loading={loading}
        sizes={sizes}
        onJoinerPayPress={this.onJoinerPayPress}
      />
    );
  }
}
