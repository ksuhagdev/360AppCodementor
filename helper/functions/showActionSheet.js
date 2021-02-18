export function showActionSheet({ options, showActionSheetWithOptions, cancelButtonIndex, destructiveButtonIndex, handleOnPress }) {
  const textStyle = {
    fontFamily: 'font-regular',
    fontSize: 15,
    flex: 1,
  };
  showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex,
      destructiveButtonIndex,
      textStyle,
    },
    buttonIndex => {
      handleOnPress(buttonIndex);
    },
  );
}
