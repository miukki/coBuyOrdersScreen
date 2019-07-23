import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import COLORS from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  itemContainer: {
    alignSelf: 'stretch',
    padding: scale(10),
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderColor: COLORS.lightGray,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  approveConteiner: {
    flex: 1,
  },
  userInfo: {
    fontSize: scale(15),
    fontWeight: '500',
  },
  approveButton: {
    width: scale(100),
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: scale(16),
  },
});

export default styles;
