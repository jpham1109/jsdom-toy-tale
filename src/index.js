let addToy = false;

/* APPINIT */
document.addEventListener("DOMContentLoaded", () => {

  renderAllToys()

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    // addToy ? toyFormContainer.style.display = 'block' : 'none' 
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

/* Global Variables */
const toysCollection = document.querySelector('div#toy-collection')
const url = 'http://localhost:3000/toys'
const form = document.querySelector('form.add-toy-form')

/* Helper Function */
const renderAToy = (toyObj) => {
  const card = document.createElement('div')
  card.className = 'card'
  card.dataset.id = toyObj.id
  // card.style.textAlign = 'center'
  card.innerHTML = `
    <h2>${toyObj.name}</h2>
    <img src="${toyObj.image}" class="toy-avatar" alt="${toyObj.name}">
    <p>${toyObj.likes} Likes</p>
    <button class="like-btn"> 💛</button>
  `
  toysCollection.append(card)
}

const renderAllToys = () => {
  fetch(url)
  .then(resp => resp.json())
  .then(toys => {
    toys.forEach(toyObj => renderAToy(toyObj))
  })
}
/****/

const handleAddToy = (event) => {
  
  event.preventDefault()

  const name = event.target[0].value
  const image = event.target[1].value

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name, 
      image,
      likes: 0
    })
  })
    .then(resp => resp.json())
    .then(toyObj => renderAToy(toyObj))
  form.reset()
}


toysCollection.addEventListener('click', (event) => {
  
  if (event.target.matches('button.like-btn')) {
    const pLikes = event.target.previousElementSibling
    const newLikes = parseInt(pLikes.textContent) + 1
    const div = pLikes.closest('div')
    
    fetch(`http://localhost:3000/toys/${div.dataset.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({likes: newLikes})
    })
    .then(resp => resp.json())
    .then(toyObj => {
      pLikes.textContent = `${toyObj.likes} Likes`
  })
    
  }
})

form.addEventListener('submit', (event) => handleAddToy(event))


