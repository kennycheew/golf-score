import React from 'react'
import Link from 'next/link'

import { Context, Container, FullBackground } from '../components/baseComponents'
import Navbar from '../components/Navbar'
import styled from 'styled-components'
import firebase from '../libs/firebase'
import config from '../config'

const rootRef = firebase.database().ref('golfscore')

const TableWrapper = styled.div`
  height: 100vh;
`

const Table = styled.div`
  height: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
`

const TableHead = styled.div`
  width: fit-content;
  margin: auto;
`

const TableBody = styled.div`
  overflow-y: scroll;
  height: 91vh;
  width: fit-content;
  margin: auto;
  ::-webkit-scrollbar { 
    display: none; 
  }
`

const TableRow = styled.div`
  display: flex;
  background: ${props => props.bgColor || 'transparent'};  
`

const TableItem = styled.div` 
  padding: 6px 8px;
  border: 1px solid black;
  overflow: hidden;
  width: ${props => props.width || 'auto'};
  text-align: ${props => props.align || 'center'};
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
  background-color: ${props => props.bgColor || 'transparent'};
  color: ${props => props.color || 'black'};
`

const getSumShot = (data) => {
  let sum = 0
  data.forEach(shot => sum += +shot)
  return sum
}

const checkDiffUserCourt = (userRaw, courtRaw) => {
  const userData = userRaw.filter(data => data)
  const userLength = userData.length
  const courtWithUserlength = courtRaw.slice(0, userLength)
  const sumCourt = getSumShot(courtWithUserlength)
  const sumShot = getSumShot(userData)
  return {
    sumCourt,
    sumShot
  }
}

