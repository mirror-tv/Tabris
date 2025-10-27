import { gql } from '@apollo/client'

export const getMembersQuery = gql`
  query getMembers($where: MemberWhereInput) {
    members(where: $where) {
      id
      firebaseID
      email
      name
      mobile
      state
    }
  }
`

export const checkMemberByEmailQuery = gql`
  query checkMemberByEmail($where: MemberWhereInput) {
    members(where: $where) {
      id
      email
      state
    }
  }
`

export const checkMemberByPhoneQuery = gql`
  query checkMemberByPhone($where: MemberWhereInput) {
    members(where: $where) {
      id
      mobile
      state
    }
  }
`
