import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Design from '../Design';

describe('Design Component', () => {
  test('renders logo and tagline', () => {
    render(
      <BrowserRouter>
        <Design />
      </BrowserRouter>
    );

    // Check if logo is rendered
    const logoElement = screen.getByAltText(/logo/i);
    expect(logoElement).toBeInTheDocument();

    // Check if tagline is present
    const taglineElement = screen.getByText(/Make informed investment decisions aligned with islamic values/i);
    expect(taglineElement).toBeInTheDocument();
  });

  test('renders Log In and Sign Up buttons', () => {
    render(
      <BrowserRouter>
        <Design />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole('button', { name: /log in/i });
    const signupButton = screen.getByRole('button', { name: /sign up/i });

    expect(loginButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });

  test('navigates to login page when Log In button is clicked', () => {
    const mockNavigate = jest.fn();

    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <BrowserRouter>
        <Design />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('navigates to signup page when Sign Up button is clicked', () => {
    const mockNavigate = jest.fn();

    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <BrowserRouter>
        <Design />
      </BrowserRouter>
    );

    const signupButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signupButton);

    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  test('redirects to dashboard if user is already logged in', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'testuser@example.com');

    render(
      <BrowserRouter>
        <Design />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/Dashboard');
  });
});