const tableConfig = ['25px', '200px', '50px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '75px']
  

class Home extends React.Component {  
  constructor(props) {
    super(props)
    this.state = {
      dayDisplay: 'dayThree',
      textDb: null,
      title: '',
      subTitle: '',
      selectedDay: '',
      defaultDay: '1'
    }
    rootRef.child('textDb').on('value', (snapshot) => {
      const data = snapshot.val()
      const updatedTime = Date.now()
      this.setState({ textDb: data, updatedTime })
    })
    rootRef.child('title').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ title: data })
    })
    rootRef.child('subTitle').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ subTitle: data })
    })
    rootRef.child('defaultDay').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ defaultDay: data })
    })

  }

  selectDay(day) {
    this.setState({ selectedDay: day })
  }

  render() {
    if (!this.state.textDb) {
      return (null)
    }
    const row = this.state.textDb.split('""')

    const emptyData = {
      dayOne: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      dayThree: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      dayTwo: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      name: '',
      ranking: '',
      score: ''
    }

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

    let i = 0

    while(i<100) {
      body.push(emptyData)
      i++
    }

    
    const sumCourt = head[this.state.dayDisplay].reduce((a,b) => +a + + b)

    let dayDisplay = 'dayOne'
    if (this.state.selectedDay) {
      if (this.state.selectedDay == 2) dayDisplay = 'dayTwo'
      if (this.state.selectedDay == 3) dayDisplay = 'dayThree'
    } else {
      if (this.state.defaultDay === '2') dayDisplay = 'dayTwo'
      if (this.state.defaultDay === '3') dayDisplay = 'dayThree'
    }
    return (
      <FullBackground color="#cecece">
        <Context>
          <Container>
            <Navbar {...this.props} {...this.state} selectDay={(day) => this.selectDay(day)}/>
            <TableWrapper>
              <Table>
                <TableHead>
                  <TableRow bgColor="linear-gradient(#76af70, white)">
                    <TableItem width={tableConfig[0]}>
                      Pos.
                    </TableItem>
                    <TableItem align="center" width={tableConfig[1]}>
                      Name
                    </TableItem>
                    <TableItem width={tableConfig[2]}>
                      Score
                    </TableItem>
                    {
                      head[dayDisplay ].map((par, index) => {
                        let prefix = 0
                        if (dayDisplay   === 'dayTwo') prefix = 1
                        if (dayDisplay   === 'dayThree') prefix = 2
                        return (
                          <TableItem width={tableConfig[3+index]}>
                            {index + 1  } ({par})
                          </TableItem>
                        )
                      })
                    }
                    <TableItem width={tableConfig[21]}>
                      {
                        dayDisplay   === 'dayOne' ? 'Day 1' : (
                        dayDisplay   === 'dayTwo' ? 'Day 2' : 'Day 3'
                        ) 
                      }
                      <br />({sumCourt})
                    </TableItem>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    body.map((userData, userIndex) => {
                      const shotData = checkDiffUserCourt(userData[dayDisplay], head[dayDisplay])
                      const sumUser = userData[dayDisplay ].reduce((a,b) => +a + + b)
                      let { ranking } = userData
                      if (userIndex != 0 && userData.score === body[userIndex - 1].score ) {
                        ranking = ''
                      }
                      return (
                        <TableRow bgColor={userIndex % 2 === 0 ? '#bbbbbb' : '#a0a0a0'}>
                          <TableItem width={tableConfig[0]}>
                            {ranking}
                          </TableItem>
                          <TableItem align="left" width={tableConfig[1]}>
                            {userData.name}
                          </TableItem>
                          <TableItem color={userData.score < 0 ? 'red' : userData.score > 0 ? 'blue' : null} width={tableConfig[2]}>
                            {
                              userData.score == 0 ? 'E' : userData.score > 0 ? `+${userData.score}` : userData.score
                            }
                          </TableItem>
                          {
                            userData[dayDisplay ].map((hole, index) => {
                              if (hole == head[dayDisplay ][index]) {
                                return (
                                  <TableItem color="white " width={tableConfig[3 + index]} style={{ borderLeft: `1px solid ${index === 9 ? 'white' : 'black '}`, borderRight: `1px solid ${index === 8 ? 'white' : 'black '}`}}>
                                    {hole}
                                  </TableItem>
                                )
                              }
                              if (hole < head[dayDisplay  ][index] - 1 && hole) {
                                return (
                                  <TableItem color="red" bgColor="#e6e66d" width={tableConfig[3 + index]} style={{ borderLeft: `1px solid ${index === 9 ? 'white' : 'black '}`, borderRight: `1px solid ${index === 8 ? 'white' : 'black '}`}}>
                                    {hole}
                                  </TableItem>
                                )
                              }
                              if (hole < head[dayDisplay  ][index]) {
                                return (
                                  <TableItem color="red" width={tableConfig[3 + index]} style={{ borderLeft: `1px solid ${index === 9 ? 'white' : 'black '}`, borderRight: `1px solid ${index === 8 ? 'white' : 'black '}`}}>
                                    {hole}
                                  </TableItem>
                                )
                              }
                              return (
                                  <TableItem width={tableConfig[3 + index]} style={{ borderLeft: `1px solid ${index === 9 ? 'white' : 'black '}`, borderRight: `1px solid ${index === 8 ? 'white' : 'black '}`}}>
                                    {hole}
                                </TableItem>
                              )
                            })
                          }
                          <TableItem color={shotData.sumShot - shotData.sumCourt < 0 ? 'red' : shotData.sumShot - shotData.sumCourt > 0 ? 'blue' : null} width={tableConfig[21]}>
                            {shotData.sumShot - shotData.sumCourt == 0 ? 'E' : shotData.sumShot - shotData.sumCourt > 0 ? `+${shotData.sumShot - shotData.sumCourt}` : shotData.sumShot - shotData.sumCourt}
                            <span style={{color: "black"}}>
                              {` (${shotData.sumShot})`}
                            </span>
                          </TableItem>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableWrapper>
          </Container>
        </Context>
      </FullBackground>
    )
  }
}

export default Home
