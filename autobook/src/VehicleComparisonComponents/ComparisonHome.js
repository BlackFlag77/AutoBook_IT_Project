import NavBar from '../Common/NavBar';
import VehicleSearch from './VehicleSearch';
import AnyMissingVehicle from './AnyMissingVehicle';
import VehicleCompareSearch from "./VehicleCompareSearch"
import { Link } from 'react-router-dom'

export default function ComparisonHome() {
    return (
        <div className='vc-homepage-container'>
            <NavBar />
            <h1 className='homepage-first-title'>Let's find your perfect car</h1>
            <h2 className='homepage-second-title'>Compare cars side by side</h2>
            <VehicleSearch />
            <AnyMissingVehicle />
            <VehicleCompareSearch />
            

           {/*<h1><button><Link to='/vehicledetails'>Display vehicles</Link></button></h1> */} 
            
        </div>
    );
}


