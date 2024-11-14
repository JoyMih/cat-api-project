// *** PLEASE READ: The fetch(), .then(), .json(), async, await, Promise.all(), Promise.any() are in the worker.js file in the PUBLIC FOLDER
// *** NAVIGATE TO PUBLIC FOLDER. NAVIGATE TO WORKER.JS!

import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
/* Validate the props passed to a component. This ensures that the component receives the correct types of props and helps catch potential bugs */
import './../App.css';
import catLogo from './../assets/catLogo.png';
// import { catUrl } from '../secrets/catApiUrl'; // Note: This has been disabled due to conflict with deployment on the live netlify link. Instead we will be inputting the api endpoint directly below.

function MainContent({ message }) {
    const cardRef = useRef(null); // useRef for storing persisting elements and data without triggering re-renders
    const btnRef = useRef(null); // useRef for storing persisting elements and data without triggering re-renders
    const [count, setCount] = useState(0) // useState for triggering re-renders brought on by state updates

    // *** PLEASE READ: The fetch(), .then(), .json(), async, await, Promise.all(), Promise.any() are in the worker.js file in the PUBLIC FOLDER
    // *** NAVIGATE TO PUBLIC FOLDER. NAVIGATE TO WORKER.JS!
    useEffect(() => {
        const worker = new Worker('./worker.js');
        const catApiKey = import.meta.env.CAT_API_KEY;
        const url = `https://api.thecatapi.com/v1/images/search?limit=1&${catApiKey}`;

        // console.log(url); // Note: As a test, we will see that the api key is read as undefined on console

        /* Old Code that only worked for singular image retrieval 
        const getMoreImages = () => {
            data().then((response) => {
                const img = document.createElement("img");
                img.src = response[0].url;
                img.className = "cat-picture";
                cardRef.current.appendChild(img);
                // console.log(response);
            })
                .catch((error) => {
                    alert(error);
                });
        };
        */

        // Old code (DOES NOT USE THE WEB WORKER and lags a little) that tried to incorporate more practice on promises
        /* let data = async () => (await fetch(url)).json();
        const getMoreImages = () => {
            Promise.all([data(), data()]).then((responses) => { // Working with multiple promises at once with .then() and Promise.all()
                responses.forEach((response) => {
                    const img = document.createElement("img"); // Creating a new img element
                    img.src = response[0].url;
                    img.className = "cat-picture";
                    cardRef.current.appendChild(img);
                    // console.log(response);
                })
                countImages(responses.length); // Counting the number of images fetched in array
            })
                .catch((error) => {
                    alert(error);
                });
        };

        const getFastestImage = () => {
            Promise.any([data(), data()]).then((response) => { // Getting data from the first successfully resolved promise
                const img = document.createElement("img");
                img.src = response[0].url;
                img.className = "cat-picture";
                cardRef.current.appendChild(img); // Appending to the current

                countImages(1); // The Promise.any() returns a single image every time
            })
                .catch((error) => {
                    alert(error + "All of the promises have failed");
                });
        };
        */

        /* Is a modified counter that utilizes States */
        const countImages = (numberOfImages) => {
            setCount((prevCount) => prevCount + numberOfImages)
        };
        /* getMoreImages with worker*/
        const getMoreImages = async () => {
            worker.postMessage({ task: "fetchAll", url }); // Communicating with the web worker
        };
        /* getFastestImage with worker */
        const getFastestImage = async () => {
            worker.postMessage({ task: "fetchAny", url }); // Communicating with the web worker
        }

        // Web worker (web worker file is in public folder due to it being read as an HTML document instead of js)
        // *** Note: PLEASE look at the worker.js file for the project requirement elements!!!
        worker.onmessage = (event) => {
            const { task, data, error } = event.data; // Destructuring
            if (error) {
                alert(`Error: ${error}`);
                return;
            }
            if (task === "fetchAll") {
                data.forEach((response) => {
                    const img = document.createElement("img"); // Creating a new img element
                    img.src = response[0].url;
                    img.className = "cat-picture";
                    cardRef.current.appendChild(img);
                });
                countImages(data.length);
            }
            if (task === "fetchAny") {
                const img = document.createElement("img"); // Creating a new img element
                img.src = data[0].url;
                img.className = "cat-picture";
                cardRef.current.appendChild(img);
                countImages(data.length);
                console.log(data.length);
            }
        }


        // Combining multiple actions into a single click handler
        btnRef.current.onclick = () => {
            getMoreImages();
            getFastestImage();
        };

        // Cleaning up: the component is unmounted/updated, and the worker is terminated as it is no longer needed
        return () => {
            worker.terminate();
        }
    }, []); // Note: the [] is the "dependency array" --> This allows us to control when the useEffect hook in React is triggered

    /* Note 2:
--> Passing an empty array []: the effect will run only once, after the initial render (when the component is mounted).
--> It won't run again unless the component is unmounted and remounted
--> Useful because... we are initializing workers/or setting up event listeners: only need these things once!
*/

    return (
        <div className="main-content">
            <img src={catLogo} alt="Logo for Cat Spotlight" className="logo" />
            <h1>Cat Spotlights of the Day</h1>
            <h3>Instructions: Click the button below</h3>
            <button className="generate-more" ref={btnRef}>Generate Cat Images: {count}</button>
            <div className="card cat-card" id="card" ref={cardRef}></div>
            {/* Accessing the prop */}
            <p>{message}</p>
        </div>
    )
}

MainContent.propTypes = { // Define the prop types for validation, required
    message: PropTypes.string.isRequired,
};

export default MainContent;