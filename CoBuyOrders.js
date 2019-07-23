import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import DefaultHeader from '../../components/DefaultHeader';
import ListingComponent from '../../components/ListingComponent';
import DefaultButton from '../../components/DefaultButton';
import DefaultText from '../../components/DefaultText';

import styles from './styles';

export default class CoBuyOrders extends Component {
  static propTypes = {
    onBackPress: PropTypes.func,
    orders: PropTypes.array,
    userId: PropTypes.any,
    onApprovePress: PropTypes.func.isRequired,
    isCoBuyOrderClosed: PropTypes.bool,
    onPickUpPress: PropTypes.func,
    loading: PropTypes.any,
    sizes: PropTypes.array,
    onJoinerPayPress: PropTypes.func,
  }

  renderApproveButton = (item) => {
    const {
      userId, isCoBuyOrderClosed, onApprovePress, onPickUpPress, loading, onJoinerPayPress,
    } = this.props;

    let showApproveButton = false;
    let action = null;
    let title = 'Approve';

    if (isCoBuyOrderClosed) {
      if (item.status === 'JOINER_SHOULD_PAY') {
        showApproveButton = userId === item.userId;
        title = 'Pay';
        action = onJoinerPayPress(item.id, item.listingId, item.userId);
      } else if (item.status === 'CO_BUY_WAITING_FOR_TURN') {
        const ownerOrder = this.props.orders.find(order => order.ownerId === order.userId);
        if (ownerOrder && ownerOrder.status === 'YOUR_TURN') {
          showApproveButton = userId === item.userId;
          title = 'Received';
          action = onPickUpPress(item.id, item.listingId, item.userId);
        }
      } else if (item.status === 'OWNER_SHOULD_PAY') {
        showApproveButton = userId === item.ownerId;
        if (showApproveButton) {
          const cobuyerOrder = this.props.orders.find(order => order.status !== 'CO_BUY_JOINT' && order.ownerId !== order.userId);
          const cobuyerId = cobuyerOrder && cobuyerOrder.userId;
          title = 'Pay';
          action = onApprovePress(item.id, item.listingId, cobuyerId, true);
        }
      }
    } else {
      showApproveButton = userId === item.ownerId && userId !== item.userId;
      if (showApproveButton && item.status !== 'CO_BUY_JOINT') {
        showApproveButton = false;
      }
      // add paypal
      action = onApprovePress(item.id, item.listingId, item.userId);
    }

    if (!showApproveButton) return null;

    const disabled = !!loading;
    const isLoadingOrder = loading === item.id;

    return (
      <View style={styles.approveConteiner}>
        <DefaultButton
          onPress={action}
          title={title}
          style={styles.approveButton}
          textStyle={styles.buttonText}
          loading={isLoadingOrder}
          disabled={disabled}
          showDisabled={!isLoadingOrder}
        />
      </View>
    );
  }

  renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <DefaultText style={styles.userInfo}>
          {item.userName}
        </DefaultText>
        <DefaultText small>
          {item.statusLabel}
        </DefaultText>
      </View>
      {this.renderApproveButton(item)}
    </View>
  )

  render() {
    const { onBackPress, orders, loading, sizes } = this.props;

    return (
      <View style={styles.container}>
        <DefaultHeader
          title='STATUS'
          leftIconProps={{
            name: 'ios-arrow-back',
            type: 'Ionicons',
          }}
          onLeftPress={onBackPress}
        />
        <View style={{ flex: 1 }}>
          <ListingComponent
            data={orders}
            renderList={this.renderItem}
            extraData={loading}
            sizes={sizes}
          />
        </View>
      </View>
    );
  }
}
