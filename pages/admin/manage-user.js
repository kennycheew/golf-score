import React from 'react'
import Link from 'next/link'

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
    console.log(newPostKey)
    console.log(this.state)
    return (
      <Context>
        <Container>
          <div>
            <Link href="/admin/manage-match">
              <button>manage match</button>
            </Link>
            <Link href="/admin/manage-user">
              <button>manage user</button>
            </Link>
          </div>
          
          <button onClick={() => this.onAddUser()}>add</button>
          <button onClick={() => this.onRemoveUser()}>remove</button>
        </Container>
      </Context>
    )
  }
}

export default Admin
