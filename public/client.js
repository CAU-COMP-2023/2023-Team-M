const authModule = (function(){
    'use strict';
    //let _userAccessToken = '';

    const getCreds = function(e) {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pwd = document.getElementById('password').value;
        //console.log(user, pwd);
        const dataToSend = {
            user, //abbrv. user: user
            pwd
        };
        let endpoint = '';
        if(window.location.pathname === "/auth") {
            endpoint = 'http://localhost:3000/auth';
        } 
        if(window.location.pathname === "/register") {
            endpoint = 'http://localhost:3000/register';
        }
        _sendCreds(dataToSend, endpoint)
    }

    const _sendCreds = function(dataToSend, endpoint) {
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            credentials: 'include', 
            body: JSON.stringify(dataToSend), 
        })
            .then(response => {
                if (response.ok) {
                    //DOMHandler.showAccountArea(dataToSend.user); //old code
                    getLoginState();
                }
                return response.json(); // Parse the JSON response
            })
            .then(data => {
                // Handle the parsed response data
                alert(data.msg);
                //_userAccessToken = data.accessToken;
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }

    const logout = function() {
        fetch("http://localhost:3000/logout", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
            },
            // credentials: 'include', 
            // body: JSON.stringify(dataToSend), 
        })
            .then(response => {
                if (response.ok) {
                    DOMHandler.hideAccountArea();
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }

    const getLoginState = function() {
        fetch('http://localhost:3000/username', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
            },
            credentials: 'include'
        })
        .then(response => {
            if(response.status === 200) {
                return response.json(); //response.json() returns a promise
            } else if(response.status === 401) {
                return null;
            } else {
                throw Error(`Unexpected fetchUserName result: ${response.status}, typeof=${typeof response.status}`);
            }
        })
        .then(data => {
            if(data !== null) {
                DOMHandler.showAccountArea(data.msg);
            }
            return data;
        })
        .catch(err => {
            console.error(err);
        })
    }
    return { getCreds, logout, getLoginState };
})();

const DOMHandler = (function(){
    let accountArea; //share btw methods in DOMHandler
    let accountInfo;

    const createAccountArea = function() {
        accountArea = document.createElement('div');
        accountArea.setAttribute('id', "account-area");
        accountArea.style.display = "none";
        const accountImg = document.createElement('span');
        accountImg.setAttribute("class", "material-symbols-outlined");
        accountImg.innerText = "account_circle";
        accountInfo = document.createElement('span');
        accountInfo.setAttribute('id', "user-info");
        const logoutBtn = document.createElement('button');
        logoutBtn.setAttribute("id", "logout-btn")
        logoutBtn.innerText = "Sign out";

        accountArea.appendChild(accountImg);
        accountArea.appendChild(accountInfo);
        accountArea.appendChild(logoutBtn);

        document.body.appendChild(accountArea);
    }

    
    const showAccountArea = function(username) {
        accountInfo.innerHTML = `<b>${username}</b>`; //validation of username is required in future code
        accountArea.style.display = "inline-block";
    }

    const hideAccountArea = function() {
        accountArea.style.display = "none";
    }

    return { createAccountArea, showAccountArea, hideAccountArea };
})();

//init
DOMHandler.createAccountArea();
authModule.getLoginState();

const formSubmitBtn = document.querySelector('form > button');
if(formSubmitBtn) {
    formSubmitBtn.addEventListener('click', authModule.getCreds); //must initialize authModule.getCreds first .... no hoisting here
}

const logoutBtn = document.getElementById('logout-btn');
if(logoutBtn) {
    logoutBtn.addEventListener('click', authModule.logout);
}


