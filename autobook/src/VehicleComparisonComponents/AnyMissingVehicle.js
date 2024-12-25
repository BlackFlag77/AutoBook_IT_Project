import React from 'react'
import { Link } from 'react-router-dom'
function AnyMissingVehicle() {
  return (
    <div>
        <h4>Any missing vehicle? <Link to='/addnewvehicle'>Add Now!</Link></h4>
    </div>
  )
}

export default AnyMissingVehicle