import { Link } from "react-router-dom";

function Navbar() {
    /* old code to refresh page without react dom routing */
    // const handleRefresh = (event) => {
    //     event.preventDefault(); // Default anchor tag link behavior is disabled essentially
    //     window.location.reload();
    // }

    return (
        <div className="nav-bar">
            <nav className="nav-items">
                {/* <p><a href="./src/index.html" onClick={handleRefresh}>Look at these Silly Cats</a></p> */}
                <Link to={window.location.pathname} className="refreshLink">Look at these Silly Cats</Link>
                <ul className="nav-ul">
                    <li><a href="https://thecatapi.com/" target="_blank">Cat API Info</a></li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar;