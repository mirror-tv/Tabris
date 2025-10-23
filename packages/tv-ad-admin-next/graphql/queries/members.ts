/**
 * Member 查詢 GraphQL queries
 */

export const GET_MEMBERS_QUERY = `
  query GetMembers($where: MemberWhereInput) {
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

export const CHECK_MEMBER_BY_EMAIL_QUERY = `
  query GetMembers($where: MemberWhereInput) {
    members(where: $where) {
      id
      email
      state
    }
  }
`

export const CHECK_MEMBER_BY_PHONE_QUERY = `
  query GetMembers($where: MemberWhereInput) {
    members(where: $where) {
      id
      mobile
      state
    }
  }
`
