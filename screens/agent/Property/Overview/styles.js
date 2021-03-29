import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  actionBtns: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  add: {
    alignSelf: 'center',
  },
  addIcon: {
    width: 32,
    height: 32,
  },
  agencyName: {
    color: '#fff',
    fontFamily: 'font-regular',
  },
  agentsContainer: {
    alignSelf: 'flex-end',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '30%',
  },
  agentImg: {
    borderColor: '#fff',
    borderRadius: 50,
    borderWidth: 1,
    height: 40,
    width: 40,
    marginHorizontal: 15,
  },
  agentName: {
    color: '#ffffff',
    marginTop: 5,
    fontFamily: 'font-light',
    fontSize: 11,
  },
  alignCenter: {
    alignItems: 'center',
  },
  boxText: {
    color: '#000',
    fontFamily: 'font-regular',
    fontSize: 14,
  },
  btnBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 4,
  },
  btnPrimary: {
    fontSize: 11,
    backgroundColor: '#ff3257',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 3,
    borderRadius: 5,
  },
  btnSecondary: {
    fontSize: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: '#000',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 3,
    borderRadius: 5,
  },
  bubble: {
    alignItems: 'center',
    elevation: 4,
    marginHorizontal: 8,
    position: 'relative',
    shadowColor: '#111',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15.19,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  count: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 39,
    justifyContent: 'space-between',
    width: 230,
  },
  cta: {
    alignItems: 'center',
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  equalFlex: {
    flex: 1,
  },
  floorPlan: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    height: 250,
    justifyContent: 'center',
    position: 'relative',
  },
  heroCTA: {
    flex: 1,
    width: '100%',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  info: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  mainVideoCTA: {
    width: '100%',
    height: '70%',
  },
  name: {
    alignItems: 'center',
    backgroundColor: '#000000',
    height: 44,
    justifyContent: 'center',
  },
  noVideosContainer: {
    paddingVertical: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVideosMsg: {
    fontFamily: 'font-light',
    fontSize: 12,
    color: '#bbb',
    fontStyle: 'italic',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  overlayContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  propertyInfo: {
    fontFamily: 'font-light',
    paddingVertical: 3,
  },
  propertyInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stat: {
    fontFamily: 'font-regular',
    fontSize: 20,
  },
  statsContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statText: {
    fontFamily: 'font-regular',
    fontSize: 12,
  },
  text: {
    color: '#fff',
    fontFamily: 'font-regular',
    fontSize: 18,
    marginTop: 8,
  },
  textWhite: {
    color: '#fff',
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
  },
  textInput: {
    marginTop: 10,
    marginBottom: 15,
  },
  textInputAndroid: {
    color: 'rgba(0, 0, 0, 0.99)',
    fontFamily: 'font-light',
    fontSize: 15,
    paddingHorizontal: 28,
    paddingVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  textInputIOS: {
    borderColor: 'transparent',
    borderWidth: 0.5,
    borderRadius: 6,
    color: 'rgba(0, 0, 0, 0.99)',
    fontFamily: 'font-light',
    fontSize: 14,
    paddingHorizontal: 26,
    paddingVertical: 6,
    marginHorizontal: 10,
    backgroundColor: '#f1f1f1',
  },
});

export default styles;
