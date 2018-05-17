import styled, { css } from 'styled-components'

const button = styled.button`
  padding: 8px 16px;
  border-radius: 16px;
  background: ${props => props.color || 'white'};
`

export default button
