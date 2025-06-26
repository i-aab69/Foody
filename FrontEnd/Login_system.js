import { get_users,send_user } from './API_Calls.js';

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('main');
    const goToSignupBtn = document.getElementById('go-to-signup');
    const goToLoginBtn = document.getElementById('go-to-login');
    
    goToSignupBtn.addEventListener('click', function() {
        container.classList.add('right-panel-active');
    });
    
    goToLoginBtn.addEventListener('click', function() {
        container.classList.remove('right-panel-active');
    });
    
    initRoleToggle(document.querySelector('.login-container'));
    initRoleToggle(document.querySelector('.signup-container'));
    
    initLoginForm();
    initSignupForm();
    
    function initRoleToggle(container) {
        const userRole = container.querySelector('.role.user');
        const adminRole = container.querySelector('.role.admin');
      
        userRole.addEventListener('click', function () {
            userRole.disabled = true;
            adminRole.disabled = false; 
            userRole.classList.add('active');
            adminRole.classList.remove('active');
        });
      
        adminRole.addEventListener('click', function () {
            userRole.disabled = false;
            adminRole.disabled = true; 
            adminRole.classList.add('active');
            userRole.classList.remove('active');
        });
    }
    
    function initLoginForm() {
        const loginForm = document.getElementById('login-form');
        const usernameInput = loginForm.querySelector('input.username');
        const passwordInput = loginForm.querySelector('input.password');
        const loginBtn = loginForm.querySelector('.login-btn-form');
        const roleBtn = document.querySelector(".role-toggle"); 
        console.log(roleBtn)
        let is_admin = false; 
      
        loginBtn.addEventListener('click',async function (e) {
            e.preventDefault();
            let isValid = true;
        
            if (usernameInput.value.trim() === '') {
                alert('Username is required');
                isValid = false;
            }
            else if (passwordInput.value.trim() === '') {
                alert('Password is required');
                isValid = false;
            }
            console.log(roleBtn.querySelector('.user'))
            console.log(roleBtn.querySelector('.admin'))
            if (roleBtn.querySelector('.user').disabled == false && roleBtn.querySelector('.admin').disabled == true) {
                is_admin = true;
            }
        
            if (isValid) {
                console.log('Login attempt successful');
                console.log('Username:', usernameInput.value);

                const users = await get_users();
                console.log(users);
                let user_ = users.find(user => user.username == usernameInput.value.trim());
                console.log(user_);
                
                if (user_ === undefined) {
                    alert("there is no such a user");
                }
                else if (user_.password != passwordInput.value.trim()) {
                    alert("Password incorect");
                }
                else {

                    const userIsAdmin = user_.is_admin || false;
                    console.log('User is_admin:', userIsAdmin);
                    console.log('Expected is_admin:', is_admin);
                    
                    localStorage.setItem('LoggedUser', JSON.stringify({ UserName: usernameInput.value.trim(), Role : is_admin }));
                    if (userIsAdmin != is_admin) {
                        alert("wrong Role");
                    }
                    else {
                        if (is_admin) {
                            window.location.href = "my_recipe.html";
                        }
                        else {
                            window.location.href = "home.html";
                        }
                        loginForm.reset();
                    }
                }

            }
        

                // let accounts = JSON.parse(localStorage.getItem("Accounts")) || [];
                // console.log(accounts[0]);
                // let user = accounts.find(account => account.UserName == usernameInput.value.trim());
                // console.log(user);
                // if (user === undefined) {
                //     alert("there is no such a user");
                // }
                // else if (user.Password != passwordInput.value.trim()) {
                //     alert("Password incorect");
                // }
                // else if (user.Role != Role) {
                //     alert("wrong Role");
                // }
                // else {
                //     if (Role == "Admin") {
                //         window.location.href = "my_recipe.html";
                //     }
                //     else {
                //         window.location.href = "home.html";
                //     }
                //     loginForm.reset();
                // }
            });
    }

    function initSignupForm() {
        const signupForm = document.getElementById('signup-form');
        const usernameInput = signupForm.querySelector('input.username');
        const passwordInput = signupForm.querySelector('input.password');
        const confirmPasswordInput = signupForm.querySelector('input.confirm-password');
        const roleBtn = document.querySelector('#signup-toggle');
        const emailInput = signupForm.querySelector('input.email');
        const signupBtn = signupForm.querySelector('.signup-btn');
        let is_admin = false; 
        
        signupBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            let isValid = true;
        
            if (usernameInput.value.trim() === '') {
                alert('Username is required');
                isValid = false;
            }
            else if (passwordInput.value.trim() === '') {
                alert('Password is required');
                isValid = false;
            }
            else if (confirmPasswordInput.value.trim() === '') {
                alert('Confirm Password is required');
                isValid = false;
            }
            else if (passwordInput.value !== confirmPasswordInput.value) {
                alert('Passwords do not match');
                isValid = false;
            }
            else if (emailInput.value.trim() === '') {
                alert('Email is required');
                isValid = false;
            }

            if (roleBtn.querySelector('.user').disabled == false && roleBtn.querySelector('.admin').disabled == true) {
                 is_admin = true; 
            }
            
          
            if (isValid) {
                const user_acount = {
                    username : usernameInput.value.trim(),
                    password : passwordInput.value.trim(),
                    email : emailInput.value.trim(),
                    is_admin : is_admin
                }
                const response = await send_user(user_acount)
                if (response.status === 201) {
                    alert("User created successfully");
                    const users = await get_users();
                    console.log(users)
                    localStorage.setItem('all_users', JSON.stringify(users));
                    signupForm.reset();
                    container.classList.remove('right-panel-active');
                    

                }
                else {
                    alert("User creation failed");

                }

                // console.log('Form submitted successfully');
                // let accounts = JSON.parse(localStorage.getItem("Accounts")) || [];
                // let account = { UserName: usernameInput.value.trim(), Role: Role, Password: passwordInput.value.trim(), Email: emailInput.value.trim() };
                // accounts.push(account);
                // localStorage.setItem("Accounts", JSON.stringify(accounts));
                // signupForm.reset();
                // container.classList.remove('right-panel-active');
            }
        });
    }
});

