// Main assignment function to perform everything

const assignment = (url) => {
    fetch(url)
        .then((response) => {
            // Check response status and return response if status is ok ( 200 )
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else {
                return response;
            }
        })
        .then(async (data) => {
            /**
             * waits for assignment id to be fetched from headers in response
             * waits for data to be converted into json.
             * returns obejct with assignmentID and data in JSON formant
             */
            const assignmentID = data.headers.get("x-assignment-id");
            const jsonData = await data.json();
            return { assignmentID: assignmentID, data: jsonData };
        })
        .then(async (dataObject) => {
            /**
             * Calls data analysis function on JSON data received
             * Logs result
             * returns top most frequent word
             */
            const result = await dataAnalysis(dataObject.data);
            return { result: result, assignmentID: dataObject.assignmentID };
        })
        .then((data) => {
            /**
             * Create final object with assignment id and most frequent word
             * Post the object to api using fetch in JSON format
             */
            finalSubmission = {
                assignment_id: data.assignmentID,
                answer: data.result,
            };

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalSubmission),
            }).then(async (response) => {
                const responseJSON = await response.json();
                console.log(responseJSON);
            });
        })
        .catch((error) => {
            console.error("An error occured while fetching the data:", error);
        });
};

const dataAnalysis = (data) => {
    // Create a new object with elements and their frequency

    result = {};
    data.forEach((element) => {
        if (result[element]) {
            result[element] += 1;
        } else {
            result[element] = 1;
        }
    });

    // Fetch the entries from object and sort them in decending order
    result = Object.entries(result).sort((a, b) => b[1] - a[1]);

    console.log(
        `Most frequent word: ${result[0][0]} frequency: ${result[0][1]}`
    );

    return result[0][0];
};

const email = "praanshugrover60@gmail.com";
const url = `https://one00x-data-analysis.onrender.com/assignment?email=${email}`;

assignment(url);
