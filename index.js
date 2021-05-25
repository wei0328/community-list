const BASE_URL = `https://lighthouse-user-api.herokuapp.com`
const INDEX_URL = BASE_URL + `/api/v1/users/`
const users = []
let filteredUsers = []
const USERS_PER_PAGE = 12

const datapanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')



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
          <button class="btn btn-info btn-add-favorite" data-id="${user.id}">+</button>
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
      modalName.innerHTML = data.name + ' ' + data.surname
      modalAge.innerText = ' Age: ' + data.age
      modalBirthday.innerText = ' Birthday: ' + data.birthday
      modalEmail.innerText = ' Email: ' + data.email
      modalRegion.innerText = ' Region: ' + data.region
      modalImg.innerHTML = `
        <img src="${data.avatar}" alt="user-avatar">
      `
    })
    .catch((error) => {
      console.log(error)
    });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('此用戶已加入')
  }
  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}



//saerch
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault() //取消預設事件
  //取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase()
  //儲存符合篩選條件的項目

  //條件篩選
  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword) ||
    user.surname.toLowerCase().includes(keyword)
  )
  //錯誤處理
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字${keyword}沒有符合條件的電影`)
  }
  //重製分頁器
  renderPaginator(filteredUsers.length)
  //重新輸出至畫面
  renderUserList(getUsersByPage(1))
})

paginator.addEventListener('click', (event) => {
  //如果被點擊的不是<a>標籤，結束
  if (event.target.tagName !== 'A') return
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderUserList(getUsersByPage(page))
})


//每頁所要展示的電影
function getUsersByPage(page) {
  //開始計算index
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

//分頁總頁數
function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// listen to data panel
datapanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserDetails(Number(event.target.dataset.id))
  }
  else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    renderPaginator(users.length)
    //renderUserList(users)
    renderUserList(getUsersByPage(1))
  })
  .catch((error) => {
    console.log(error)
  });

