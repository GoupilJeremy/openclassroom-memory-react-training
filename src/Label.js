import React from 'react'
import PropTypes from 'prop-types'

const Label = ({ value }) => (
  <span>{value}</span>
)

Label.propTypes = {
  value: PropTypes.number.isRequired,
}

export default Label