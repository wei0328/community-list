const BASE_URL = `https://lighthouse-user-api.herokuapp.com`
const INDEX_URL = BASE_URL + `/api/v1/users/`
const users = JSON.parse(localStorage.getItem('favoriteUsers')) || []

const datapanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderUserList(data) {
  let html = ``

  data.forEach((user) => {
    html += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${user.avatar}" class="card-img-top" alt="User Poster">
        <div class="card-body">
          <h5 class="card-title">${user.name + ` ` + user.surname}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#user-modal" data-id="${user.id}">More</button>
          <button class="btn btn-danger btn-remove-favorite" data-id="${user.id}">X</button>
        </div>
      </div>
    </div>
  </div>`
  })
  datapanel.innerHTML = html
}

function showUserDetails(id) {
  const modalName = document.querySelector("#user-modal-name")
  const modalAge = document.querySelector("#user-modal-age")
  const modalBirthday = document.querySelector("#user-modal-birthday")
  const modalEmail = document.querySelector("#user-modal-email")
  const modalRegion = document.querySelector("#user-modal-region")
  const modalImg = document.querySelector("#user-modal-avatar")

  modalName.innerHTML = ''
  modalAge.innerText = ' Age: '
  modalBirthday.innerText = ' Birthday: '
  modalEmail.innerText = ' Email: '
  modalRegion.innerText = ' Region: '
  modalImg.innerHTML = ''

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data;
      // console.log(data);
      modalName.innerHTML = data.name + ` ` + data.surname;
      modalAge.innerText = ` age: ` + data.age
      modalBirthday.innerText = ` birthday: ` + data.birthday;
      modalEmail.innerText = ` email: ` + data.email;
      modalRegion.innerText = ` region: ` + data.region;
      modalImg.innerHTML = `
        <img src="${data.avatar}" alt="user-avatar">
      `
    })
    .catch((error) => {
      console.log(error)
    });
}


// listen to data panel
datapanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserDetails(Number(event.target.dataset.id))
  }
  else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

function removeFromFavorite(id) {
  if (!users) return
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return
  //remove
  users.splice(userIndex, 1)
  //存回local storage
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  renderUserList(users)
}

renderUserList(users)