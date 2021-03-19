const mailButton = document.querySelector(".mail_button");
const mailList = document.querySelector(".msg_list");
const smail = document.getElementById('mailSchedule');
const setDateTime = document.querySelector("#s_time");


mailButton.addEventListener("click",() => {
  if(mailList.classList.contains("active")){
    mailButton.setAttribute("aria-expanded", "false");
    mailList.classList.remove("active");
  }
  else {
    mailList.classList.add("active");
    mailButton.setAttribute("aria-expanded","true");
  }
})

smail.addEventListener("click", ()=>{
       setDateTime.disabled = false;
})

updateList = function() {
  var input = document.querySelector('#file_up');
  var output = document.getElementById('fileList');

  output.innerHTML = '<ul>';
  for (var i = 0; i < input.files.length; ++i) {
    output.innerHTML += '<li>' + input.files.item(i).name + '</li>';
  }
  output.innerHTML += '</ul>';
}

//getting the mail data
const sendButton = document.querySelector('#mailSend');
sendButton.addEventListener('click', async (e) => {
  const toSend = document.querySelector('#to').value;
  const subject = document.querySelector('#sub').value;
  const mailBody = document.querySelector('#mail_body').value;
  const fileSend = document.querySelector('#file_up').value;
  let schedule = document.querySelector('#s_time').value;
  const toError = document.querySelector('#to_error');

  if(schedule == "2017-06-13T13:00"){
    schedule = "";
  }
  if(!toSend){
    toError.innerHTML = "Provide the receiver's Email id";
  }
  else{
    try{
      const res = await fetch('/sendMail', {
        method: 'POST',
        body: JSON.stringify({
          toSend,
          subject,
          mailBody,
          fileSend,
          schedule
        }),
        headers:{'Content-Type': 'application/json'}
      });
      const data = await res.json();
      console.log(data);
    }
    catch(err){
      console.log(err);
    }
  }

  // console.log("to addr"  , toSend);
  // console.log("subject" , subject);
  // console.log("mail body" , mailBody);
  // console.log("file" , fileSend);
  // console.log("schedule time" , schedule);


});