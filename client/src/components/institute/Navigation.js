import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import { Redirect } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'

export default function Navigation() {

    const [isLoggedIn, changeLoggedStatus] = useState(true)
    
    const logout = () => {
        const cookie = new Cookies()
        cookie.remove('idToken')
        changeLoggedStatus(false)
    }

    return (
        isLoggedIn===false?
        <Redirect to="/" />:
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div id="nav-container">
                <div />
                <div id="nav-logout-container">
                        <Button
                        variant="danger"
                        onClick={logout}
                        >
                            Log out
                        </Button>
                </div>
            </div>
        </nav>
    )
}
