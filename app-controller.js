console.log('We are inside client.js');

/* on page load  */
document.addEventListener('DOMContentLoaded', function() {
    // The input value isn't available until the DOM is parsed, 
    // but the fetch for /os can happen immediately.
    
    // Fetch OS details for hostname/environment display
    fetch("/os", {
            method: "GET"
        })
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
            // Corrected syntax
            throw new Error('Request failed for /os'); 
        }).catch(function(error) {
            console.error("Error fetching OS details:", error);
        })
        .then(function(data) {
            // Check if data is null (which can happen if the previous .catch handles the error)
            if (data) { 
                document.getElementById('hostname').innerHTML = `Pod - ${data.os} `
                // document.getElementById('environment').innerHTML = ` Env - ${data.env}  `
            }
        });
});


const btn = document.getElementById('submit');
if (btn) {
    // Note: The event listener is attached to the DOM element if it exists.
    btn.addEventListener('click', func);
}

function func(event) {
    event.preventDefault(); // Prevent default form submission if button is inside a form

    const planet_id = document.getElementById("planetID").value
    console.log("onClick Submit - Request Planet ID - " + planet_id)

    if (planet_id === "" || isNaN(planet_id)) {
        console.error("Please enter a valid planet ID (0-8).");
        return;
    }
    
    fetch("/planet", {
            method: "POST",
            body: JSON.stringify({
                id: planet_id // Use the stored value
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(function(res2) {
            if (res2.ok) {
                return res2.json();
            }
            // Check for specific error status (like the 404 from your API)
            if (res2.status === 404) {
                 // Throw an error with the response text from the server
                 return res2.text().then(text => { throw new Error(text); });
            }
            throw new Error('Request failed with status: ' + res2.status);
        })
        .catch(function(error) {
            // Log the error message to the console instead of using alert()
            const userError = error.message.includes("Ooops") ? error.message : "Error fetching planet. Check console for details.";
            document.getElementById('planetName').innerHTML = userError;
            console.error("Fetch Error:", error.message);
        })
        .then(function(data) {
            // This .then only runs if the fetch was successful (res2.ok)
            if (data) {
                document.getElementById('planetName').innerHTML = ` ${data.name} `

                const image = data.image; // Assume data.image is the URL string
                const element = document.getElementById("planetImage");
                
                // Directly set the background image URL
                element.style.backgroundImage  = `url('${image}')`;

                const planet_description = data.description;
                // Use a standard regex to break long lines for display
                document.getElementById('planetDescription').innerHTML = planet_description.replace(/(.{80})/g, "$1<br>");
            }
        });

}