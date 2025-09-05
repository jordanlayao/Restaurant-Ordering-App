import { menuArray } from '/data.js'

function getMenuArray(array){
  return array.map(property => {
  
    const {
      name,
      ingredients,
      price,
      image
    } = property
    
    return `
    <section class="item">
      <div class="item-image">
        <img src="images/${image}" alt="pizza">
      </div>
      <div class="item-details">
        <div class="item-details-container">
          <div class="detail-header">
              <p class="item-title">${name}</p>
              <p class="item-ingredients">${ingredients}</p>
          </div>
          <div class="detail-footer">
            <p class="item-price">$${price}</p>
          </div>
      </div>    
        <button class="add-button">+</button>             
      </div>
  </section>`
  
}).join('')
}

document.getElementById('main-container').innerHTML = getMenuArray(menuArray)
