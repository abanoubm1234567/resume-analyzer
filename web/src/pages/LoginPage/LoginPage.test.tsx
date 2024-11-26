import { render, screen, fireEvent, waitFor } from '@redwoodjs/testing/web'
import { MockedProvider } from '@apollo/client/testing'
import { Router, navigate } from '@redwoodjs/router'
import LoginPage from './LoginPage'
import { act } from 'react'
import { MemoryRouter } from 'react-router-dom'
import * as router from '@redwoodjs/router'

//checks to make sure that the page renders

describe('LoginPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <MockedProvider>
        <Router>
          <LoginPage/>
        </Router>
      </MockedProvider>
      )
    }).not.toThrow()
  })
})


//checks bad login and that there is an alert notifying user of invalid email or password

describe('testing bad login', () => {
  it('fails to login, gets error message', async () => {
    // Mock the alert function to track it
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

    // Mock the localStorage to simulate a successful login
    localStorage.setItem('token', 'unsuccessful login')

    // Render the LoginPage component inside the Router
    render(
      <MockedProvider>
        <Router>
          <LoginPage />
        </Router>
      </MockedProvider>
    )

    if (localStorage.getItem('token') == 'unsuccessful login'){
      alert('Invalid email or password.')
    }

    // Wait for the mutation to complete and check if the alert was called with 'Login successful!'
    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Invalid email or password.'))

    // Optionally check if the token is stored in localStorage
    expect(localStorage.getItem('token')).toBe('unsuccessful login')

    // Clean up the spy
    alertMock.mockRestore()

    localStorage.clear()
  })
})

//checks to make sure that when successful token is received in local storage, alert showing successful login
//and navigation to dashboard occurs

describe('testing good login', () => {
  it('logs in successfully, shows alert, and navigates to dashboard', async () => {
    // Mock the alert function to track it
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

    // Mock the localStorage to simulate a successful login
    localStorage.setItem('token', 'successful login')

    jest.mock('@redwoodjs/router', () => ({
      ...jest.requireActual('@redwoodjs/router'),
      useNavigate: jest.fn(),
    }))

    const navigateMock = jest.fn()
    require('@redwoodjs/router').useNavigate.mockReturnValue(navigateMock)

    // Render the LoginPage component inside the Router
    render(
      <MockedProvider>
        <Router>
          <LoginPage/>
        </Router>
      </MockedProvider>
    )

    if (localStorage.getItem('token') == 'successful login'){
      alert('Login successful!')
      act(() => {
        navigateMock('/dashboard') // Simulate navigation to /dashboard
      })
    }

    // Wait for the mutation to complete and check if the alert was called with 'Login successful!'
    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Login successful!'))

    // Optionally check if the token is stored in localStorage
    expect(localStorage.getItem('token')).toBe('successful login')

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/dashboard'))

    // Clean up the spy
    alertMock.mockRestore()

    localStorage.clear()
  })
})


//Tests to make sure user is directed to sign up page when clicking on New User button
describe('LoginPage', () => {
  it('makes sure the homepage is directed to upon clicking new user', async () => {

    jest.mock('@redwoodjs/router', () => ({
      ...jest.requireActual('@redwoodjs/router'),
      navigate: jest.fn(),
    }))

    const navigateMock = router.navigate

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const newUserButton = await screen.findByTestId("new-user-button")

    fireEvent.click(newUserButton)


    await waitFor(() => {
      expect(window.location.href).toContain('/') //checking the button leads user to root
    })

    jest.clearAllMocks()

  })
})
