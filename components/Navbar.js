import styled from 'styled-components'
import { Base, Container, Image } from './baseComponents'

const NavbarContext = styled.div`
  width: 100%;  
  background-color: #ffaaaa;
`

const FlexWrapper = styled.div`
  display: flex;
`

const TabContainer = styled.div`
  display: flex;
  list-style: none;
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
            <Image src="/static/logo/booky_healthy_world.png" width="68px"/>
          </div>
            <TabContainer>
              <TabItem>
                test
              </TabItem>
              <TabItem>
                test
              </TabItem> 
            </TabContainer>
        </FlexWrapper>
      </Container>
    </NavbarContext>
  )
}

export default Navbar
