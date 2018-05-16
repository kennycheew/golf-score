import React from 'react'
import { Context, Container } from '../../components/baseComponents'
import styled from 'styled-components'
import firebase from '../../libs/firebase'

const rootRef = firebase.database().ref('golfscore')

const Table = styled.table`
  border-collapse: collapse;
` 

const TableRow = styled.tr`
  border-collapse: collapse;
`

const TableItem = styled.td`
  border-collapse: collapse;
`
class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    rootRef.on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ ...data })
    })
  }

  onAddUser() {
    const userList = this.state.users || []
    userList.push({
      _id: "0001",
      firstName: "kenny",
      lastName: "cheew",
      score: [0, 0, 0, 0]
    })
    rootRef.child('/users/').set(userList)
    // const newPostKey = rootRef.child('/users/').push().parent;
    // console.log(newPostKey)   
    // const updates = {}  
    // updates['/users/' + newPostKey] = {
    //   _id: "0001",
    //   firstName: "kenny",
    //   lastName: "cheew",
    //   score: [0, 0, 0, 0]
    // } 
    // rootRef.update(updates)
  }

  onRemoveUser() {
    const userList = this.state.users || []
    userList.pop()
    rootRef.child('/users/').set(userList)
  }

  render() {
    const newPostKey = rootRef.child('/users/').push().key;
    return (
      <Context>
        <Container>
          alsjdfklajsdhflkasd
          <Table>
            <TableRow>
              <TableItem>
                Order
              </TableItem>
              <TableItem>
                Name
              </TableItem>
              <TableItem>
                Score
              </TableItem>
              <TableItem>
                1
              </TableItem>
              <TableItem>
                2
              </TableItem>
              <TableItem>
                3
              </TableItem>
              <TableItem>
                4
              </TableItem>
              <TableItem>
                5
              </TableItem>
              <TableItem>
                6
              </TableItem>
              <TableItem>
                7
              </TableItem>
              <TableItem>
                8
              </TableItem>
              <TableItem>
                9
              </TableItem>
              <TableItem>
                10
              </TableItem>
              <TableItem>
                11
              </TableItem>
              <TableItem>
                12
              </TableItem>
              <TableItem>
                13
              </TableItem>
              <TableItem>
                14
              </TableItem>
              <TableItem>
                15
              </TableItem>
              <TableItem>
                16
              </TableItem>
              <TableItem>
                17
              </TableItem>
              <TableItem>
                18
              </TableItem>
              <TableItem>
                Today
              </TableItem>
            </TableRow>
            {
              this.state.users && this.state.users.map((data, index) => {
                  return (
                    <TableRow>
                      <TableItem>
                        {index + 1}
                      </TableItem>
                      <TableItem>
                        {data.firstName + ' ' + data.lastName }
                      </TableItem>  
                    </TableRow>
                  )
              })
            }
          </Table>
          <textarea>s</textarea>
          <button onClick={() => this.onAddUser()}>add</button>
          <button onClick={() => this.onRemoveUser()}>remove</button>
        </Container>
      </Context>
    )
  }
}

export default Admin
