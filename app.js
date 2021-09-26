// Initialize Firebase(2)
var config = {
    apiKey: 'YOUR-API-KEY',
    authDomain: 'YOUR-AUTH-DOMAIN',
    databaseURL: 'YOUR-DATABASE-URL',
    projectId: 'YOUR-PROJECT-ID',
    storageBucket: 'YOUR-STORE-BUCKET',
    messagingSenderId: 'YOUR-MESSAGING-SENDER-ID'
  };
  firebase.initializeApp(config);
  
  //Reference for form collection(3)
  let formMessage = firebase.database().ref('register');
  
  //listen for submit event//(1)
  document
    .getElementById('registrationform')
    .addEventListener('submit', formSubmit);
  
  //Submit form(1.2)
  function formSubmit(e) {
    e.preventDefault();
    // Get Values from the DOM
    let name = document.querySelector('#name').value;
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    let bio = document.querySelector('#bio').value;
    let job = document.querySelector('#job').value;
    let interest = document.querySelector('#interest').value;
  
    //send message values
    sendMessage(name, email, password, bio, job, interest);
  
    //Show Alert Message(5)
    document.querySelector('.alert').style.display = 'block';
  
    //Hide Alert Message After Seven Seconds(6)
    setTimeout(function() {
      document.querySelector('.alert').style.display = 'none';
    }, 7000);
  
    //Form Reset After Submission(7)
    document.getElementById('registrationform').reset();
  }
  
  //Send Message to Firebase(4)
  
  function sendMessage(name, email, password, bio, job, interest) {
    let newFormMessage = formMessage.push();
    newFormMessage.set({
      name: name,
      email: email,
      password: password,
      bio: bio,
      job: job,
      Interest: interest
    });
  }