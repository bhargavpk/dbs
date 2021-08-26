import React, { useEffect, useState } from 'react'
import '../css/about.css'


export default function About() {

    const [fetchStatus, changeFetchStatus] = useState(false)
    const [aboutInfo, changeAboutInfo] = useState({})

    const fetchAbout = async () => {
        const res = await fetch('http://localhost:5000/about')
        const data = await res.json()
        if(!data.err)
        {
            changeAboutInfo(data)
            changeFetchStatus(true)
        }
    }

    useEffect(() => {
        if(fetchStatus === false)
            fetchAbout()
    }, [fetchStatus])

    return (
        <div id="about-container">
            {
                fetchStatus===false?
                <div />:
                    <div>
                        <h3>About</h3>
                    <hr />
                    <p>
                        Founded in 2008, the institute strives for academic excellence. Led by {aboutInfo.directorName} as the
                        director, students are nurtured to extract the best out of them.
                        <br />
                        Branches offered are:
                        <ul>
                            {
                                aboutInfo.branchList.map(branch => (
                                    <li>{branch}</li>
                                ))
                            }
                        </ul>
                        Seat matrix, ie., number of seats in available for each branch is:
                        <ul>
                            {
                                aboutInfo.seatMatrix.map(matrix => (
                                    <li style={
                                        {listStyle: "none"}
                                    }>
                                        {matrix[0]+': '+matrix[1]}
                                    </li>
                                ))
                            }
                        </ul>
                    </p>
                </div>
            }
        </div>
    )
}
