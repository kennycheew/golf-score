import Link from 'next/link'
import styled from 'styled-components'
import { Base, Container, Image, Button } from './baseComponents'

const NavbarContext = styled.div`
  width: 100%;  
`

const NavbarContainer = styled.div`
  max-width: 1196px;
  background-color: #f3ffe6;
  margin: auto;
`

const FlexWrapper = styled.div`
  display: flex;
  
`

const TabContainer = styled.div`
  display: flex;
  list-style: none;
  padding-left: 12px;
`

const TabItem = styled.div`
  float: left;
`

const Navbar = (props) => {
  const tabList = [
    {
      text: 'Day 1',
      color: 'white',
      link: '1'
    },
    {
      text: 'Day 2',
      color: 'white',
      link: '2'
    },
    {
      text: 'Day 3',
      color: 'white',
      link: '3'
    }
  ]
  if (props.url.query.d) {
    tabList[+props.url.query.d - 1].color = '#d2d2d2'
  }
  return (
    <NavbarContext>
      <NavbarContainer>
        <FlexWrapper>
          <div>
            <Image src="/static/logo/logo_spga.png" width="56px"/>
          </div>
          <FlexWrapper style={{ 'flex-direction': "column"}}>
            <div style={{paddingLeft: '12px', fontSize: '24px'}}>
              {props.title}
            </div>
            <div style={{paddingLeft: '12px', fontSize: '16px'}}>
              {props.subTitle}
            </div>
            <TabContainer>
              {
                tabList.map(item => (
                  <TabItem>
                    <Link href={`/?d=${item.link}`}>
                      <Button color={item.color}>
                        {item.text}
                      </Button>
                    </Link>
                  </TabItem>
                ))
              }
            </TabContainer>
          </FlexWrapper>
        </FlexWrapper>
      </NavbarContainer>
    </NavbarContext>
  )
}

export default Navbar
