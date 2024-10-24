onmessage = async function (event) {
    const { task, url } = event.data;
    // Handling the message

    if (task === "fetchAll") {
        /* Old scrapped code that didn't incorporate await and didn't rely on async */
        // Promise.all([fetch(url), fetch(url)]).then(responses => Promise.all(responses.map(r => r.json())))
        //     .then(data => {
        //         postMessage({ task, data })
        //     })
        //     .catch(error => {
        //         postMessage({ error: 'Failed to fetch multiple images' });
        //     })

        try {
            const responses = await Promise.all([fetch(url), fetch(url)]);
            const jsonData = await Promise.all(responses.map(r => r.json()));

            postMessage({ task: "fetchAll", data: jsonData }); // Communicating with the Main Thread over on MainContent.jsx
            // Note: Promise.all() naturally returns you an array of data, so jsonData will be an array of results by default
        }

        catch (error) {
            postMessage({ task: "fetchAll", error });
        }

    } if (task === "fetchAny") {
        /* Old scrapped code that didn't incorporate await and didn't rely on async */
        // Promise.any([fetch(url), fetch(url)]).then(response => response.json())
        //     .then(data => {
        //         postMessage({ task, data });
        //     })
        //     .catch(error => {
        //         postMessage({ error: 'Failed to fetch the fastest image' })
        //     });

        try {
            const response = await Promise.any([fetch(url), fetch(url)]); // Retrieving a single response from multiple promises
            const jsonData = await response.json();

            const firstImage = jsonData[0];
            // console.log("Response from fetchAny:", jsonData)

            postMessage({ task:"fetchAny" , data: [firstImage] }); // Exporting and wrapping the single response's jsonData in an array since task "fetchAny" in MainContent.jsx will index for the first element: data[0]
            // Note: the [] wrapping jsonData[0] is just for consistency in how we handle the jsonData over in the MainContent.jsx: Dealing with same data form (arrays in this case) for 
            // 1) Uniformity and sanity check on data form for whoever has to look at this code back over in the Main Thread file
            // 2) Because for the ImageCounter function, I want for it to intake the array length (i.e. data.length) in all task cases just for uniformity and consistency again
        
        }
        catch (error) {
            postMessage({ task:"fetchAny" , error });
        }
    }
};