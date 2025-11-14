import { gql } from '@apollo/client'

export const updateMemberIdentityMutation = gql`
  mutation UpdateMemberIdentity(
    $where: MemberWhereUniqueInput!
    $data: MemberUpdateInput!
  ) {
    updateMember(where: $where, data: $data) {
      id
      nationalId
      residentialAddress
    }
  }
`
