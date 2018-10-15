// XMLHttpRequest MDN example

var params = {
    email: "userName@123.com",
    password: "passWord"
}​​​;
var url =
    'https://9mkb55x7jk.execute-api.ap-southeast-2.amazonaws.com/test/symbiotic-labs/admin/auth?email=userName@123.com&password=passWord';

var xhr = new XMLHttpRequest();
xhr.open("POST", url, true);

//Send the proper header information along with the request
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

xhr.onreadystatechange = function () { //Call a function when the state changes.
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        // Request finished. Do processing here.
        alert("success...");
    } else {
        alert("failed");
    }
}
xhr.send(JSON.stringify(params));
// xhr.send(new Blob()); 
// xhr.send(new Int8Array()); 
// xhr.send(document);