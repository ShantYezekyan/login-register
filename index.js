import Fetch from './fetch.js';
import Cookie from './cookie.js';

const userFetch = new Fetch('https://api-nodejs-todolist.herokuapp.com/user');
const taskFetch = new Fetch('https://api-nodejs-todolist.herokuapp.com');
const token = new Cookie;

const registerData = {}
const loginData = {}
const userEditedData = {};
let userData = {};
let tasks = [];


const errorBlock = document.getElementById('error_container');
const registerPage = document.querySelector('.register_container')
const loginPage = document.querySelector('.login_container')


// -------- Display Pages ------------------------
const loginSuccess = () => {
    errorBlock.innerText = '';
    errorBlock.style.display = 'none';
    loginPage.style.display = 'none';
    document.querySelector('.user').style.display = 'block';
    document.querySelector('#user_greet').innerText = `Hello ${userData.name}`
    renderTasks()
}

const logOutSuccess = () => {
    document.querySelector('.user').style.display = 'none';
    loginPage.style.display = 'block';
    userData = {};
    document
}


// -------- Fetch fucntions ------------------------
document.getElementById('registration').addEventListener('submit', (e) => {
    e.preventDefault();
    userFetch.request('register', 'POST', { "Content-Type": "application/json" }, registerData)
    .then(res => {
        if (res.ok) {
            errorBlock.style.display = 'block';
            errorBlock.innerText = 'You Successfully Registered'
            setTimeout(() => {
                registerPage.style.display = 'none';
                loginPage.style.display = 'block';
            }, 3000)
        } else {
            res.json().then(jsonRes => {
                errorBlock.style.display = 'block';
                errorBlock.innerText = jsonRes;
            })
        }
    })

})

document.getElementById('login').addEventListener('submit', (e) => {
    e.preventDefault();
    userFetch.request('login', 'POST', { "Content-Type": "application/json" }, loginData)
    .then(res => {
        if (res.ok) {
            errorBlock.style.display = 'block';
            errorBlock.innerText = 'Success!'
            res.json().then(jsonRes => {
                userData = jsonRes.user
                token.setCookie('accessToken', jsonRes.token)
                console.log(userData);
                loginSuccess()
            })
        } else {
            res.json().then(jsonRes => {
                errorBlock.style.display = 'block';
                errorBlock.innerText = jsonRes;
            })
        }
    })
})



document.getElementById('logOutBtn').addEventListener('click', (e) => {
    userFetch.request('logout', 'POST', { 'Authorization': `Bearer ${token.getCookie('accessToken')}` })
    .then(res => {
        if (res.ok) {
            logOutSuccess()
        } else {
            res.json().then(jsonRes => {
                errorBlock.innerText = jsonRes.error;
            })
        }
    })
})

document.getElementById('deleteUserBtn').addEventListener('click', (e) => {
    userFetch.request('me', 'DELETE', { 'Authorization': `Bearer ${token.getCookie('accessToken')}` })
    .then(res => {
        if (res.ok) {
            logOutSuccess()
        } else {
            res.json().then(jsonRes => {
                errorBlock.innerText = jsonRes.error;
            })
        }
    })
})




document.getElementById('registration').addEventListener('change', (e) => {
    const { name, value } = e.target;
    registerData[name] = value;
});


document.getElementById('login').addEventListener('change', (e) => {
    const { name, value } = e.target;
    loginData[name] = value;
});


document.getElementById('signIn_redirect').addEventListener('click', (e) => {
    e.preventDefault()
    registerPage.style.display = 'none';
    loginPage.style.display = 'block';
})

document.getElementById('register_redirect').addEventListener('click', (e) => {
    e.preventDefault()
    loginPage.style.display = 'none';
    registerPage.style.display = 'block';
})

document.getElementById('editProfileForm').addEventListener('change', (e) => {
    const { name, value } = e.target;
    if (value) {
        userEditedData[name] = value;
    } else if (value === '') {
        delete userEditedData[name];
    }
});

document.getElementById('editUserBtn').addEventListener('click', (e) => {
    e.preventDefault()
    userFetch.request('me', 'PUT', {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token.getCookie('accessToken')}`
    }, userEditedData)
        .then(res => {
            if (res.ok) {
                logOutSuccess()
            } else {
                res.json().then(jsonRes => {
                    errorBlock.style.display = 'block'
                    errorBlock.innerText = jsonRes;
                })
            }
        })
})




// const intro = () => {
//     userFetch.get('me', {'Authorization': `Bearer ${token.getCookie('accessToken')}`})
//     loginSuccess()
// }
// intro()

const toggleProfileEdit = () => {
    const form = document.getElementById('editProfileForm')
   
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else if (form.style.display === 'block') {
        form.style.display = 'none';
    }
}

document.getElementById('profileEditorBtn').addEventListener('click', toggleProfileEdit)



// --------------------- Task Section -------------------------------



document.getElementById('addTaskBtn').addEventListener('click', () => {
    const data = {}
    data.description = document.getElementById('newTask').value
    taskFetch.request('task', 'POST', {"Content-Type": "application/json", 'Authorization': `Bearer ${token.getCookie('accessToken')}`}, data)
})

// taskFetch.request('task', 'POST', {"Content-Type": "application/json", 'Authorization': `Bearer ${token.getCookie('accessToken')}`}, 'description: Task 1')

const thCreator = (content, elToAppend) => {
    const th = document.createElement('th')
    th.innerText = content;
    elToAppend.appendChild(th)
}

const tdCreator = (arrData, order, elToAppend) => {
    const row = document.createElement('tr')
    const td1 = document.createElement('td')
    const td2 = document.createElement('td')
    const td3 = document.createElement('td')
    const td4 = document.createElement('td')

    td1.innerText = order
    row.appendChild(td1)

    td2.innerText = arrData.description
    row.appendChild(td2)

    if (arrData.completed) {
        td3.innerText = 'Done'
        row.appendChild(td3)
    } else {
        const doneBtn = document.createElement('button')
        doneBtn.setAttribute('id', arrData._id)
        doneBtn.innerText = 'Click to Complete'
        td3.appendChild(doneBtn)
        row.appendChild(td3)
    }

    const delBtn = document.createElement('button')
    delBtn.setAttribute('id', arrData._id)
    delBtn.innerText = 'Delete'
    td4.appendChild(delBtn)
    row.appendChild(td4)


    elToAppend.appendChild(row)
}

const tableCreator = () => {
    const container = document.querySelector('.task_container')
    const table = document.createElement('table')
    const thead = document.createElement('thead')
    table.appendChild(thead)
    const htr = document.createElement('tr')
    thCreator('Order', htr)
    thCreator('Task Name', htr)
    thCreator('Status', htr)
    thCreator('Action', htr)
    thead.appendChild(htr)
    container.appendChild(table)

    const tbody = document.createElement('tbody')
    table.appendChild(tbody)
    
    if (tasks.length !== 0) {
        tasks.forEach((el, index) => {
            tdCreator(el, index+1, tbody)
        });
    } 

    console.log(tasks); 
}





const renderTasks = () => {
    taskFetch.get('task', {"Content-Type": "application/json", 'Authorization': `Bearer ${token.getCookie('accessToken')}`})
    .then(res => {
        if (res.ok) {
            res.json().then(jsonRes => {
                // tasks.push(jsonRes.data)
                tasks = jsonRes.data
                tableCreator()
            })
        } else {
            res.json().then(jsonRes => {
                errorBlock.style.display = 'block' //Needs to be Checked
                errorBlock.innerText = jsonRes;
            })
        }
    })   
}

document.getElementById('testBtn').addEventListener('click', renderTasks)