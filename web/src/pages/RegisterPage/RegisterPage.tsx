// import { Link, routes } from '@redwoodjs/router'
import { Metadata, useMutation } from '@redwoodjs/web'
import {
  Form,
  TextField,
  Label,
  FieldError,
  PasswordField,
  Submit,
  SubmitHandler,
} from '@redwoodjs/forms'
import './RegisterPage.css'
import { navigate } from '@redwoodjs/router'
import RootGuard from 'src/components/RootGuard/RootGuard'
import Spinner from 'src/components/Spinner/Spinner'
import { useState } from 'react'

const REGISTER_USER = gql`
  mutation RegisterUserMutation ($input: RegisterUser!) {
    registerUser(input: $input) {
      code,
      message
    }
  }
`

interface FormValues {
  email: String
  password: String
  confirmpass: String
  username: String
}

const RegisterPage = () => {
  const [loading, setLoading] = useState(null)
  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      setLoading(false)
      const { code, message } = data.registerUser
      if (code === 201){
        // Success
        console.log("here")
        alert(message)
        navigate('/login')
      } else {
        console.log("here")
        alert(`Error: ${message}`)
      }
    },
    onError: (error) => {
      setLoading(false)
      alert(`Unexpected Error: ${error.message}`)
    }
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (data.password !== data['confirm password']){
      alert('Passwords do not match!')
      return
    }

    setLoading(true)

    // Send a registerUser mutation.
    registerUser({
      variables: {
        input: {
          email: data.email,
          username: data.username,
          password: data.password,
        },
      },
    })
  }

  return (
    <RootGuard>
      {loading ? (
        <Spinner />
      ) : (
        <div className="home">
          <Metadata title="Register" description="Register page" />
          <h1 className="title">Ready to Start Acing Your Applications?</h1>
          <br></br>
          <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
            <Label className="login-label" name="username" errorClassName="error">
              Username
            </Label>
            <TextField
              name="username"
              validation={{required : true}}
              errorClassName="error-field"
              className="field"
            />
            <FieldError name="username" className="error" />
            <Label className="login-label" name="email" errorClassName="error">
              Email
            </Label>
            <TextField
              name="email"
              validation={{ required : true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ }}
              errorClassName="error-field"
              className="field"
            />
            <FieldError name="email" className="error" />
            <Label className="login-label" name="password" errorClassName="error">
              Password
            </Label>
            <PasswordField
              name="password"
              validation={{ required : true }}
              errorClassName="error-field"
              className="field"
            />
            <FieldError name="password" className="error" />
            <Label className="login-label" name="confirm password" errorClassName="error">
              Confirm Password
            </Label>
            <PasswordField
              name="confirm password"
              validation={{ required: true }}
              errorClassName="error-field"
              className="field"
            />
            <FieldError name="confirm password" className="error" />
            <div className="separator"></div>
            <Submit data-testid="submit-sign-up" className="button-reg">Sign Up</Submit>
            <div className="separator"></div>
            <button
              type="button"
              className="button-reg"
              onClick={() => navigate('/login')}
            >
            Returning User?
            </button>
          </Form>
        </div>
      )}
    </RootGuard>
  )
}

export default RegisterPage
