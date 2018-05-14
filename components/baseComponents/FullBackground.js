import PropTypes from 'prop-types'
import React from 'react'

//provides full height background color paint
class FullBackground extends React.Component {
  componentWillMount() { this.setup({ color: this.props.color, height: '100%', image: this.props.image }) }
  // componentWillUnmount() { this.setup({ color: 'initial', height: 'initial', image: 'initial' }) }

  setup(styles) {
    const {color, height, image} = styles
    try { 
      document.getElementsByTagName('html')[0].style.backgroundColor = color
      document.getElementsByTagName('html')[0].style.backgroundImage = image
      document.getElementsByTagName('html')[0].style.height = height
    }
    catch (e) {}
  }
  render() {
    const { children } = this.props
    return (children === undefined) ?
      null : Array.isArray(children) ?
      <div>{children}</div> : children
  }
}

FullBackground.propTypes = {
  color: PropTypes.string,
  image: PropTypes.string
}

FullBackground.defaultProps = {
  color: 'white',
  image: ''
}

export default FullBackground