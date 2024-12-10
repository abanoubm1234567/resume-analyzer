export const schema = gql`

  type UploadResponse {
    message: String
    status: String!
    error: String
  }

  input UploadInput {
    file: File!
    sessionID: String!
  }

  type Mutation {
    resumeUpload(input: UploadInput!): UploadResponse! @requireAuth
  }
`
