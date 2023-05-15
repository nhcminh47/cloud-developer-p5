import React from 'react'
import {
  Confirm
} from 'semantic-ui-react'
interface PopupProps {
  type: string
  title: string
  msg: string
  open: boolean
  handleOpen: Function
}
interface PopupState {
}
export default class Popup extends React.PureComponent<PopupProps, PopupState> {


  render() {
    const { open, type, msg, handleOpen } = this.props;

    return (
      <Confirm
        open={open}
        header={type === 'success' ? 'Success' : 'Failed'}
        content={msg}
        onConfirm={() => handleOpen(false)}
        onCancel={() => handleOpen(false)}
      />
    )
  }
}
