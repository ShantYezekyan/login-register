const registerData = {
    name: '',
    email: '',
    age: '',
    password: ''
};

const loginData = {
    email: '',
    password: ''
}

let userData = {};

const userEditedData = {};

document.getElementById('registration').addEventListener('submit', (e) => {
    e.preventDefault();
    fetch("https://api-nodejs-todolist.herokuapp.com/user/register", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
    })

    .then(res => {
        if (res.ok) {
            document.getElementById('error_container').style.display = 'block';
            document.getElementById('error_container').innerText = 'You Successfully Registered'
            setTimeout(() => {
                document.querySelector('.register_container').style.display = 'none';
                document.querySelector('.login_container').style.display = 'block';
            }, 3000)
        } else {
            res.json().then(jsonRes => {
                document.getElementById('error_container').style.display = 'block';
                document.getElementById('error_container').innerText = jsonRes;
            })
        }
    })
        
})

document.getElementById('login').addEventListener('submit', (e) => {
    e.preventDefault();
    fetch("https://api-nodejs-todolist.herokuapp.com/user/login", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
        
    .then(res => {
        if (res.ok) {
            document.getElementById('error_container').style.display = 'block';
            document.getElementById('error_container').innerText = 'Success!'
            res.json().then(jsonRes => {
                userData = jsonRes.user
                userData.myToken = jsonRes.token;
                loginSuccess() 
            })
        } else {
            res.json().then(jsonRes => {
                document.getElementById('error_container').style.display = 'block';
                document.getElementById('error_container').innerText = jsonRes;
            })
        }
    })
})

const logOutSuccess = () => {
    document.querySelector('.user').style.display = 'none';
    document.querySelector('.login_container').style.display = 'block';
    userData = {};
}


const loginSuccess = () => {
    document.getElementById('error_container').innerText = '';
    document.getElementById('error_container').style.display = 'none';
    document.querySelector('.login_container').style.display = 'none';
    document.querySelector('.user').style.display = 'block';
    document.querySelector('#user_greet').innerText = `Hello ${userData.name}`
}

document.getElementById('logOutBtn').addEventListener('click', (e) => {
    fetch("https://api-nodejs-todolist.herokuapp.com/user/logout", {
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${userData.myToken}`
        }
    })

    .then(res => {
        if (res.ok) {
            logOutSuccess()
        } else {
            res.json().then(jsonRes => {
                document.getElementById('error_container').innerText = jsonRes.error;
            })
        }
    })
})

document.getElementById('deleteUserBtn').addEventListener('click', (e) => {
    fetch("https://api-nodejs-todolist.herokuapp.com/user/me", {
        method: 'DELETE',
        headers: {
            'Authorization' : `Bearer ${userData.myToken}`
        }
    })

    .then(res => {
        if (res.ok) {
            logOutSuccess()
        } else {
            res.json().then(jsonRes => {
                document.getElementById('error_container').innerText = jsonRes.error;
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
    document.querySelector('.register_container').style.display = 'none';
    document.querySelector('.login_container').style.display = 'block';
})

document.getElementById('register_redirect').addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('.login_container').style.display = 'none';
    document.querySelector('.register_container').style.display = 'block';
})

document.getElementById('editUser').addEventListener('change', (e) => {
    const { name, value } = e.target;
    if (value) {
        userEditedData[name] = value;
    } else if (value === '') {
        delete userEditedData[name];
    }
});

document.getElementById('editUserBtn').addEventListener('click', (e) => {
    e.preventDefault()
    fetch("https://api-nodejs-todolist.herokuapp.com/user/me", {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            'Authorization' : `Bearer ${userData.myToken}`
        },
        body: JSON.stringify(userEditedData)
    })
    .then(res => {
        if (res.ok) {
            logOutSuccess()
        } else {
            res.json().then(jsonRes => {
                document.getElementById('error_container').style.display = 'block'
                document.getElementById('error_container').innerText = jsonRes;
            })
        }
    })
})

