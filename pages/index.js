import React from 'react'
import Link from 'next/link'

import { Context, Container, FullBackground } from '../components/baseComponents'
import Navbar from '../components/Navbar'
import styled from 'styled-components'
import firebase from '../libs/firebase'
import config from '../config'

const rootRef = firebase.database().ref('golfscore')

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  ${props => props.fix && 'position: fixed; top: 0; display: none;'}
  ${props => props.displayHead && 'display: table;'}
`

const TableRow = styled.tr`
  background: ${props => props.bgColor || 'transparent'};
  border-collapse: collapse;
`

const TableItem = styled.td`
  min-width: 32px;
  text-align: ${props => props.align || 'center'};
  border: 1px solid black;
  border-collapse: collapse;
  color: ${props => props.color || 'black'};
  background-color: ${props => props.bgColor || 'transparent'};
`

const getSumShot = (data) => {
  return data.reduce((a,b) => +a + + b)
}

const checkDiffUserCourt = (userRaw, courtRaw) => {
  const userLength = userRaw.length
  const courtWithUsrtlength = courtRaw.slice(0, userLength)
  const sumCourt = courtWithUsrtlength.reduce((a,b) => +a + + b)
  const sumUser = getSumShot(userRaw)
}


class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dayDisplay: 'dayThree',
      displayHead: false,
      textDb: null
    }
    rootRef.child('textDb').on('value', (snapshot) => {
      const data = snapshot.val()
      const updatedTime = Date.now()
      this.setState({ textDb: data, updatedTime })
    })
    this.onScroll = this.onScroll.bind(this)

  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll(e) {
    if (window.scrollY > 60) {
      this.setState({ displayHead: true })
    } else {
      this.setState({ displayHead: false })
    }
  }
  
  render() {
    if (!this.state.textDb) {
      return (null)
    }
    const row = this.state.textDb.split('""')

    const data = row.map(rowData => {
      const splitData = rowData.split('	')
      const userData = {}
      userData.ranking = splitData[1]
      userData.score = splitData[2]
      userData.name = splitData[3]
      if (splitData[3]) {
        userData.name = splitData[3].replace(/"/g, '')
      }
      userData.dayOne = []
      for (const i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]) {
        userData.dayOne.push(splitData[3+i])
      }
      userData.dayTwo = []
      for (const i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]) {
        userData.dayTwo.push(splitData[3+18+i])
      }
      userData.dayThree = []
      for (const i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]) {
        userData.dayThree.push(splitData[3+18+18+i])
      }
      return userData
    })
    const head = data[0]
    const body = data.slice(1)
    body.pop()
    
    const sumCourt = head[this.state.dayDisplay].reduce((a,b) => +a + + b)

    let dayDisplay = 'dayOne'
    if (this.props.url.query.d == 2) dayDisplay = 'dayTwo'
    if (this.props.url.query.d == 3) dayDisplay = 'dayThree'
    return (
      <FullBackground color="#cecece">
        <Context>
          <Container>
            <Navbar {...this.props}/>
            {/* <div>
              {`Last update: ${this.state.updatedTime.getHours()}:  ${this.state.updatedTime.getMinutes() }:${this.state.updatedTime.getSeconds()}`}
            </div> */}
            {/* <div>
              <button onClick={() => this.setState({ dayDisplay: 'dayOne' })}>day 1</button>

              <button onClick={() => this.setState({ dayDisplay: 'dayTwo' })}>day 2</button>

              <button onClick={() => this.setState({ dayDisplay: 'dayThree' })}>day 3</button>
            </div> */}
            <div>
              <Table fix displayHead={this.state.displayHead}>
                <thead> 
                  <TableRow bgColor="linear-gradient(#76af70, white)" displayHead={this.state.displayHead} >
                    <TableItem>
                      Pos.
                    </TableItem>
                    <TableItem align="center">
                      Name
                    </TableItem>
                    <TableItem>
                      Score
                    </TableItem>
                    {
                      head[dayDisplay ].map((par, index) => {
                        let prefix = 0
                        if (dayDisplay   === 'dayTwo') prefix = 1
                        if (dayDisplay   === 'dayThree') prefix = 2
                        // return (
                        //   <TableItem>
                        //     {index + 1 + (18 * prefix)}<br />({par})
                        //   </TableItem>
                        // )
                        return (
                          <TableItem>
                            {index + 1  }<br />({par})
                          </TableItem>
                        )
                      })
                    }
                    <TableItem>
                      {
                        dayDisplay   === 'dayOne' ? 'Day 1' : (
                        dayDisplay   === 'dayTwo' ? 'Day 2' : 'Day 3'
                        )
                      }
                      <br />({sumCourt})
                    </TableItem>
                  </TableRow>
                </thead>
                <tbody style={{ visibility: 'collapse'  }}>
                  {
                    body.map((userData, userIndex) => {
                      const sumUser = userData[dayDisplay ].reduce((a,b) => +a + + b)
                      return (
                        <TableRow bgColor={userIndex % 2 === 0 ? '#b1b9b1' : '#7da0a5'}>
                          <TableItem>
                            {userData.ranking}
                          </TableItem>
                          <TableItem align="left">
                            {userData.name}
                          </TableItem>
                          <TableItem color={userData.score < 0 ? 'red' : userData.score > 0 ? 'blue' : null}>
                            {
                              userData.score == 0 ? 'E' : userData.score > 0 ? `+${userData.score}` : userData.score
                            }
                          </TableItem>
                          {
                            userData[dayDisplay ].map((hole, index) => {
                              if (hole == head[dayDisplay ][index]) {
                                return (
                                  <TableItem color="white ">
                                    {hole}
                                  </TableItem>
                                )
                              }
                              if (hole < head[dayDisplay  ][index] - 1 && hole) {
                                return (
                                  <TableItem color="red" bgColor="#e6e66d">
                                    {hole}
                                  </TableItem>
                                )
                              }
                              if (hole < head[dayDisplay  ][index]) {
                                return (
                                  <TableItem color="red">
                                    {hole}
                                  </TableItem>
                                )
                              }
                              return (
                                <TableItem>
                                  {hole}
                                </TableItem>
                              )
                            })
                          }
                          <TableItem color={sumUser - sumCourt < 0 ? 'red' : sumUser - sumCourt > 0 ? 'blue' : null}>
                            {sumUser - sumCourt == 0 ? 'E' : sumUser - sumCourt > 0 ? `+${sumUser - sumCourt}` : sumUser - sumCourt}
                            <span style={{color: "black"}}>
                              {` (${sumUser})`}
                            </span>
                          </TableItem>
                        </TableRow>
                      )
                    })
                  }
                </tbody>
              </Table>
              <Table>
                <thead> 
                  <TableRow bgColor="linear-gradient(#76af70, white)" displayHead={this.state.displayHead} >
                    <TableItem>
                      Pos.
                    </TableItem>
                    <TableItem align="center">
                      Name
                    </TableItem>
                    <TableItem>
                      Score
                    </TableItem>
                    {
                      head[dayDisplay ].map((par, index) => {
                        let prefix = 0
                        if (dayDisplay   === 'dayTwo') prefix = 1
                        if (dayDisplay   === 'dayThree') prefix = 2
                        // return (
                        //   <TableItem>
                        //     {index + 1 + (18 * prefix)}<br />({par})
                        //   </TableItem>
                        // )
                        return (
                          <TableItem>
                            {index + 1  }<br />({par})
                          </TableItem>
                        )
                      })
                    }
                    <TableItem>
                      {
                        dayDisplay   === 'dayOne' ? 'Day 1' : (
                        dayDisplay   === 'dayTwo' ? 'Day 2' : 'Day 3'
                        )
                      }
                      <br />({sumCourt})
                    </TableItem>
                  </TableRow>
                </thead>
                {
                  body.map((userData, userIndex) => {
                    const sumUser = userData[dayDisplay ].reduce((a,b) => +a + + b)
                    return (
                      <TableRow bgColor={userIndex % 2 === 0 ? '#b1b9b1' : '#7da0a5'}>
                        <TableItem>
                          {userData.ranking}
                        </TableItem>
                        <TableItem align="left">
                          {userData.name}
                        </TableItem>
                        <TableItem color={userData.score < 0 ? 'red' : userData.score > 0 ? 'blue' : null}>
                          {
                            userData.score == 0 ? 'E' : userData.score > 0 ? `+${userData.score}` : userData.score
                          }
                        </TableItem>
                        {
                          userData[dayDisplay ].map((hole, index) => {
                            if (hole == head[dayDisplay ][index]) {
                              return (
                                <TableItem color="white ">
                                  {hole}
                                </TableItem>
                              )
                            }
                            if (hole < head[dayDisplay  ][index] - 1 && hole) {
                              return (
                                <TableItem color="red" bgColor="#e6e66d">
                                  {hole}
                                </TableItem>
                              )
                            }
                            if (hole < head[dayDisplay  ][index]) {
                              return (
                                <TableItem color="red">
                                  {hole}
                                </TableItem>
                              )
                            }
                            return (
                              <TableItem>
                                {hole}
                              </TableItem>
                            )
                          })
                        }
                        <TableItem color={sumUser - sumCourt < 0 ? 'red' : sumUser - sumCourt > 0 ? 'blue' : null}>
                          {sumUser - sumCourt == 0 ? 'E' : sumUser - sumCourt > 0 ? `+${sumUser - sumCourt}` : sumUser - sumCourt}
                          <span style={{color: "black"}}>
                            {` (${sumUser})`}
                          </span>
                        </TableItem>
                      </TableRow>
                    )
                  })
                }
              </Table>
            </div>
          </Container>
        </Context>
      </FullBackground>
    )
  }
}

export default Home
