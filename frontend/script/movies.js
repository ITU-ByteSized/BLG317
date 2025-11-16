fetch("http://127.0.0.1:5000/api/movies")
    .then(res => res.json())
    .then(data => {
        const ul = document.getElementById("movie-list")
        data.forEach(m => {
            const li = document.createElement("li")
            li.textContent = `${m.title} (${m.year})`
            ul.appendChild(li)
        })
    })
    .catch(err => console.error("API:", err))
