import Link from 'next/link'
import styled from 'styled-components'
import { Base, Container, Image } from './baseComponents'

const NavbarContext = styled.div`
  width: 100%;  
  background-color: #f3ffe6;
`

const FlexWrapper = styled.div`
  display: flex;
  
`

const TabContainer = styled.div`
  display: flex;
  list-style: none;
  height: 40px;sss
`

const TabItem = styled.div` 
  ${Base}
  float: left;
`

const Navbar = (props) => {
  return (
    <NavbarContext>
      <Container>
        <FlexWrapper>
          <div>
            <Image src="/static/logo/logo_spga.png" width="40px"/>
          </div>
          <FlexWrapper style={{ 'flex-direction': "column"}}>
            <div style={{paddingLeft: '12px', fontSize: '24px'}}>
              Artitaya Senior Championship
            </div>
            <TabContainer>
              <TabItem>
                <Link href="/?d=1">
                  Day 1
                </Link>
              </TabItem>
              <TabItem>
                <Link href="/?d=2">
                  Day 2
                </Link>
              </TabItem> 
              <TabItem>
                <Link href="/?d=3">
                  Day 3
                </Link>
              </TabItem> 
            </TabContainer>
          </FlexWrapper>
        </FlexWrapper>
      </Container>
    </NavbarContext>
  )
}

export default Navbar
