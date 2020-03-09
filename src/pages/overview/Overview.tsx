import React from 'react'

import styled from 'src/styles/styled'

const Div = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1.5rem;
`

export default function Overview() {
  return (
    <Div className="Overview">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
    </Div>
  )
}
